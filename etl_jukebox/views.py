import json

from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import render
from django.views import generic
from django.views.decorators.csrf import csrf_exempt

from scripts.jukebox_manager import JukeboxManager


class JukeboxManagerHandler:
    _jukebox_manager = None

    @classmethod
    def get_jukebox_manager(cls):
        if cls._jukebox_manager is None:
            cls._jukebox_manager = JukeboxManager('credentials.yaml')
        return cls._jukebox_manager


class HomeView(generic.ListView):
    template_name = 'jukebox/home.html'
    context_object_name = 'home'


def home(request):
    return render(request, 'jukebox/home.html')


def search(request):
    if request.is_ajax():
        q = request.GET.get('search_box', None)
        jm = JukeboxManagerHandler.get_jukebox_manager()
        search_results = jm.search(q)
        data = json.dumps(search_results['song_hits'])
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)
    return HttpResponseNotFound('Page not found.')


@csrf_exempt
def add(request):
    if request.is_ajax():
        q = request.body
        q = json.loads(q)
        jm = JukeboxManagerHandler.get_jukebox_manager()
        jm.add_song(**q)
        return HttpResponse('OK')
    return HttpResponseNotFound('Page not found.')


def play(request):
    if request.is_ajax():
        jm = JukeboxManagerHandler.get_jukebox_manager()
        jm.start_jukebox()
        return HttpResponse('OK')
    return HttpResponseNotFound('Page not found.')


def current_details(request):
    if request.is_ajax():
        jm = JukeboxManagerHandler.get_jukebox_manager()
        details = jm.get_current_song_details()
        data = json.dumps(details)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)
    return HttpResponseNotFound('Page not found.')


def playlist_details(request):
    if request.is_ajax():
        jm = JukeboxManagerHandler.get_jukebox_manager()
        details = jm.get_playlist_details()
        data = json.dumps(details)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)
    return HttpResponseNotFound('Page not found.')


def pause(request):
    if request.is_ajax():
        jm = JukeboxManagerHandler.get_jukebox_manager()
        jm.pause_jukebox()
        return HttpResponse('OK')
    return HttpResponseNotFound('Page not found.')


def skip(request):
    if request.is_ajax():
        jm = JukeboxManagerHandler.get_jukebox_manager()
        jm.play_next_song()
        return HttpResponse('OK')
    return HttpResponseNotFound('Page not found.')
