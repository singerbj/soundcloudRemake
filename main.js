var app = angular.module('SoundcloudRemake', []);

app.directive('navBar', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/navbar.html'
  };
});

// app.directive('songs', function() {
//   return {
//     restrict: 'E',
//     templateUrl: 'templates/songs.html'
//   };
// });

app.directive('controls', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/controls.html',
    controller: function(){
        console.log('here');
        var back = $('#back');
        var playPause = $('#playPause');
        var forward = $('#forward');
        var songs = $('#songs');
        var search = $('#search');

        var player = new Player();
        var lastClicked;

        window.p = player;

        back.click(function(){
            player.backSong();
        });
        playPause.click(function(){
            player.playPauseSong();
        });        
        forward.click(function(){
            player.forwardSong();
        });

        // $(document).click(function(){
        //   SC.get('/users/' + player.user.id + '/playlists', {}, function(playlists) {
        //     console.log(playlists);  
        //   });
        // });

        

        var populateSongs = function(text){
        songs.empty();
        songs.append('<img src="//d13yacurqjgara.cloudfront.net/users/12755/screenshots/1037374/hex-loader2.gif"/>');
        SC.get('/tracks', { q: text }, function(tracks) {
            if(tracks.length > 0){
                player.loadSongs(tracks.filter(function(track){
                    return track.track_type === 'original';
                }).map(function(track){
                    return track.id;
                }));

                var table = $('<table></table>');
                table.addClass('table table-striped');
                
                var headerTr = $('<tr></tr>').addClass("header");

                headerTr.append($('<th></th>').addClass("image")); 
                headerTr.append($('<th><b>Title</b></th>').addClass("title"));    
                headerTr.append($('<th><b>Artist</b></th>').addClass("artist")); 
                headerTr.append($('<th></th>').addClass("actions")); 
                table.append(headerTr);
                
                var songIndex = 0;
                tracks.forEach(function(track){
                    var tr = $('<tr id=' + track.id + '></tr>');
                    var artworkDiv = $('<div class="artwork"></div>');
                    if(track.artwork_url && track.artwork_url.length > 0){
                        artworkDiv.css("background-image", 'url("' + track.artwork_url + '")');
                    }
                    artworkDiv.css("background-color", '#FFEBDD');
                    var artworkTd = $('<td></td>')
                    artworkTd.html(artworkDiv);
                    tr.append(artworkTd);
                    var td = $('<td>' + track.title + '</td>').addClass("title");    
                    tr.append(td);    
                    tr.append($('<td>' + track.user.username + '</td>').addClass("artist"));
                    var qTd = $('<td><button class="btn btn-sm btn-warning"><span class="glyphicon glyphicon-plus"></span> to Q</button></td>');
                    tr.append(qTd);
                    tr.songIndex = songIndex;

                    td.click(function(e){
                        player.loadSongs(tracks.slice(tr.songIndex).map(function(track){
                            return track.id;
                        }));
                        player.forwardSong();
                    });
                    qTd.click(function(e){
                        player.addToQueue(track.id);
                    });

                    table.append(tr);
                    songIndex += 1;
                });           
                songs.empty();
                songs.append(table);
                player.clicked();
            }
        });
    };

    $(document).ready(function(){
        populateSongs(["kygo", "g-eazy", "madeon", "skizzy mars", "mystery skulls"][Math.floor((Math.random() * 4) + 0)]);        
    });

    search.keyup(function(e){    
        populateSongs(e.currentTarget.value);
    });

    }
  };
});

