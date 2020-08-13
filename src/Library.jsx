
import { LMSRequest } from './server';

class LMSLibrary {

    constructor() {
        
        this.genres = {};
        this.albums = {};
        this.tracks = [];

    }

    establishLibrary(callback) {

        LMSRequest(["",["genres", "0", "1000"]], (r) => {
            r.result.genres_loop.forEach( (item) => {
                this.genres[item.genre] = {};
                this.genres[item.genre].id = item.id;
                LMSRequest(["" ,["albums", "0","1000","genre_id:"+ item.id.toString(),"tags:ljaS","sort:artflow" ]], 
                    (r) => {
                        this.genres[item.genre].albums = r.result.albums_loop
                    });
            });
            
            if (callback) { callback(this); }            
        });
    }

    getAllAlbumsforGenre(id, callback) {
        this.titles = [];
        LMSRequest(["",["albums", "0", "50000", "genre_id:"+id.toString(), "tags:**id**ljatsS" ]], (r) => {
            r.result.albums_loop.forEach( (album) => {
                    this.albums[album.id] = album;
                });
            if (callback) { callback(); }
        });
    }

    getAlbumTracks (albumID, callback) {

        LMSRequest(["",["titles","0","100","album_id:"+albumID, "sort:tracknum", "tags:**t****o****l****i****e**"]],(r) => {           

            callback(r.result.titles_loop )
        });
    }
   
    
    searchAlbums(searchString, callback) {

        LMSRequest(["",["albums","0","100","search:"+searchString, "tags:ljaS"]],(r) => {           
            callback(r.result.albums_loop);
       });

    }

    getAlbumFromID(albumID, callback) {
        LMSRequest(["",["albums","0","100","album_id:"+albumID, "tags:ljaS"]], (r) => {
            callback(r.result.albums_loop[0]);
        });
    }

    searchTracks(searchString, callback) {
        
        LMSRequest(["",["titles","0","100","search:"+searchString, "tags:id**e****o****t****m****u****a****l****J**"]],(r) => {           
            callback(r.result.titles_loop);
       });

    }

    searchContributors(searchString, callback) {
       
        LMSRequest(["",["artists","0","100","search:"+searchString]],(r) => {           
            callback(r.result.artists_loop);
        });

    }
    
    searchTracksByArtist(artist_id, callback) {

        LMSRequest(["",["titles","0","100","artist_id:"+artist_id, "tags:id**e****o****t****m****u****a****l**"]],(r) => {           
            callback(r.result.titles_loop);
        });

    }

    searchAlbumsByArtist(artist_id, callback) {

        LMSRequest(["",["albums","0","100","artist_id:"+artist_id, "tags:idjtla"]],(r) => {           
            callback(r.result.albums_loop);
        });

    }



}

export { LMSLibrary }