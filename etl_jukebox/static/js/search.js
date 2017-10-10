var songs = [];
var hide_playlist = true;

$(document).ready(function () {
    setup_search();

    setup_play_button();

    setup_playlist();

    setup_currently_playing();

    function setup_search() {
        var search_form = $("#search_form");
        search_form.on('submit', function (e) {
            e.preventDefault();
            songs = [];
            $('#search_results').find('tr').remove();
            $.ajax({
                type: 'GET',
                url: '/search/',
                data: $('#search_form').find(':input'),
                success: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        var song = data[i].track;
                        songs[i] = JSON.stringify(song);
                        $('#search_results').find('tbody').append(
                            '<tr><td><img src="' + song.albumArtRef[0].url + '" class="album-art"></td><td>'
                            + song.artist + '</td><td>' + song.title
                            + '</td><td><button onclick="add_song(' + i + ')">Add to Playlist</button></td></tr>')
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
        $.post('/add/', songs[index])
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
