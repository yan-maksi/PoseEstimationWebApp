class UIManager {
    constructor() {
        // DOM Elements
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('fileInput');
        this.uploadButton = document.getElementById('uploadButton');
        this.originalCanvas = document.getElementById('originalCanvas');
        this.processedCanvas = document.getElementById('processedCanvas');
        this.widthStat = document.getElementById('widthStat');
        this.heightStat = document.getElementById('heightStat');
        this.sizeStat = document.getElementById('sizeStat');
        this.confidenceScore = document.getElementById('confidenceScore');
        this.detectedKeypoints = document.getElementById('detectedKeypoints');
        this.keypointsList = document.getElementById('keypointsList');
        this.errorMessage = document.getElementById('errorMessage');
    }

    initEventListeners(handleFileCallback) {
        this.uploadButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.fileInput.click();
        });

        this.dropZone.addEventListener('click', (e) => {
            if (e.target === this.dropZone) {
                this.fileInput.click();
            }
        });

        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.style.backgroundColor = '#f0f0f0';
        });

        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.style.backgroundColor = 'white';
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.style.backgroundColor = 'white';
            handleFileCallback(e.dataTransfer.files[0]);
        });

        this.fileInput.addEventListener('change', (e) => {
            handleFileCallback(e.target.files[0]);
        });
    }

    resetUI() {
        // Reset canvases
        const origCtx = this.originalCanvas.getContext('2d');
        const procCtx = this.processedCanvas.getContext('2d');
        
        // Reset canvas sizes and clear
        this.originalCanvas.width = 0;
        this.originalCanvas.height = 0;
        this.processedCanvas.width = 0;
        this.processedCanvas.height = 0;
        
        origCtx.clearRect(0, 0, this.originalCanvas.width, this.originalCanvas.height);
        procCtx.clearRect(0, 0, this.processedCanvas.width, this.processedCanvas.height);

        // Reset stats
        this.widthStat.textContent = 'Width: -';
        this.heightStat.textContent = 'Height: -';
        this.sizeStat.textContent = 'File Size: -';

        // Reset AI output
        this.confidenceScore.textContent = 'Confidence Score: -';
        this.detectedKeypoints.textContent = 'Detected Keypoints: -';
        this.keypointsList.innerHTML = '';
        this.hideErrorMessage();
    }

    updateImageStats(file, img) {
        this.widthStat.textContent = `Width: ${img.width}px`;
        this.heightStat.textContent = `Height: ${img.height}px`;
        this.sizeStat.textContent = `File Size: ${(file.size / 1024).toFixed(2)} KB`;

        // Draw original image
        this.originalCanvas.width = img.width;
        this.originalCanvas.height = img.height;
        const origCtx = this.originalCanvas.getContext('2d');
        origCtx.drawImage(img, 0, 0);
    }
    
    updatePoseResults(pose) {
        if (pose && pose.keypoints) {
            // Update AI output details
            this.confidenceScore.textContent = `Confidence Score: ${pose.score.toFixed(2)}`;
            this.detectedKeypoints.textContent = `Detected Keypoints: ${pose.keypoints.length}`;

            // Display keypoints details in a table
            this.keypointsList.innerHTML = '';
            pose.keypoints.forEach((point, index) => {
                const row = document.createElement('tr');
                
                // Add low confidence class if confidence is below 0.55
                if (point.score < 0.55) {
                    row.classList.add('low-confidence');
                }

                row.innerHTML = `
                    <td>${index}</td>
                    <td>${point.name}</td>
                    <td>${point.x.toFixed(2)}</td>
                    <td>${point.y.toFixed(2)}</td>
                    <td>${point.score.toFixed(2)}</td>
                `;
                
                this.keypointsList.appendChild(row);
            });

            // Prepare processed canvas
            this.processedCanvas.width = this.originalCanvas.width;
            this.processedCanvas.height = this.originalCanvas.height;

            return true;
        }
        return false;
    }

    showErrorMessage(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
    }

    hideErrorMessage() {
        this.errorMessage.textContent = '';
        this.errorMessage.style.display = 'none';
    }

    drawProcessedCanvas(img, keypoints, poseEstimator) {
        const ctx = this.processedCanvas.getContext('2d');
        poseEstimator.drawPoseOnCanvas(ctx, img, keypoints);
    }
}