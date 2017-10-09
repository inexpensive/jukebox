var songs = [];

$(document).ready(function () {
    var search_form = $("#search_form");
    search_form.on('submit', function (e) {
        e.preventDefault();
        songs = [];
        $('#search_results').find('tr').remove();
        $.ajax({
            type: 'GET',
            url: '/search/',
            data: $('#search_form').find(':input'),
            success: function(data) {
                 for(var i = 0; i < data.length; i++) {
                     var song = data[i].track;
                     songs[i] = JSON.stringify(song);
                     $('#search_results').find('tbody').append('<tr><td><img src="' + song.albumArtRef[0].url
                         + '" class="album-art"></td><td>' + song.artist + '</td><td>' + song.title
                         + '</td><td><button onclick="add_song(' + i + ')">Add to Playlist</button></td></tr>')
    }
            }
        })
    });
    $('#play_button').click(function () {
        $.get('/play/');
    });
});

add_song = function (index) {
    $.post('/add/', songs[index]);
};
