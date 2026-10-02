from pathlib import Path
import uuid

from flask import Flask, jsonify, render_template, request
from PIL import Image

from model.model_helper import predict

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "static" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def prediction():
    file = request.files.get("image")

    if not file or not file.filename:
        return jsonify({"error": "Please select an image first."}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Please upload a JPG, JPEG, PNG, or WEBP image."}), 400

    extension = file.filename.rsplit(".", 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{extension}"
    output_path = UPLOAD_DIR / filename

    try:
        image = Image.open(file.stream)
        image.verify()
        file.stream.seek(0)
        Image.open(file.stream).convert("RGB").save(output_path)

        result = predict(output_path)
        result["image_url"] = f"/static/uploads/{filename}"
        return jsonify(result)
    except Exception as exc:
        if output_path.exists():
            output_path.unlink(missing_ok=True)
        return jsonify({"error": f"Could not analyze the image: {exc}"}), 500


@app.errorhandler(413)
def too_large(_):
    return jsonify({"error": "Image is too large. Maximum size is 10 MB."}), 413


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
