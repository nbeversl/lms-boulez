
import { LMSRequest } from './server';

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

        LMSRequest(["",["titles","0","100","album_id:"+albumID, "sort:tracknum", "tags:**o****l**"]],(r) => {           
            callback(r.result.titles_loop )
        });
    }
   
    
    searchAlbums(searchString, callback) {

        LMSRequest(["",["albums","0","100","search:"+searchString, "tags:ljaS"]],(r) => {           
            callback(r.result.albums_loop);
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