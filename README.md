# 🚗 Vehicle Damage Classification

An end-to-end deep learning project that classifies vehicle images based on **damage type and vehicle area** using a fine-tuned **ResNet50** model. The trained model is integrated with a **Flask web application** that provides an interactive interface for uploading an image and receiving a prediction with confidence scores.

---

## 📌 Project Overview

Vehicle damage assessment is an important part of vehicle inspection and insurance-related workflows. Manual inspection can be time-consuming and may require domain expertise.

This project explores how **computer vision and deep learning** can be used to automatically classify vehicle images into different damage categories.

The project covers the complete machine learning workflow:

```text
Dataset
   ↓
Data Preprocessing
   ↓
Model Training
   ↓
Model Comparison
   ↓
Evaluation
   ↓
Model Saving
   ↓
Flask Integration
   ↓
Web-Based Prediction
```

---

## 🎯 Objective

The objective of this project is to develop a deep learning model that can identify:

- Whether the vehicle is normal or damaged
- The type of damage
- Whether the image represents the front or rear of the vehicle

The final model performs **6-class classification**.

---

## 🏷️ Classification Classes

The model predicts one of the following six classes:

| Class | Description |
|---|---|
| `F_Breakage` | Front side with breakage |
| `F_Crushed` | Front side with crushed damage |
| `F_Normal` | Normal front side |
| `R_Breakage` | Rear side with breakage |
| `R_Crushed` | Rear side with crushed damage |
| `R_Normal` | Normal rear side |

---

## 🧠 Model Development

Multiple deep learning approaches were experimented with during model development.

| Model | Validation Accuracy |
|---|---:|
| Custom CNN | 58.61% |
| CNN + Regularization | 56.70% |
| EfficientNet-B0 | 72.17% |
| ResNet50 | **77.74%** |

Based on the experiments, **ResNet50** was selected for the final application.

### ResNet50 Configuration

The final model uses:

- ResNet50 architecture
- Transfer learning
- ImageNet-based ResNet architecture
- Frozen pretrained layers
- Fine-tuned `layer4`
- Custom classification head
- Dropout: `0.2`
- Number of output classes: `6`
- Optimizer: Adam
- Learning rate: `0.005`
- Loss function: Cross Entropy Loss
- Training epochs: `10`

The trained model is saved as:

```text
model/saved_model.pth
```

---

## 🖼️ Image Preprocessing

Input images are processed before being passed to the model.

```text
Input Image
     ↓
Resize to 224 × 224
     ↓
Convert to Tensor
     ↓
ImageNet Normalization
     ↓
ResNet50
```

The inference preprocessing uses:

```python
transforms.Resize((224, 224))
transforms.ToTensor()
transforms.Normalize(
    mean=[0.485, 0.456, 0.406],
    std=[0.229, 0.224, 0.225]
)
```

The Flask inference code uses the same `224 × 224` input size and ImageNet normalization as the model pipeline. 

---

## 📊 Model Performance

The final ResNet50 model achieved approximately **77% validation accuracy**.

The validation classification report was:

| Class | Precision | Recall | F1-Score |
|---|---:|---:|---:|
| Front Breakage | 0.80 | 0.81 | 0.80 |
| Front Crushed | 0.79 | 0.61 | 0.69 |
| Front Normal | 0.78 | 0.94 | 0.85 |
| Rear Breakage | 0.81 | 0.78 | 0.79 |
| Rear Crushed | 0.66 | 0.56 | 0.61 |
| Rear Normal | 0.73 | 0.83 | 0.78 |

**Overall validation accuracy:** approximately **77%**

The results show that performance varies across damage categories, with the crushed categories being more challenging for the model.

---

## 🌐 Flask Web Application

The trained model is integrated into a Flask-based web application.

The application allows users to:

- Upload a vehicle image
- Drag and drop an image
- Preview the selected image
- Run the trained model
- View the predicted class
- View prediction confidence
- Identify vehicle area
- Identify damage type
- View probabilities for all six classes
- Analyze another image

The frontend sends the uploaded image to the Flask `/predict` endpoint, where the model performs inference and returns the prediction results.

---

## 🖥️ Application Workflow

```text
User Uploads Image
        ↓
Flask Receives Image
        ↓
Image Validation
        ↓
Image Preprocessing
        ↓
ResNet50 Model
        ↓
Softmax Probabilities
        ↓
Predicted Class
        ↓
Damage & Area Extraction
        ↓
JSON Response
        ↓
Frontend Result Display
```

---

## 🛠️ Tech Stack

### Programming
- Python

### Machine Learning / Deep Learning
- PyTorch
- Torchvision
- ResNet50
- Transfer Learning

### Data Processing
- NumPy
- Pandas
- Pillow

### Web Development
- Flask
- HTML
- CSS
- JavaScript

### Development Environment
- Jupyter Notebook
- Git
- GitHub

---

## 📁 Project Structure

```text
vehicle-damage-classification/
│
├── README.md
├── requirements.txt
├── .gitignore
├── .gitattributes
│
├── app.py
│
├── model/
│   ├── __init__.py
│   ├── model_helper.py
│   └── saved_model.pth
│
├── notebooks/
│   └── vehicle_damage_classification.ipynb
│
├── templates/
│   └── index.html
│
├── static/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   └── script.js
│   │
│   ├── images/
│   │   └── car-hero.jpg
│   │
│   └── uploads/
│       └── .gitkeep
│
└── screenshots/
    ├── home.png
    └── prediction.png
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/vehicle-damage-classification.git
```

Navigate to the project:

```bash
cd vehicle-damage-classification
```

---

### 2. Create a Virtual Environment

For Windows:

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

---

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 4. Verify the Model

Make sure the trained model exists at:

```text
model/saved_model.pth
```

The application loads this model through:

```text
model/model_helper.py
```

---

### 5. Run the Flask Application

```bash
python app.py
```

You should see something similar to:

```text
Running on http://127.0.0.1:5000
```

Open the application in your browser:

```text
http://127.0.0.1:5000
```

---

## 📷 Using the Application

1. Open the Flask application.
2. Click **Choose Image** or drag an image into the upload area.
3. Preview the selected vehicle image.
4. Click **Analyze Damage**.
5. The model generates a prediction.
6. The application displays:
   - Predicted class
   - Confidence
   - Vehicle area
   - Damage type
   - Probability of each class

---

## 🔬 Model Inference

The Flask application reconstructs the ResNet50 architecture before loading the trained `state_dict`.

The model contains six output classes corresponding to the project's classification categories.

For an input image, the model generates logits which are converted into class probabilities using Softmax:

```python
probabilities = torch.softmax(logits, dim=1)
```

The class with the highest probability is selected as the final prediction.

---

## 📈 Key Learning Outcomes

Through this project, I worked on:

- Image classification
- Convolutional Neural Networks
- Transfer learning
- ResNet50
- Data augmentation
- Image preprocessing
- Model evaluation
- Classification reports
- Model comparison
- PyTorch model saving and loading
- Flask model deployment
- Frontend-backend integration
- REST-style prediction endpoint

---

## ⚠️ Limitations

This project has several limitations:

- The model is trained for only six classes.
- Performance depends on the quality and viewpoint of the input image.
- Some damage categories are more difficult to classify than others.
- The validation accuracy is approximately 77%, so predictions should not be treated as a substitute for professional vehicle inspection.
- The model has not been evaluated on a large independent real-world dataset.

---

## 🔮 Future Improvements

Potential improvements include:

- Increase the size and diversity of the dataset
- Add more vehicle damage categories
- Improve classification of crushed-damage images
- Experiment with additional transfer-learning architectures
- Use hyperparameter optimization
- Add object detection to localize damaged regions
- Add Grad-CAM for visual model explanations
- Add image quality validation
- Deploy the Flask application online
- Add database support for prediction history
- Add an API for integration with other applications

---

## 👩‍💻 Author

**Aashi Tomar**

Computer Science Engineering — Artificial Intelligence & Machine Learning

Interested in:

- Machine Learning
- Deep Learning
- Computer Vision
- AI Engineering

---

## ⭐ Project

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.
