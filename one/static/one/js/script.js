/*
*/

function getTrack(button) {
    console.log("Checking for recorder..")

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            console.log(stream);
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

async function isPermission(){
    console.log("not supported"); // non chromuim bois
    try{

        let s = await navigator.mediaDevices.getUserMedia({ audio: true });
        if(s)
            mic = true;
        else
            false;
        console.log(s);
        return s;
    }
    catch(err){
        return null;
    }
    /*navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            console.log(stream);
            console.log("nalla kuti");
            mic = true;
        })
        .catch(function(err){
            console.log("dafuk dude");
            mic = false;
        });*/
}




var recording;
var mic = false;
var button = document.getElementsByClassName("recordButton")[0]
var text = document.getElementsByClassName("text")[0];

//var https = false;
//
function changeText(s){
    text.innerHTML = "<h1>" + s + "</h1>";
}

/*if (location.protocol !== 'https:') {
    text.innerHTML = "<h1>Reload the site via https!</h1>";
    throw new Error("http used ");
}*/


function gotSong(response) {
    button.classList.remove('recording');
    recording = false;
    response = JSON.parse(response);
    console.log(response);

    if (response.matches.length) {
        console.log("match found");
        text.innerHTML = "<h1>Tap to Wazam!</h1>";
        console.log("Track title : " + response.track.title)
        console.log("Track artist : " + response.track.subtitle)
        console.log("Track coverart : " + response.track.images.coverart)

        const trackData = getTrackData(response);
        document.querySelector(".wrapper").insertAdjacentHTML("beforeend", trackData);
        document.querySelector(".card-item").classList.add("cardreveal");
        document.querySelector(".recordButton").classList.add("rollaway");
        document.querySelector(".card-info").scrollIntoView();

        var trackDiv = document.getElementsByClassName("container")[0];
        trackDiv.lastElementChild.scrollIntoView({ behavior: 'smooth' });

    } else {
        text.innerHTML = "<h1>No match found</h1>";
        console.log("No match found");
    }

}

function JSmagic() {

    if (recording) {
        text.innerHTML = "<h1>Tap to Wazam!</h1>";
        button.classList.remove('recording');
        console.log("removing")
        recording = false;
    } else {
        if (document.getElementsByClassName("container")[0]) {
            document.getElementsByClassName("container")[0].remove();
        }
        document.querySelector(".recordButton").classList.remove("rollaway");
        text.innerHTML = "<h2>Looking for Matches...</h2>";
        isPermission().then(result =>{
            console.log("mic : ", mic);
            if (mic){
                button.classList.add('recording');
                console.log("adding")
                getTrack(button);
            }
        }).catch(err =>{
            console.log(mic);
        })
        recording = true;
    }
}
document.querySelector(".recordButton").addEventListener("click", JSmagic);

function getTrackData(response) {
    ``
    return `
    <div class="container">
    <div class="cards">
        <div class="card-item">
            <div class="card-image">
                <img class="img-responsive" src="${response.track.images.coverart}">
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
