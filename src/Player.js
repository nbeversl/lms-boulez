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
        
        this.playTrackAndContinue = (tracks, startNumber) => { 
            this.state.tracks = tracks;
            LMSRequest([this.address,["playlist","clear"]],(r) => {
                
                var tracksToAdd = '';
                for (var i=startNumber; i<tracks.length; i++) {
                    tracksToAdd += tracks[i].id.toString();
                    tracksToAdd += ',';
                    }
                
                LMSRequest([this.address,["playlistcontrol", "cmd:add", "track_id:"+tracksToAdd]],(r) => {
                    LMSRequest([this.address,["play"]]);
                });
            });

        }

        this.PlayerStatus = (callback) => {
            LMSRequest([this.address,[ "status","0","10","tags:duration,time"]], (r) => {
                callback(r.result);              
                console.log(r.result);              
            });
        }

        this.ElapsedTimePerecent = (callback) =>  {
            LMSRequest([this.address,["time", "?"]], (r) => {

                callback(r.result._time);
            });
        }

        this.seek = (seconds) => {
            console.log(seconds);
            LMSRequest([this.address,["time", seconds ]]);

        }
        this.getGenres = (callback) => {
            LMSRequest([this.address,["genres", "0", "1000"]], (r) => {
                callback(r.result.genres_loop);
            });
        }

        this.getAlbumTracks = (albumID, callback) => {
            LMSRequest([this.address,["titles","0","100","album_id:"+albumID, "sort:tracknum", "tags:**o****d**"]],(r) => {
                if ( r.result.titles_loop ){ 
                    callback(r.result.titles_loop )
                }

            });
        }

        this.getAlbumsInGenre = (selectedGenre, callback) => {

            LMSRequest([this.address,["albums", "0","1000","genre_id:"+ selectedGenre.toString(),"tags:ljaS" ]], 
                (r) => {
                    callback(r.result.albums_loop || [] );
            });
        }
    }
}

export { Player }
