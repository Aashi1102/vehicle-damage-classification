from pathlib import Path
from xml.parsers.expat import model
import torch
from torch import nn
from torchvision import models, transforms
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "saved_model.pth"

CLASS_NAMES = [
    "Front Breakage",
    "Front Crushed",
    "Front Normal",
    "Rear Breakage",
    "Rear Crushed",
    "Rear Normal",
]

trained_model = None


class CarClassifierResNet(nn.Module):
    def __init__(self, num_classes=6, dropout_rate=0.2):
        super().__init__()
        self.model = models.resnet50(weights=None)

        for param in self.model.parameters():
            param.requires_grad = False

        for param in self.model.layer4.parameters():
            param.requires_grad = True

        self.model.fc = nn.Sequential(
            nn.Dropout(dropout_rate),
            nn.Linear(self.model.fc.in_features, num_classes),
        )

    def forward(self, x):
        return self.model(x)


def load_model():
    global trained_model
    if trained_model is None:
        trained_model = CarClassifierResNet()
        state = torch.load(MODEL_PATH, map_location="cpu")
        trained_model.load_state_dict(state)
        trained_model.eval()
    return trained_model


TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
])


def predict(image_path):
    image = Image.open(image_path).convert("RGB")
    tensor = TRANSFORM(image).unsqueeze(0)
    model = load_model()

    with torch.no_grad():
        logits = model(tensor)
        probabilities = torch.softmax(logits, dim=1)[0]
        index = int(torch.argmax(probabilities).item())

    label = CLASS_NAMES[index]
    confidence = float(probabilities[index].item() * 100)

    if "Normal" in label:
        status = "Normal"
        damage_type = "No significant damage"
    elif "Breakage" in label:
        status = "Damage Detected"
        damage_type = "Breakage"
    else:
        status = "Damage Detected"
        damage_type = "Crushed"

    vehicle_area = "Front" if label.startswith("Front") else "Rear"

    return {
        "prediction": label,
        "confidence": round(confidence, 2),
        "status": status,
        "damage_type": damage_type,
        "vehicle_area": vehicle_area,
        "class_probabilities": {
            CLASS_NAMES[i]: round(float(probabilities[i].item() * 100), 2)
            for i in range(len(CLASS_NAMES))
        },
    }
