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

  
  self.playSong = function(){      
    if(self.currentSong){      
      if(!self.volume){ self.volume = 50; }
      self.currentSong.setVolume(self.volume);        
      self.currentSong.start();
      self.currentSong._onfinish(function(){
        self.forwardSong();
      });
    }else if(!self.currentSong){
      self.forwardSong();
    }
  }
  self.pauseSong = function(){
    if(self.currentSong){
      self.currentSong.pause();
    }
  }    
  self.backSong = function(){
    if(self.history.length > 0){   
      if(self.currentSong && self.currentSong.position < 1500 && self.history.length > 0){
        self.currentSong.unload();
        self.future.unshift(parseInt(self.currentSong.sID.replace('T/tracks/', '').split('-')[0], 10));
        SC.stream("/tracks/" + self.history.splice(self.history.length - 1, 1)[0], function(sound){
          self.currentSong = sound;
          self.playSong();
        });
      }else{      
        self.currentSong.setPosition(0);
        self.playSong();
      }
    }
  }
  self.forwardSong = function(){
    if(self.future.length > 0){
      if(self.currentSong){         
        self.currentSong.unload();
        self.history.push(parseInt(self.currentSong.sID.replace('T/tracks/', '').split('-')[0], 10));
      }    
      SC.stream("/tracks/" + self.future.splice(0, 1)[0], function(sound){
        self.currentSong = sound;
        self.playSong();
      });
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
