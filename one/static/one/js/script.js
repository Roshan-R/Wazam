let recording = false;
let hasMic;

let button = document.getElementById("record-button")
let retryButton = document.getElementById("retry-button")

let text = document.getElementById("text");

let infoCard = document.getElementById("info-card")
let infoTitle = document.getElementById("info-title")
let infoArtist = document.getElementById("info-artist")
let infoImage = document.getElementById("info-image")

let placeholderImage = document.getElementById("placeholder-image")

button.addEventListener("click", JSmagic);
retryButton.addEventListener("click", retry);

function removeAnimation() {

    console.log("removing animation")
    // remove animation
    button.classList.add('bg-red-1');
    button.classList.remove('animate-spin');
    button.classList.remove('bg-red-500');

}

function addAnimation() {

    // add animation
    console.log("adding animation")
    button.classList.remove('bg-red-1');
    button.classList.add('animate-spin');
    button.classList.add('bg-red-500');
    changeText("Press to search");
    changeText("...Searching...");
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

        retryButton.classList.remove("top-full");
        retryButton.classList.add("bottom-0");
        retryButton.classList.add("md:top-2/3");
        retryButton.classList.add("md:bottom-auto");

        button.classList.add("opacity-0")

    } else {
        changeText("No match found");
        button.classList.remove('animate-spin');
    }
    removeAnimation();

}

function retry(){

    infoImage.src = "";


    infoCard.classList.remove("top-1/3");
    infoCard.classList.add("top-full");

    retryButton.classList.add("top-full");
    retryButton.classList.remove("bottom-0");
    retryButton.classList.remove("md:top-2/3");
    retryButton.classList.remove("md:bottom-auto");


    button.classList.remove("opacity-0");
    text.classList.remove('hidden');

    addAnimation();
    JSmagic();

    console.log("Called retry");
}
