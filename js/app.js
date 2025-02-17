class PoseEstimationApp {
    constructor() {
        this.uiManager = new UIManager();
        this.poseEstimator = new PoseEstimator();
        this.handleFile = this.handleFile.bind(this);
        this.uiManager.initEventListeners(this.handleFile);
        this.initializeModel();
    }

    async initializeModel() {
        try {
            await this.poseEstimator.loadModel();
        } catch (error) {
            this.uiManager.showErrorMessage(`Model Load Error: ${error.message}`);
        }
    }

    async handleFile(file) {
        this.uiManager.resetUI();

        if (!file || !file.type.startsWith('image/')) {
            this.uiManager.showErrorMessage('Please upload a valid image file.');
            return;
        }

        try {
            const img = await this.createImage(file);
            this.uiManager.updateImageStats(file, img);
            await this.performPoseEstimation(img);
        } catch (error) {
            this.uiManager.showErrorMessage(`Image Processing Error: ${error.message}`);
        }
    }

    createImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async performPoseEstimation(img) {
        try {
            const pose = await this.poseEstimator.estimatePose(img);

            if (pose && pose.keypoints) {
                const poseDetected = this.uiManager.updatePoseResults(pose);

                if (poseDetected) {
                    this.uiManager.drawProcessedCanvas(img, pose.keypoints, this.poseEstimator);
                } else {
                    this.uiManager.showErrorMessage('No pose detected. Try a different image.');
                }
            }
        } catch (error) {
            this.uiManager.showErrorMessage(`Pose Estimation Error: ${error.message}`);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PoseEstimationApp();
});