import { LMSRequest } from './server';
import { start } from 'repl';

class Player {
    
    constructor(address) {

        this.address = address;
        this.tracks = [];
        this.playing = null;

        this.play = () => {
            LMSRequest([this.address,["play"]])
            this.playing = true;
        }

        this.pause = () => {   
            LMSRequest([this.address,["pause"]], (r) => {
            })
            this.playing = ! this.playing;
        }

        this.playAlbum = (albumTitle) => {
            LMSRequest([this.address,["playlist", "loadalbum", '*', '*', albumTitle]], (r) => {
                this.play();
            });
        }

        this.playTrack = (id) => { 
           
            LMSRequest([this.address,["playlist","clear"]],(r) => {
                LMSRequest([this.address,["playlistcontrol", "cmd:add", "track_id:"+id.toString()]],(r) => {
                    LMSRequest([this.address,["play"]]);
                });
            });

        }

        this.setVolume = (value) => {
            
            LMSRequest([this.address,["mixer","volume", value.toString()]],(r) => { 

            });

        }

        this.playAlbumFromTrackAndContinue = (track, startNumber) => { 
        
            var albumTitle = track.album;
    
            LMSRequest([this.address,["playlist","clear"]],(r) => {
                
                LMSRequest([this.address,["playlist", "loadalbum",'*', '*', albumTitle]], (r) => {
                  
                    LMSRequest([this.address,["playlist", "index",'+'+startNumber.toString()]]);
        
                });
            
            });

        }
        this.nextTrack = () => {
            LMSRequest([this.address,["playlist", "index", "+1"]],(r) => {
            });
        }

        this.previousTrack = () => {
            LMSRequest([this.address,["playlist", "index", "-1"]],(r) => {
            });
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

export { Player }
