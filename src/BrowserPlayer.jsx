import { Howl } from 'howler';
import { LMSRequest } from './server';

class BrowserPlayer {
    constructor(proxyAddress) {
    
        this.address = proxyAddress;
        this.playerInstance = null;
       
        this.tracks = [];
        this.currentIndex = null;
        
        this.play = () => {
           this.playerInstance.play();
        }

        this.pause = () => { 
            if ( this.playerInstance.playing() ) {
                this.playerInstance.pause();
            } else { 
                this.playerInstance.play();
            }
        }

        this.playAlbum = (albumTitle) => {
            LMSRequest([this.address,["playlist", "loadalbum", '*', '*', albumTitle]], (r) => {
              
            });
        }

        this.playTrack = (id) => { 
        
            LMSRequest([this.address,["playlist","clear"]],(r) => {
                LMSRequest([this.address,["playlistcontrol", "cmd:add", "track_id:"+id.toString()]],(r) => {
                });
            });

        }

        this.setVolume = (value) => {

            this.playerInstance.volume(value/100);

        }

        this.playAlbumFromTrackAndContinue = (track, startNumber) => { 
           
            var albumID = track.album_id;

            LMSRequest(["",["titles", "0", "100", "album_id:"+albumID, "sort:tracknum", "tags:**e**"]], (r) => {

                startNumber = parseInt(startNumber);
                this.currentIndex = startNumber;
    
                this.tracks = r.result.titles_loop;
  
                this.clearPlaylist();
               
                this.playerInstance = new Howl({
                   html5:true,
                    src: [ '/music/' + this.tracks[this.currentIndex].id.toString() +'/download/.flac' ] ,
                    onend: () => { 
                       this.nextTrack();          
                    },

                });
                this.playerInstance.play();

            });
            
          
        }
        this.clearPlaylist = () => {
            if (this.playerInstance) { 
                this.playerInstance.stop(); 
                this.playerInstance.unload(); 
            }
        }


        this.nextTrack = () => {
            this.clearPlaylist();
            if (this.currentIndex < this.tracks.length ) {
                this.currentIndex++;
                this.playerInstance._src = '/music/' + this.tracks[this.currentIndex].id.toString() +'/download/.flac';
                this.playerInstance.play();
            }      
           
        }

        this.previousTrack = () => {
            this.clearPlaylist();
            if (this.currentIndex > 0 ) {
                this.currentIndex--;
                this.playerInstance._src = '/music/' + this.tracks[this.currentIndex].id.toString() +'/download/.flac' ;
                this.playerInstance.play();
            }     
        }

        this.PlayerStatus = (callback) => {

            LMSRequest([this.address,[ "status","0","10","tags:duration,time,mode"]], (r) => {
                callback(r.result);              
            });
        }

        this.ElapsedTimePerecent = (callback) =>  {
            LMSRequest([this.address,["time", "?"]], (r) => {

                callback(r.result._time);
            });
        }

        this.seek = (seconds) => {
            LMSRequest([this.address,["time", seconds ]]);

        }
    }

}

export { BrowserPlayer }