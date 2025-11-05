from flask import Flask, request, jsonify, send_from_directory
import whisper
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import os
from werkzeug.utils import secure_filename

# -----------------------
# Flask App Configuration
# -----------------------
app = Flask(__name__, static_folder="out", static_url_path="/")
app.config["UPLOAD_FOLDER"] = "uploads"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# -----------------------
# Load Models Once
# -----------------------
print("🔹 Loading Whisper + Pegasus models...")
device = "cuda" if torch.cuda.is_available() else "cpu"
whisper_model = whisper.load_model("base")
tokenizer = AutoTokenizer.from_pretrained("google/pegasus-arxiv")
pegasus_model = AutoModelForSeq2SeqLM.from_pretrained("google/pegasus-arxiv").to(device)
print("✅ Models ready!")

# -----------------------
# Helper Functions
# -----------------------
def transcribe_audio(audio_path):
    """Transcribe audio file using Whisper"""
    result = whisper_model.transcribe(audio_path)
    return result["segments"]

def chunk_segments(segments, chunk_size=400):
    """Split transcript into chunks of ~400 words"""
    chunks, chunk, count = [], {"start": segments[0]["start"], "text": ""}, 0
    for seg in segments:
        words = seg["text"].split()
        count += len(words)
        chunk["text"] += " " + seg["text"]
        if count >= chunk_size:
            chunk["end"] = seg["end"]
            chunks.append(chunk)
            chunk, count = {"start": seg["start"], "text": ""}, 0
    if chunk["text"].strip():
        chunk["end"] = segments[-1]["end"]
        chunks.append(chunk)
    return chunks

def summarize_text(text, min_len=30, max_len=120):
    """Summarize text using Pegasus"""
    inputs = tokenizer(text, truncation=True, padding="longest", return_tensors="pt", max_length=1024).to(device)
    summary_ids = pegasus_model.generate(**inputs, num_beams=6, min_length=min_len, max_length=max_len)
    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)

def process_audio(audio_path):
    """Full pipeline: Transcribe → Chunk → Summarize"""
    segments = transcribe_audio(audio_path)
    chunks = chunk_segments(segments)
    summaries = [summarize_text(chunk["text"]) for chunk in chunks]
    return " ".join(summaries)

# -----------------------
# API Endpoint
# -----------------------
@app.route("/api/summarize", methods=["POST"])
def summarize_endpoint():
    """POST audio file → returns summary"""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)

    try:
        summary = process_audio(file_path)
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------
# Serve Next.js Frontend
# -----------------------
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

# -----------------------
# Run App
# -----------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
