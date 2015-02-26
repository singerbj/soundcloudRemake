var play = $('.play');
var pause = $('.pause');
var songs = $('#songs');
var search = $('#search');


     //new player()


var populateSongs = function(text){
    songs.empty();
    SC.get('/tracks', { q: text }, function(tracks) {
        if(tracks.length > 0){
            var table = $('<table></table>');
            table.addClass('table table-striped');
            
            var headerTr = $('<tr></tr>');
            headerTr.append($('<td><b>Title</b></td>').addClass("title"));    
            headerTr.append($('<td><b>Artist</b></td>').addClass("artist")); 
            headerTr.append($('<td></td>').addClass("artist")); 
            headerTr.append($('<td></td>').addClass("artist")); 
            table.append(headerTr);
            
            tracks.forEach(function(track){
                var tr = $('<tr></tr>');
                tr.append($('<td>' + track.title + '</td>').addClass("title"));    
                tr.append($('<td>' + track.user.username + '</td>').addClass("artist"));
                var play = $('<button class="btn play" id="' + track.id + '">Play</button>');
                var pause = $('<button class="btn pause" id="' + track.id + '">Pause</button>');
                
                var soundPlaying;
                play.click(function(e){
                    if(!soundPlaying){
                        SC.stream("/tracks/" + e.currentTarget.id, function(sound){
                            sound.play();
                            soundPlaying = sound;
                        });
                    }else{
                        if(soundPlaying.paused){
                            soundPlaying.play();
                        }
                    }  
                });
                pause.click(function(e){
                    if(soundPlaying){
                        soundPlaying.pause();
                    }
                }); 


                var playTd = $('<td></td>');
                var pauseTd = $('<td></td>');
                playTd.append(play);
                pauseTd.append(pause);
                
                tr.append(playTd);
                tr.append(pauseTd);
                table.append(tr);
            });           
            songs.append(table);
            
            


        }
    });
};

search.keyup(function(e){
    console.log(e.currentTarget.value);
    populateSongs(e.currentTarget.value);
});

