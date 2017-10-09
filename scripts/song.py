class Song:
    def __init__(self, **kwargs):
        self.artist = kwargs.get('artist', 'Unknown Artist')
        self.title = kwargs.get('title', 'Unknown Title')
        self.album = kwargs.get('album', 'Unknown Album')
        self.storeId = kwargs.get('storeId', 'Unknown ID')
        self.albumId = kwargs.get('albumId', 'Unknown ID')
        self.artistId = kwargs.get('artistId', 'Unknown ID')
        self.duration = kwargs.get('durationMillis', 'Unknown Duration')
        self.albumArt = kwargs.get('albumArtRef', 'Unknown Album Art')

    def get_details(self):
        details = {
            'artist': self.artist,
            'title': self.title,
            'album': self.album,
            'duration': self.duration,
            'albumArt': self.albumArt[0]['url'],
        }
        return details
