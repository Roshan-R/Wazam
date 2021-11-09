let recording;
let mic = false;
let button = document.getElementById("wazamButton")
// let text = document.getElementById("text");

button.addEventListener("click", JSmagic);

function JSmagic() {

    if (recording) {
        // text.innerHTML = "<h1>Tap to Wazam!</h1>";
        button.classList.remove('animate-spin');
        recording = false;
    } else {

        //text.innerHTML = "<h2>Looking for Matches...</h2>";

        isPermission().then(result => {
            console.log("mic : ", mic);
            if (mic) {
                button.classList.add('animate-spin');
                button.classList.remove('shadow-md');
                console.log("adding")
                getTrack(button);
            }
        }).catch(err => {
            console.log(mic);
        })
        recording = true;
    }
}

async function isPermission() {
    console.log("not supported"); // non chromuim bois
    try {

        let s = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (s)
            mic = true;
        else
            false;
        console.log(s);
        return s;
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
                const url = "http://localhost:8000/api";

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

// function changeText(s) {
//     text.innerHTML = "<h1>" + s + "</h1>";
// }

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
        // text.innerHTML = "<h1>Tap to Wazam!</h1>";
        console.log("Track title : " + response.track.title)
        console.log("Track artist : " + response.track.subtitle)
        console.log("Track coverart : " + response.track.images.coverart)

        const trackData = getTrackData(response);
        console.log(trackData)
        document.getElementById("begindiv").insertAdjacentHTML("beforeend", trackData);
        //document.querySelector(".wrapper").insertAdjacentHTML("beforeend", trackData);
        //document.querySelector(".card-item").classList.add("cardreveal");
        //document.querySelector(".recordButton").classList.add("rollaway");
        //document.querySelector(".card-info").scrollIntoView();

        var trackDiv = document.getElementById("trackdiv");
        trackDiv.lastElementChild.scrollIntoView({ behavior: 'smooth' });
        button.classList.remove('animate-spin');

    } else {
        // text.innerHTML = "<h1>No match found</h1>";
        console.log("No match found");
    }

}

// function getTrackData(response) {
//     ``
//     return `
//     <div class="container">
//     <div class="cards">
//         <div class="card-item">
//             <div class="card-image">
//                 <img class="img-responsive" src="${response.track.images.coverart}">
//             </div>
//             <div class="card-info">
//                 <div class="card-title">
//                     <h2>${response.track.title}</h2>
//                 </div>
//                 <div class="card-subtitle">
//                     <h3>${response.track.subtitle}
//                         <h3/>
//                 </div>
//             </div>
//         </div>
//     </div>
// </div>
//     `
// }

function getTrackData(response){
    ``
    return `
    <div id="trackdiv" class="space-y-10 m-auto bg-white rounded-2xl">
        <div class="flex flex-col md:flex-row">
            <img class="rounded-2xl my-5 mx-5"
                src="${response.track.images.coverart}"
                width="200" />
            <div class="flex flex-col md:mr-10 ml-5 mb-5 justify-center">
                <div class="flex flex-col pt-2 md:pt-11">
                    <span class="font-bold text-3xl md:text-4xl">${response.track.title}</span>
                    <span class="font-light text-base md:text-base">${response.track.subtitle}</span>
                </div>
                <div class="flex flex-row space-x-3 pt-2 md:pt-8">
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd"
                        clip-rule="evenodd">
                        <path
                            d="M19.098 10.638c-3.868-2.297-10.248-2.508-13.941-1.387-.593.18-1.22-.155-1.399-.748-.18-.593.154-1.22.748-1.4 4.239-1.287 11.285-1.038 15.738 1.605.533.317.708 1.005.392 1.538-.316.533-1.005.709-1.538.392zm-.126 3.403c-.272.44-.847.578-1.287.308-3.225-1.982-8.142-2.557-11.958-1.399-.494.15-1.017-.129-1.167-.623-.149-.495.13-1.016.624-1.167 4.358-1.322 9.776-.682 13.48 1.595.44.27.578.847.308 1.286zm-1.469 3.267c-.215.354-.676.465-1.028.249-2.818-1.722-6.365-2.111-10.542-1.157-.402.092-.803-.16-.895-.562-.092-.403.159-.804.562-.896 4.571-1.045 8.492-.595 11.655 1.338.353.215.464.676.248 1.028zm-5.503-17.308c-6.627 0-12 5.373-12 12 0 6.628 5.373 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path
                            d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                </div>
                <div class="flex font-light">Lyrics</div>
            </div>
        </div>
    </div>
    `
}
