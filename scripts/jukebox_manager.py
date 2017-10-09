import urllib.request
from queue import Queue
from threading import Thread
from time import sleep

import os

from scripts.jukebox import Jukebox
from scripts.song import Song


class JukeboxMonitor(Thread):
    def __init__(self, manager):
        super().__init__()
        self.manager = manager

    def run(self):
        while self.manager.is_started():
            sleep(1)
            while self.manager.is_jukebox_playing():
                sleep(0.1)
            self.manager.play_next_song()


class SongDownloader(Thread):
    def __init__(self, url, filename):
        super().__init__()
        self.url = url
        self.filename = filename

    def run(self):
        file = 'songs/' + self.filename + '.mp3'
        directory = os.path.dirname(file)
        if not os.path.exists(directory):
            os.makedirs(directory)
        urllib.request.urlretrieve(self.url, 'songs/' + self.filename + '.mp3')


class JukeboxManager:
    def __init__(self, credentials):
        self._jukebox = Jukebox(credentials)
        self._song_queue = Queue(100)
        self._current_song = None
        self._playing = False
        self._started = False

    def add_song(self, **song_details):
        song = Song(**song_details)
        self._song_queue.put(song)
        song_url = self._jukebox.get_track_url(song.storeId)
        dl = SongDownloader(song_url, song.storeId)
        dl.start()

    def start_jukebox(self):
        if not self._started:
            if self._song_queue.qsize() > 0:
                self._current_song = self._song_queue.get()
                self._jukebox.set_track(self._current_song.storeId)
                self._jukebox.play()
                self._playing = True
                self._started = True
                monitor = JukeboxMonitor(self)
                monitor.start()
        else:
            self.play_next_song()

    def play_next_song(self):
        if self._started and self._song_queue.qsize() > 0:
            self._jukebox.stop()
            self._current_song = self._song_queue.get()
            self._jukebox.set_track(self._current_song.storeId)
            self._jukebox.play()
            self._playing = True
        else:
            self._playing = False
            self._started = False

    def pause_jukebox(self):
        self._jukebox.pause()
        self._playing = not self._playing

    def search(self, query):
        return self._jukebox.search(query)

    def is_jukebox_playing(self):
        return self._jukebox.is_playing()

    def is_started(self):
        return self._started
