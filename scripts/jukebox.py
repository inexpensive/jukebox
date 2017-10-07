from gmusicapi import Mobileclient
import vlc
import yaml


class NotAuthenticatedError(BaseException):
    pass


class Jukebox:
    def __init__(self, credentials_file):
        with open(credentials_file) as f:
            credentials = yaml.load(f)
        email = credentials['email']
        password = credentials['password']
        android_id = credentials['android_id']
        self.api = Mobileclient()
        self.__authenticated = self.api.login(email, password, android_id)
        self.player = vlc.MediaPlayer()

    def search(self, query):
        self.__is_authenticated()
        return self.api.search(query)

    def set_track(self, track_id):
        self.__is_authenticated()
        track_url = self.api.get_stream_url(track_id)
        self.player.set_media(vlc.get_default_instance().media_new(track_url))

    def play(self):
        self.__is_authenticated()
        self.player.play()

    def get_length(self):
        self.__is_authenticated()
        return self.player.get_length()

    def get_current_time(self):
        self.__is_authenticated()
        return self.player.get_time()

    def is_playing(self):
        self.__is_authenticated()
        return self.player.is_playing()

    def __is_authenticated(self):
        if not self.__authenticated:
            raise NotAuthenticatedError

