# BillyBatson :musical_note:
an (un)Official Shazam web client built using Django

[Check it out here!](https://wazam.ml)

[Alternate instance](https://wazam.herokuapp.com/)

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

![1](https://user-images.githubusercontent.com/43182697/151839673-03f3e51c-64b7-47eb-88ee-e563b1133810.png)
![2](https://user-images.githubusercontent.com/43182697/151839681-3dc2fcce-673e-45b1-80fd-ac442606cf3d.png)

## Todo
- [x] Check whether mic permissions are given
- [ ] Display Youtube and Spotify links to the track
- [ ] Add support for lyrics and show related tracks
- [ ] Inform user if mic is not giving any input
- [ ] Add an audio visualizer

## Contributions

Contributions are always welcome!
