class PoseEstimator {
    constructor() {
        this.model = null;
        this.connections = [
            [0, 1], [0, 2],   // Nose to eyes
            [1, 3], [2, 4],   // Eyes to ears
            [5, 7], [6, 8],   // Shoulders to elbows
            [7, 9], [8, 10],  // Elbows to wrists
            [5, 11], [6, 12], // Shoulders to hips
            [11, 13], [12, 14], // Hips to knees
            [13, 15], [14, 16]  // Knees to ankles
        ];
    }

    async loadModel() {
        try {
            const detectorConfig = {
                modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
            };
            this.model = await poseDetection.createDetector(
                poseDetection.SupportedModels.MoveNet, 
                detectorConfig
            );
            console.log('MoveNet model loaded successfully');
        } catch (error) {
            console.error('Error loading MoveNet model:', error);
            throw error;
        }
    }

    async estimatePose(image, options = {}) {
        if (!this.model) {
            await this.loadModel();
        }

        try {
            const tfImage = tf.browser.fromPixels(image);

            const poses = await this.model.estimatePoses(tfImage, {
                maxPoses: 1,
                scoreThreshold: 0.5,
                ...options
            });
            tfImage.dispose();

            return poses[0] || null;
        } catch (error) {
            console.error('Pose estimation error:', error);
            throw error;
        }
    }

    drawPoseOnCanvas(ctx, img, keypoints) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(img, 0, 0);

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        this.connections.forEach(([i, j]) => {
            const p1 = keypoints[i];
            const p2 = keypoints[j];
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        });

        ctx.fillStyle = 'blue';
        keypoints.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
}