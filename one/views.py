from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import base64
from .getSong import getSongName


@csrf_exempt
def index(request):
    if request.method == 'GET':
        return render(request, "index.html")


@csrf_exempt
def getTrack(request):
    if request.method == 'POST':
        print()
    print("Got the form via a POST request")
    if request.FILES:
        print("files exists...")
        audio = request.FILES["audio_data"]
        print(type(request.FILES["audio_data"]))
        with audio.open("rb") as cf:
            with open('/tmp/myfile.wav', mode='wb') as f:
                f.write(cf.read())

        trackJson = getSongName('/tmp/myfile.wav')
        print(trackJson)
        return JsonResponse(trackJson, safe=False)
