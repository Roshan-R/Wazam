/*
 */

function getTrack(button) {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            console.log("Started Recorder....")

            const audioChunks = [];
            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", () => {
                console.log("stopping recording..")
                const audioBlob = new Blob(audioChunks);
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                const url = "api";

                console.log("sending api request to django")
                var fd = new FormData();
                fd.append("audio_data", audioBlob, "rhiss");
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: fd,
                    processData: false,
                    contentType: false,
                    success: gotSong,
                    //etc
                });
            });

            setTimeout(() => {
                mediaRecorder.stop();
            }, 4000);
        });
}

var recording = false;
var button = document.getElementsByClassName("recordButton")[0]
    //var result = document.getElementsByClassName("container")[0]


function gotSong(response) {
    button.classList.remove('recording');
    recording = false;
    response = JSON.parse(response);
    console.log(response);

    if (response.matches.length) {
        console.log("match found");
        console.log("Track title : " + response.track.title)
        console.log("Track artist : " + response.track.subtitle)
        console.log("Track coverart : " + response.track.images.coverart)

        const trackData = getTrackData(response);
        document.body.insertAdjacentHTML("afterend", trackData);

    } else {
        console.log("No match found");
    }

}

function JSmagic() {

    if (recording) {
        button.classList.remove('recording');
        console.log("removing")
        recording = false;
    } else {
        button.classList.add('recording');
        console.log("adding")
        recording = true;
        getTrack(button);

    }
}

function getTrackData(response) {
    return `
    <div class="container">
    <div class="cards">
        <div class="card-item">
            <div class="card-image">
                <img class="img-responsive" src="${response.track.images.coverart}">"
            </div>
            <div class="card-info">
                <div class="card-title">
                    <h2>${response.track.title}</h2>
                </div>
                <div class="card-subtitle">
                    <h3>${response.track.subtitle}
                        <h3/>
                </div>
            </div>
        </div>
    </div>
</div>
    `
}