# BillyBatson :musical_note:
an (un)Official Shazam web client built using Django

[Check it out here!](https://wazam.herokuapp.com/)

[Alternate instance](https://wazam.ml)

Huge thanks to https://github.com/marin-m/SongRec for providing 
python code required to communicate with Shazam servers

Wazam recognizes songs playing nearby you using your microphone and displays info about them.

## Running Locally

### Installing Dependencies

```bash
git clone https://github.com/Roshan-R/BillyBatson
cd BillyBatson
python3 -m pip install -r requirements.txt --user
```
additionally, `ffmpeg` and `ffprobe` should be installed in your system for processing audio

### Running

`python3 manage.py runserver`

## Screenshots

![](https://raw.githubusercontent.com/Roshan-R/BillyBatson/main/imgs/main.png)
![](https://raw.githubusercontent.com/Roshan-R/BillyBatson/main/imgs/result.png)

## Todo
- [x] Check whether mic permissions are given
- [ ] Display Youtube and Spotify links to the track
- [ ] Redo UI to support lyrics and show related tracks
- [ ] Inform user if mic is not giving any input
- [ ] Add an audio visualizer

## Contributions

Contributions are always welcome!

Thanks to @GameGodS3 for rewriting my shitty frontend
