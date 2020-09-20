import { LMSRequest } from './server';

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

        this.addTrack= (id) => {
            LMSRequest([this.address,["playlistcontrol", "cmd:add", "track_id:"+id.toString()]]);
        }

        this.savePlayList = (filename) => {
            LMSRequest([this.address,["playlistcontrol", "cmd:save", filename]]);
        }

        this.setVolume = (value) => {
            
            LMSRequest([this.address,["mixer","volume", value.toString()]],(r) => { 

            });

        }

        this.playAlbumFromTrackAndContinue = (track, startNumber) => { 

            var albumID = track.album_id;
            LMSRequest([this.address,["playlist","clear"]],(r) => {                
                LMSRequest([this.address,["playlist", "addtracks", "album.id="+albumID]], (r) => {
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
