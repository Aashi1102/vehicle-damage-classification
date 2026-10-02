const form = document.getElementById('predictionForm');
const input = document.getElementById('imageInput');
const dropZone = document.getElementById('dropZone');
const chooseButton = document.getElementById('chooseButton');
const changeButton = document.getElementById('changeButton');
const analyzeButton = document.getElementById('analyzeButton');
const buttonText = document.querySelector('.button-text');
const spinner = document.querySelector('.spinner');
const uploadState = document.getElementById('uploadState');
const previewState = document.getElementById('previewState');
const preview = document.getElementById('imagePreview');
const errorMessage = document.getElementById('errorMessage');
const resultCard = document.getElementById('resultCard');
const resultImage = document.getElementById('resultImage');
const resultPrediction = document.getElementById('resultPrediction');
const confidenceValue = document.getElementById('confidenceValue');
const confidenceBar = document.getElementById('confidenceBar');
const areaValue = document.getElementById('areaValue');
const damageValue = document.getElementById('damageValue');
const resultStatus = document.getElementById('resultStatus');
const probabilityList = document.getElementById('probabilityList');
const newAnalysisButton = document.getElementById('newAnalysisButton');

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}

function clearError() {
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');
}

function setFile(file) {
  clearError();
  if (!file) return;

  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    showError('Please choose a JPG, JPEG, or PNG image.');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    showError('Image is too large. Maximum size is 10 MB.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    preview.src = event.target.result;
    uploadState.classList.add('hidden');
    previewState.classList.remove('hidden');
    analyzeButton.disabled = false;
    resultCard.classList.add('hidden');
  };
  reader.readAsDataURL(file);

  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  input.files = dataTransfer.files;
}

chooseButton.addEventListener('click', (event) => {
  event.stopPropagation();
  input.click();
});

changeButton.addEventListener('click', (event) => {
  event.stopPropagation();
  input.click();
});

dropZone.addEventListener('click', (event) => {
  if (!event.target.closest('button')) input.click();
});

dropZone.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    input.click();
  }
});

input.addEventListener('change', () => setFile(input.files[0]));

['dragenter', 'dragover'].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add('dragging');
  });
});

['dragleave', 'drop'].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove('dragging');
  });
});

dropZone.addEventListener('drop', (event) => {
  setFile(event.dataTransfer.files[0]);
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearError();

  if (!input.files[0]) {
    showError('Please select an image first.');
    return;
  }

  analyzeButton.disabled = true;
  buttonText.textContent = 'Analyzing...';
  spinner.classList.remove('hidden');

  try {
    const response = await fetch('/predict', {
      method: 'POST',
      body: new FormData(form)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Prediction failed.');
    }

    renderResult(data);
  } catch (error) {
    showError(error.message);
  } finally {
    analyzeButton.disabled = false;
    buttonText.textContent = 'Analyze Damage';
    spinner.classList.add('hidden');
  }
});

function renderResult(data) {
  resultImage.src = `${data.image_url}?v=${Date.now()}`;
  resultPrediction.textContent = data.prediction;
  confidenceValue.textContent = `${data.confidence}%`;
  confidenceBar.style.width = `${data.confidence}%`;
  areaValue.textContent = data.vehicle_area;
  damageValue.textContent = data.damage_type;

  const normal = data.status === 'Normal';
  resultStatus.classList.toggle('normal', normal);
  resultStatus.innerHTML = normal
    ? '<span class="status-dot"></span> NORMAL CONDITION'
    : '<span class="status-dot"></span> DAMAGE DETECTED';

  probabilityList.innerHTML = Object.entries(data.class_probabilities)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => `
      <div class="prob-row">
        <span>${name}</span>
        <div class="prob-track"><span style="width:${value}%"></span></div>
        <strong>${value}%</strong>
      </div>
    `)
    .join('');

  resultCard.classList.remove('hidden');
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

newAnalysisButton.addEventListener('click', () => {
  resultCard.classList.add('hidden');
  input.value = '';
  preview.src = '';
  uploadState.classList.remove('hidden');
  previewState.classList.add('hidden');
  analyzeButton.disabled = true;
  clearError();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
