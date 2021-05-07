const faceDetector = new FaceDetector({
    // (Optional) Hint to try and limit the amount of detected faces
    // on the scene to this maximum number.
    maxDetectedFaces: 5,
    // (Optional) Hint to try and prioritize speed over accuracy
    // by, e.g., operating on a reduced scale or looking for large features.
    fastMode: false
});
try {
    async function detectFaces(){
        let mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: {
                    exact: "user"
                }
            }
        })
    
        let track = mediaStream.getVideoTracks()[0];
        let imageCapture = new ImageCapture(track);
        let blob = await imageCapture.takePhoto();
        let imageBitmap = await createImageBitmap(blob);
    
        const faces = await faceDetector.detect(imageBitmap);
    }
    
    console.log(faces)
} catch (e) {
    console.error('Face detection failed:', e);
}