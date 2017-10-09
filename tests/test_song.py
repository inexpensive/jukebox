from unittest import TestCase
from scripts.jukebox import Jukebox
from scripts.song import Song

class TestSong(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.jukebox = Jukebox('../credentials.yaml')
        cls.song_dict = cls.jukebox.search('1234')['song_hits'][0]['track']

    def test_every_field_unknown_on_bad_construction(self):
        song = Song()
        self.assertEqual('Unknown Artist', song.artist)
        self.assertEqual('Unknown Title', song.title)
        self.assertEqual('Unknown Album', song.album)
        self.assertEqual('Unknown ID', song.storeId)
        self.assertEqual('Unknown ID', song.artistId)
        self.assertEqual('Unknown ID', song.albumId)
        self.assertEqual('Unknown Duration', song.duration)
        self.assertEqual('Unknown Album Art', song.albumArt)

    def test_every_field_not_unknown_on_vaild_contruction(self):
        song = Song(**self.song_dict)
        self.assertNotEqual('Unknown Artist', song.artist)
        self.assertNotEqual('Unknown Title', song.title)
        self.assertNotEqual('Unknown Album', song.artist)
        self.assertNotEqual('Unknown ID', song.storeId)
        self.assertNotEqual('Unknown ID', song.artistId)
        self.assertNotEqual('Unknown ID', song.albumId)
        self.assertNotEqual('Unknown Duration', song.duration)
        self.assertNotEqual('Unknown Album Art', song.albumArt)
