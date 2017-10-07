import time
from unittest import TestCase

from scripts.jukebox import Jukebox
from scripts.jukebox import NotAuthenticatedError
from gmusicapi.exceptions import CallFailure


class TestJukebox(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.jukebox = Jukebox('../credentials.yaml')
        id_ = cls.jukebox.search('1234')['song_hits'][0]['track']['storeId']
        cls.good_track_id = id_

    def test_bad_credentials_will_not_work(self):
        bad_jukebox = Jukebox('bad_credentials.yaml')
        self.assertRaises(NotAuthenticatedError, bad_jukebox.search, '1234')

    def test_good_credentials_work(self):
        try:
            self.jukebox.search('1234')
        except NotAuthenticatedError:
            self.fail('NotAuthenticatedError raised on good credentials')

    def test_setting_improper_media_does_not_work(self):
        self.assertRaises(CallFailure, self.jukebox.set_track, 'not_track_id')

    def test_setting_proper_media_does_work(self):
        try:
            self.jukebox.set_track(self.good_track_id)
        except CallFailure:
            self.fail('A good track ID caused a CallFailure')

    def test_get_current_time_returns_correctly_if_track_is_started(self):
        self.jukebox.set_track(self.good_track_id)
        self.jukebox.play()
        time.sleep(1)
        self.assertNotEquals(-1, self.jukebox.get_current_time())
