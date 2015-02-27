var Player = function(){  
  var self = this;
  SC.initialize({
      client_id: '36795704793d977a265b546b855f7ecb',
      redirect_uri: 'http://localhost:8080/'
  });
  
  self.future = [];
  self.history = [];
  //self.queue = [];
  self.volume;
  
  $('body').click(function(){
    console.log(self.history, self.future);
  });

  
  self.playSong = function(songId){     
      if(songId){      
        if(!self.volume){ self.volume = 50; }
        SC.stream("/tracks/" + songId, function(sound){          
          if(self.currentSong){ self.currentSong.sound.unload(); }
          self.currentSong = {sound: sound, id: songId};
          window.currentSong = {sound: sound, id: songId};
          self.currentSong.sound.setVolume(self.volume);        
          self.currentSong.sound.play();
          self.currentSong.sound._onfinish(function(){
            self.forwardSong();
          });
        });
      }else{
        if(!self.currentSong){
          self.forwardSong();
        }else{
          console.log(self.currentSong.sound.paused);
          if(self.currentSong.sound.paused === true){
            self.currentSong.sound.play();
          }
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
    if(self.future.length > 0){
      if(self.currentSong){         
        self.history.push(self.currentSong.id);
      }          
      self.playSong(self.future.splice(0, 1)[0]);
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
  //self.addToQueue = function(){
  //
  //}
    
  return self;
};
