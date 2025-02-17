# Pose Estimation Web App

## Overview
A web application for real-time human pose estimation using TensorFlow.js and the MoveNet model.

## Performance Notes
- Works best with clear, full-body images
- Single pose detection per image
  
## Features
- Drag and drop image upload
- Pose estimation using MoveNet
- Visualize detected keypoints
- Display pose skeleton
- Responsive design

## Project Structure
```
- `index.html`: Main HTML file
- `styles.css`: Styling
- `src/js/poseEstimator.js`: Pose estimation logic
- `src/js/uiManager.js`: User interface management
- `src/js/app.js`: Main application logic
```

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6+)
- TensorFlow.js
- Pose Detection Library


## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Install additional TensorFlow.js dependencies:
```bash
npm install @tensorflow/tfjs @tensorflow-models/movenet
# or
yarn add @tensorflow/tfjs @tensorflow-models/movenet
```

4. Start the development server:
```bash
npm start
# or
yarn start
```
