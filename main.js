var back = $('#back');
var play = $('#play');
var pause = $('#pause');
var forward = $('#forward');

var songs = $('#songs');
var search = $('#search');


var player = new Player();
window.p = player;
console.log(player);

back.click(function(){
    player.backSong();
});
play.click(function(){
    player.playSong();
});
pause.click(function(){
    player.pauseSong();
});
forward.click(function(){
    player.forwardSong();
});





var populateSongs = function(text){
    songs.empty();
    SC.get('/tracks', { q: text }, function(tracks) {
        if(tracks.length > 0){
            player.loadSongs(tracks.map(function(track){
                return track.id;
            }));

            var table = $('<table></table>');
            table.addClass('table table-striped');
            
            var headerTr = $('<tr></tr>');
            headerTr.append($('<td><b>Title</b></td>').addClass("title"));    
            headerTr.append($('<td><b>Artist</b></td>').addClass("artist")); 
            table.append(headerTr);
            
            tracks.forEach(function(track){
                var tr = $('<tr></tr>');
                tr.append($('<td>' + track.title + '</td>').addClass("title"));    
                tr.append($('<td>' + track.user.username + '</td>').addClass("artist"));
                table.append(tr);
            });           
            songs.append(table);
        }
    });
};

search.keyup(function(e){    
    populateSongs(e.currentTarget.value);
});

