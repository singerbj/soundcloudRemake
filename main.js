$(document).ready(function(){
    var back = $('#back');
    var play = $('#play');
    var pause = $('#pause');
    var forward = $('#forward');

    var songs = $('#songs');
    var search = $('#search');

    var lastClicked;

    var player = new Player();
    window.p = player;

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
                player.loadSongs(tracks.filter(function(track){
                    return track.track_type === 'original';
                }).map(function(track){
                    return track.id;
                }));

                var table = $('<table></table>');
                table.addClass('table table-striped');
                
                var headerTr = $('<tr></tr>');
                headerTr.append($('<td><b>Title</b></td>').addClass("title"));    
                headerTr.append($('<td><b>Artist</b></td>').addClass("artist")); 
                table.append(headerTr);
                
                var songIndex = 0;
                tracks.forEach(function(track){
                    var tr = $('<tr id=' + track.id + '></tr>');
                    tr.append($('<td>' + track.title + '</td>').addClass("title"));    
                    tr.append($('<td>' + track.user.username + '</td>').addClass("artist"));
                    tr.songIndex = songIndex;

                    tr.click(function(e){
                        player.loadSongs(tracks.slice(tr.songIndex).map(function(track){
                            return track.id;
                        }));
                        player.forwardSong();
                    });

                    table.append(tr);
                    songIndex += 1;
                });           
                songs.append(table);
            }
        });
    };

    $(document).ready(function(){
        populateSongs("kygo");
        search[0].value = "kygo";
    })

    search.keyup(function(e){    
        populateSongs(e.currentTarget.value);
    });

});
