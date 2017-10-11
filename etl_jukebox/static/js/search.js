var songs = [];
var hide_playlist = true;

$(document).ready(function () {
    setup_search();

    setup_play_button();

    setup_pause_button();

    setup_skip_button();

    setup_playlist();

    setup_currently_playing();

    function setup_search() {
        var search_form = $("#search_form");
        search_form.on('submit', function (e) {
            e.preventDefault();
            songs = [];
            $('#search_results').find('tbody').empty();
            $.ajax({
                type: 'GET',
                url: '/search/',
                data: $('#search_form').find(':input'),
                success: function (data) {
                    var $searchResults = $('#search_results');
                    $searchResults.find('tbody').append('<tr><th></th><th>Song</th><th>Artist</th><th>Album</th>' +
                        '<th>Duration</th><th><th></th><th></th></tr>');
                    for (var i = 0; i < data.length; i++) {
                        var song = data[i].track;
                        songs[i] = JSON.stringify(song);
                        $searchResults.find('tbody').append(
                            '<tr><td><img src="' + song.albumArtRef[0].url + '" class="album-art"></td><td>'
                            + song.title + '</td><td>' + song.artist + '</td><td>' + song.album + '</td><td>'
                            + millisToMinutesAndSeconds(song.durationMillis)
                            + '</td><td><button onclick="add_song(' + i + ')">Add to Playlist</button></td>' +
                            '<td><button onclick="add_station(' + i + ')">Add Station to Playlist</button></td>' +
                            '<td><button onclick="add_next(' + i + ')">Play Next</button></td></tr>')
                    }
                }
            })
        });
    }

    function setup_play_button() {
        $('#play_button').click(function () {
            $.get('/play/');
        });
    }

    function setup_pause_button() {
        $('#pause_button').click(function () {
            $.get('/pause/');
        })
    }

    function setup_skip_button() {
        $('#skip_button').click(function () {
            $.get('/skip/');
        })
    }

    function setup_playlist() {
        $('#playlist_button').click(function () {
            hide_playlist = !hide_playlist;
            $('#playlist-field').toggle();
            if (!hide_playlist) {
                $.ajax({
                    url: '/playlist/',
                    success: function (playlist) {
                        $('#playlist').find('tr').remove();
                        for (var i = 0; i < playlist.length; i++) {
                            var song = playlist[i];
                            $('#playlist').find('tbody').append(
                                '<tr><td><img src="' + song.albumArt + '" class="album-art"></td><td>' +
                                song.artist + '</td><td>' + song.title + '</td><td>' + song.album + '</td><td>' +
                                millisToMinutesAndSeconds(song.duration) + '</td></tr>'
                            )
                        }
                    }
                });
            }
        })
    }

    function setup_currently_playing() {
        $.ajax({
            url: '/current/',
            success: function(current_song) {
                var $currentlyPlayingArtist = $('#currently_playing_artist');
                $currentlyPlayingArtist.empty();
                if (current_song.artist === 'Nothing Playing') {
                    $currentlyPlayingArtist.append('<label>Jukebox not started.</label>');
                }
                else {
                    $currentlyPlayingArtist.append('<img src="' + current_song.albumArt + '" class="currently_playing_album_art">');
                    $currentlyPlayingArtist.append(current_song.artist + ' - ' + current_song.title + ' - ' + current_song.album);
                    $currentlyPlayingArtist.append(millisToMinutesAndSeconds(current_song.elapsed) + ' / ' + millisToMinutesAndSeconds(current_song.duration))
                }
            },
            complete: function() {
                setTimeout(setup_currently_playing, 1000);
            }

        })
    }
});

function add_song(index) {
    var song = JSON.parse(songs[index]);
    $.post('/add/', songs[index], function () {
        $.notify('Added ' + song.title + ' to playlist', 'success')
    })
}

function add_station(index) {
    var song = JSON.parse(songs[index]);
    $.notify('Generating a station based on ' + song.title, 'info');
    $.ajax({
        method: 'POST',
        url: '/add_station/',
        data: songs[index],
        success: function () {
            $.notify('Added a station based on ' + song.title + ' to the playlist', 'success')
        },
        error: function () {
            $.notify('A station could not be generated from this song', 'error')
        }
    })
}

function add_next(index) {
    var song = JSON.parse(songs[index]);
    $.post('/add_next/', songs[index], function () {
        $.notify(song.title + ' added next in the playlist', 'success')
    })
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    seconds = (seconds == 60 ? 0 : seconds);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
