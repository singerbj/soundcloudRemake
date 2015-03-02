var Player = function(){  
  var self = this;
  SC.initialize({
      client_id: '36795704793d977a265b546b855f7ecb',
      redirect_uri: 'http://localhost:8000/callback.html'
  });
  
  self.future = [];
  self.history = [];
  self.queue = [];
  self.volume;
  
  SC.connect(function() {
    SC.get('/me', function(me) { 
      console.log(me.id);
      self.user = me;
    });
  });


  var mToS = function(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  self.playSong = function(songId){
      self.time = null;
      if(songId){      
        if(!self.volume){ self.volume = 50; }
        SC.stream("/tracks/" + songId, {
          onfinish: function(){
            self.forwardSong();
          },
          whileplaying: function(sound){
            $('#position')[0].innerHTML = mToS(this.position);
            $('#total')[0].innerHTML = mToS(this.duration);
            $('#remaining')[0].innerHTML = mToS(this.duration - this.position);
          }
        }, function(sound){
          console.log(sound);
          if(self.currentSong){ self.currentSong.sound.unload(); }
          self.currentSong = {sound: sound, id: songId};
          self.currentSong.sound.setVolume(self.volume);        
          self.currentSong.sound.start();
          
          //set class for click 
          if(self.lastPlayed && $('#' + self.lastPlayed.id)[0]){ 
            $('#' + self.lastPlayed.id)[0].className = "";
          }
          self.lastPlayed = self.currentSong;
          if($('#' + self.lastPlayed.id)[0]){
            $('#' + self.lastPlayed.id)[0].className = "clicked";
          }

        });
      }else{
        if(self.currentSong && self.currentSong.sound.paused === true){
          self.currentSong.sound.play();
        }
      }    
  }
  self.pauseSong = function(){
    if(self.currentSong){
      self.currentSong.sound.pause();
    }
  }    
  self.backSong = function(){
    if(self.history.length > 0){   
      if(self.currentSong && self.currentSong.sound.position < 1500 && self.history.length > 0){
        self.future.unshift(self.currentSong.id);        
        self.playSong(self.history.splice(self.history.length - 1, 1)[0]);
      }else{      
        self.currentSong.sound.setPosition(0);
        self.playSong();
      }
    }
  }
  self.forwardSong = function(){
    if(self.queue.length > 0){
      if(self.currentSong){         
        self.history.push(self.currentSong.id);
      }          
      self.playSong(self.queue.splice(0, 1)[0]);
    }else{  
      if(self.future.length > 0){
        if(self.currentSong){         
          self.history.push(self.currentSong.id);
        }          
        self.playSong(self.future.splice(0, 1)[0]);
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
  //self.removeFromQueue = function(index){
  //
  //}  
  return self;
};
