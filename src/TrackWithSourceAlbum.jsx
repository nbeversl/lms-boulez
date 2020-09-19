import * as React from "react";
import Button from '@material-ui/core/Button';
import './style.css';
import Album from './Album';
import { useContext } from 'react';
import ServerContext from "./ServerContext";

function AlbumFromID (id, tempArt) {
    const globals = useContext(ServerContext);
    var album = globals.library.getAlbumFromID(id);
    return <Album tempArt={id} album={album}></Album>
}

class TrackWithSourceAlbum extends React.Component {

    playTrack(trackID) {
        var that = this;
        this.props.checkPlayerInstance( () => {
            that.props.playerInstance.playTrack(trackID); });
    }

    render() {
        let List = [];  
        this.props.tracks.forEach( (track) => {

            List.push( 
                <div key={track.id} className="list-track">
                            
                        <div className="track-info">
                            <span> {track.title} </span> 
                            <div className="codec"> { track.type == 'flc' ? 'FLAC' : track.type } </div>
                            <Button onClick={ () => { this.playTrack(track.id) } } > Play </Button>
                            <a href={"/music/"+track.id+"/download/"}>↓</a>
                            <div>Album: {track.album}</div>
                            <div>Track# {track.tracknum} </div>
                            <div>Artist: {track.artist}</div>
                            { track.disc ? <div>Disk: {track.disc} </div> : <div></div> }                            
                        </div>

                        <div className="tracklist-album">                   
                            <Album
                                fromAlbumID={track.album_id} 
                                checkPlayerInstance={this.props.checkPlayerInstance}
                            />
                        </div>   

                 </div>
            );
        });
        return (
            <div>
                {List}
            </div>
        );
    
    }
}

export default TrackWithSourceAlbum;