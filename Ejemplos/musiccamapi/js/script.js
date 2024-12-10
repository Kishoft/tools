navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

const openCameraBtn = document.getElementById('openCamera');
const video = document.getElementById('video');
const audio = document.getElementById('audio');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let imgindex = 1;
let isVideo = false;
let model = null;

const modelParams = {
    flipHorizontal: true, // flip e.g for video
    maxNumBoxes: 20, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
};

function startVideo() {
    handTrack.startVideo(video).then(status => {
        console.log("video started", status);
        if (status) {
            isVideo = true;
            runDetection();
        } else {
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        startVideo();
    } else {
        handTrack.stopVideo(video);
        isVideo = false;
    }
}

function runDetection() {
    model.detect(video).then((predictions) => {
        predictions.forEach(prediction => {
            switch (prediction.class) {
                case 1:
                    audio.play()
                    break;
                case 2:
                    audio.pause()
                    break;
            }
            console.log(prediction.class)
        })
        model.renderPredictions(predictions, canvas, context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
}

function runDetectionImage(img) {
    model.detect(img).then((predictions) => {
        predictions.forEach(prediction => {
            switch (prediction.class) {
                case 1:
                    audio.play()
                case 2:
                    audio.pause()
            }
            console.log(prediction)
        })
        model.renderPredictions(predictions, canvas, context, img);
    });
}

// Load the model.
handTrack.load(modelParams).then((lmodel) => {
    // detect objects in the image.
    model = lmodel;
    console.log(model);
    runDetectionImage(handimg);
    trackButton.disabled = false;
    nextImageButton.disabled = false;
});


openCameraBtn.addEventListener("click", () => toggleVideo());
  //audio.play()