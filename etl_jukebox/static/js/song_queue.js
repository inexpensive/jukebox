$(function () {
    $(".song-list").click(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'GET',
            data: extract_song_id(this.href),
            url: '/add/'
        })
    })
});

extract_song_id = function (url) {
    return url.split('?')[1];
};