import * as React from "react";
import Button from '@material-ui/core/Button';
import { Scrollbars } from 'react-custom-scrollbars';
import './style.css';
import { Album } from './Albums';

class TrackList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tracks:[]
        }
    }

    render() {
        
        let List = [];  
        Object.keys(this.state.tracks).forEach( (number) =>
            { 
                List.push( 
                    <li key={this.state.tracks[number].id}>
                        {this.state.tracks[number].title} ({this.state.tracks[number].type})
                        <Button onClick={() => this.props.playerInstance.playTrack(this.state.tracks[number].id)}>play</Button>
                    </li>
                );
            });
        return (
            this.state.tracks != [] ? 
            <div>{List}</div>
            :
            <div> Loading </div>
        );
    }
}

class TrackListScrolling extends React.Component {
  
   playTrack(trackNumber) {
        var that = this;
        this.props.checkPlayerInstance( () => {
            that.props.playerInstance.playAlbumFromTrackAndContinue(
                that.props.tracks[trackNumber], trackNumber)
        });
    }


    render() {
        
        const tracklistStyle = {
            width: "100%",
            position:'absolute',
            zIndex:"100",
        }      
        let List = [];  
        Object.keys(this.props.tracks).forEach( (trackNumber) =>
            { 
                List.push( 
                    <li key={trackNumber}>                       
                        <span className="track-title"> 
                                {this.props.tracks[trackNumber].title}
                        </span> 
                        <div className="codec">
                            { this.props.tracks[trackNumber].type == 'flc' ? 'FLAC'
                                : this.props.tracks[trackNumber].type }                            
                        </div>
                        <Button 
                            onClick={ () => { this.playTrack(trackNumber) } } >Play
                        </Button>
                        <a href={"/music/"+this.props.tracks[trackNumber].id+"/download/"}>↓</a>
                    </li>
                );
            });
        return (
            this.props.tracks != [] ? 
            <Scrollbars style={tracklistStyle}> 
                <ol className="grid-tracklist">
                    {List}
                </ol>
            </Scrollbars>
            :
            <div> Loading </div>
        );
    }
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
                            <div className="codec">
                                { track.type == 'flc' ? 'FLAC' : track.type }                            
                            </div>
                            <Button onClick={ () => { this.playTrack(track.id) } } >
                                Play
                            </Button>
                            <a href={"/music/"+track.id+"/download/"}>↓</a>
                            <div>Album: {track.album}</div>
                            <div>Track# {track.tracknum} </div>
                            <div>Artist: {track.artist}</div>
                            { track.disc ? <div>Disk: {track.disc} </div> : <div></div> }                            
                        </div>

                        <div className="tracklist-album">                   
                            <Album 
                                id={track.album_id} 
                                library={this.props.library} 
                                art={track.artwork_track_id}
                                checkPlayerInstance={this.props.checkPlayerInstance}
                            />
                        </div>   

                 </div>
            );
        });
        return (
            <div>
                <a href="#tracks"></a><h2>Tracks</h2>
                {List}
            </div>
        );
    
    }
}


export { TrackWithSourceAlbum, TrackList , TrackListScrolling }