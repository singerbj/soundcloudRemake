var Player = function(){  
  var self = this;
  SC.initialize({
      client_id: '36795704793d977a265b546b855f7ecb',
      redirect_uri: 'http://192.168.0.152:8000/callback.html'
  });
  
  self.future = [];
  self.history = [];
  self.queue = [];
  self.volume = 50;
  
  SC.connect(function() {
    SC.get('/me', function(me) { 
      self.user = me;
    });
  });


  var mToS = function(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  self.playPauseSong = function(songId){
      self.time = null;
      if(songId){      
        SC.stream("/tracks/" + songId, {
          onfinish: function(){
            self.forwardSong();
          },
          whileplaying: function(sound){
            $('#position')[0].innerHTML = mToS(this.position);
            //$('#total')[0].innerHTML = mToS(this.duration);
            $('#remaining')[0].innerHTML = mToS(this.duration - this.position);
          }
        }, function(sound){
            SC.get("/tracks/" + songId, {}, function(track){              
              $('#title')[0].innerHTML = track.title;
              $('#artist')[0].innerHTML = track.user.username;
            });
            if(self.currentSong){ self.currentSong.sound.unload(); }
            self.currentSong = {sound: sound, id: songId};
            self.currentSong.sound.setVolume(self.volume);        
            self.currentSong.sound.start();            
            self.clicked();
        });
      }else{
        if(self.currentSong){
          if(self.currentSong.sound.paused === true){
            self.currentSong.sound.play();
          }else{
            self.currentSong.sound.pause();
          }
        }
      }    
  }
  // self.pauseSong = function(){
  //   if(self.currentSong){
  //     self.currentSong.sound.pause();
  //   }
  // }    
  self.backSong = function(){
    if(self.history.length > 0){   
      if(self.currentSong && self.currentSong.sound.position < 1500 && self.history.length > 0){
        self.future.unshift(self.currentSong.id);        
        self.playPauseSong(self.history.splice(self.history.length - 1, 1)[0]);
      }else{      
        self.currentSong.sound.setPosition(0);
        self.playPauseSong();
      }
    }
  }
  self.forwardSong = function(){
    if(self.queue.length > 0){
      if(self.currentSong){         
        self.history.push(self.currentSong.id);
      }          
      self.playPauseSong(self.queue.splice(0, 1)[0]);
    }else{  
      if(self.future.length > 0){
        if(self.currentSong){         
          self.history.push(self.currentSong.id);
        }          
        self.playPauseSong(self.future.splice(0, 1)[0]);
      }
    }
  }
  self.loadSongs = function(arrayOfSongIds){
    self.future = arrayOfSongIds;
  }
  self.volumeUp = function(){
    if(self.volume && self.volume + 5 <= 100){
      self.volume += 5;
    }else{
      self.volume = 100;
    }
  }
  self.volumeDown = function(){
    if(self.volume && self.volume - 5 >= 0){
      self.volume -= 5;
    }else{
      self.volume = 0;
    }
  }
  self.getTime = function(){
    return self.time;
  }
  self.addToQueue = function(songId){
    self.queue.push(songId)
  }
  self.clicked = function(){
    //set class for click 
    if(self.lastPlayed && $('#' + self.lastPlayed.id)[0]){ 
      $('#' + self.lastPlayed.id)[0].className = "";
    }
    if(self.currentSong){
      self.lastPlayed = self.currentSong;
      if($('#' + self.lastPlayed.id)[0]){
        $('#' + self.lastPlayed.id)[0].className = "clicked";
      }
    }
  }
  //self.removeFromQueue = function(index){
  //
  //}  
  return self;
};
