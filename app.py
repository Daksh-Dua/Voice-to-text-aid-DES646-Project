<<<<<<< HEAD
from flask import Flask, render_template, request
import whisper
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import os

app = Flask(__name__)

# Load models once
asr_model = whisper.load_model("base")
sum_model = AutoModelForSeq2SeqLM.from_pretrained("facebook/bart-large-cnn")
tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload():
    file = request.files["audio"]
    filepath = os.path.join("static", file.filename)
    file.save(filepath)

    # Transcribe
    result = asr_model.transcribe(filepath)
    transcript = result["text"]

    # Summarize
    inputs = tokenizer(transcript, return_tensors="pt", truncation=True, max_length=1024)
    summary_ids = sum_model.generate(**inputs, max_length=150, min_length=50)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return render_template("result.html", transcript=transcript, summary=summary)
=======
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os

from sliding_window_summarizer import process_audio

app = Flask(__name__, static_folder="out", static_url_path="/")
app.config["UPLOAD_FOLDER"] = "uploads"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

@app.route("/api/summarize", methods=["POST"])
def summarize_endpoint():
    """POST an audio file → returns a summary"""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)

    try:
        summary = process_audio(file_path)
        if not summary:
            return jsonify({"error": "No transcription found in audio"}), 400
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    """Serve frontend (if available)"""
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
>>>>>>> 406e1055de3dd3319fc207f448e8587955221016
