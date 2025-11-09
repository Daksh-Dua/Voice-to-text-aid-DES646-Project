from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import whisper
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# Import your summarization logic
from sliding_window_summarizer import process_audio

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Define upload folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/api/upload", methods=["POST"])
def upload_audio():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    audio = request.files["file"]
    if audio.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    filename = secure_filename(audio.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    audio.save(filepath)

    try:
        # Process audio file using Whisper + summarizer
        results = process_audio(filepath)
        return jsonify({"status": "success", "results": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Voice-to-Text API is running!"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
