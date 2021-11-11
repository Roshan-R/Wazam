let recording = false;
let hasMic;

let button = document.getElementById("record-button")
let circle1 = document.getElementById("circle-1")
let circle2 = document.getElementById("circle-2")
let text = document.getElementById("text");

let infoCard = document.getElementById("info-card")
let infoTitle = document.getElementById("info-title")
let infoArtist = document.getElementById("info-artist")
let infoImage = document.getElementById("info-image")

let placeholderImage = document.getElementById("placeholder-image")

button.addEventListener("click", JSmagic);

function removeAnimation() {

    console.log("removing animation")
    // remove animation
    button.classList.remove('animate-spin');

    circle1.classList.add('hidden');
    circle1.classList.remove('visible');
    circle1.classList.remove('animate-ping');

    circle2.classList.add('hidden');
    circle2.classList.remove('visible');
    circle2.classList.remove('animate-ping');

}

function addAnimation() {

    // add animation
    console.log("adding animation")


    button.classList.add('animate-spin');

    circle1.classList.remove('hidden');
    circle1.classList.add('visible');
    circle1.classList.add('animate-ping');


    circle2.classList.remove('hidden');
    circle2.classList.add('visible');
    circle2.classList.add('animate-ping');

}


function JSmagic() {

    console.log("Called JSMAGIC");

    if (typeof hasMic == "undefined") {
        hasMic = hasMicPermission();
    }

    if (recording) {
        removeAnimation();
        recording = false;
    }
    else {
        addAnimation();
        recording = true;
        getTrack(button);
    }


}

async function hasMicPermission() {
    console.log("not supported"); // non chromuim bois
    try {

        let s = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (s) {
            return true;
        }
        else {
            return false;
        }

    }
    catch (err) {
        return null;
    }
}


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

                fetch(url, {
                    method: 'POST',
                    body: fd,
                    mode: 'cors',
                    processData: false,
                    contentType: false,
                }).then(data => {
                    data.json().then(
                        json => {
                            console.log(data);
                            gotSong(json);
                        }
                    )

                }

                )

            });

            setTimeout(() => {
                mediaRecorder.stop();
            }, 3000);
        });
}

function changeText(s) {
    text.innerHTML = "<h1>" + s + "</h1>";
}

//var https = false;
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
        text.classList.add('hidden');
        console.log("Track title : " + response.track.title)
        console.log("Track artist : " + response.track.subtitle)
        console.log("Track coverart : " + response.track.images.coverart)

        placeholderImage.classList.add("hidden");

        infoTitle.innerHTML = response.track.title;
        infoArtist.innerHTML = response.track.subtitle;

        infoImage.src = response.track.images.coverart;
        infoImage.classList.remove("hidden");

        infoCard.classList.remove("top-full");
        infoCard.classList.add("top-1/3");

    } else {
        changeText("No match found");
        button.classList.remove('animate-spin');
    }
    removeAnimation();

}