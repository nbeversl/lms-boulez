import { LMSRequest } from './server.js';

class Player {
    
    constructor(address) {
        this.address = address;

        this.play = () => {
            LMSRequest([this.address,["play"]])
        }
        this.pause = () => {
           
            LMSRequest([this.address,["pause"]], (r) => {
                console.log(r);
            })
        }
        this.playAlbum = (albumTitle) => {
            LMSRequest([this.address,["playlist", "loadalbum", '*', '*', albumTitle]], (r) => {
                console.log(r);
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
    }
}

export { Player }
