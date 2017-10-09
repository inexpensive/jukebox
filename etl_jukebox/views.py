import json

from django.http import HttpResponse
from django.shortcuts import render
from django.views import generic

from scripts.jukebox import Jukebox


class JukeboxHandler:
    _jukebox = None

    @classmethod
    def get_jukebox(cls):
        if cls._jukebox is None:
            cls._jukebox = Jukebox('credentials.yaml')
        return cls._jukebox


class HomeView(generic.ListView):
    template_name = 'jukebox/home.html'
    context_object_name = 'home'


def home(request):
    return render(request, 'jukebox/home.html')


def search(request):
    if request.method == 'GET':
        q = request.GET.get('search_box', None)
        jukebox = JukeboxHandler.get_jukebox()
        search_results = jukebox.search(q)
        return render(request, 'jukebox/search.html', search_results)


def play(request):
    if request.method == 'GET':
        song = request.GET.get('song', None)
        jukebox = JukeboxHandler.get_jukebox()
        jukebox.set_track(song)
        jukebox.play()
