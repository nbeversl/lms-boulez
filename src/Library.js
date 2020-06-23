
import { LMSRequest } from './server.js';

class LMSLibrary {

    constructor() {
        
        this.genres = {};
        this.albums = {};
        this.tracks = [];
        this.establishLibrary();
    }
    establishLibrary() {

        LMSRequest(["",["genres", "0", "1000"]], (r) => {
            r.result.genres_loop.forEach( (item) => {
                this.genres[item.genre] = {};
                this.genres[item.genre].id = item.id;
                LMSRequest(["" ,["albums", "0","1000","genre_id:"+ item.id.toString(),"tags:ljaS","sort:artflow" ]], 
                    (r) => {
                        this.genres[item.genre].albums = r.result.albums_loop
                    });
            });
        });
    }

    getAllTitlesforGenre(id) {

        this.titles = [];     
        LMSRequest(["",["titles", "0", "50000", "genre_id:"+id.toString(), "tags:id**e****o****t****m****u****a****l**" ]], (r) => {
      
            r.result.titles_loop.forEach( (item) => {

                this.tracks.push(item);

                if ( ! ( item.album_id in this.albums) ) {
                    this.albums[item.album_id] = {};
                }
                this.albums[item.album_id][item.tracknum] = item;
            });
        });
    }

    getAlbumTracks (albumID, callback) {
        LMSRequest(["",["titles","0","100","album_id:"+albumID, "sort:tracknum", "tags:**u****o****d****l****e**"]],(r) => {           
                callback(r.result.titles_loop )
        });
    }

}

export { LMSLibrary }