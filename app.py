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