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
  
   playTrack(disc, trackNumber) {
        var that = this;
        this.props.checkPlayerInstance( () => {
    
            that.props.playerInstance.playAlbumFromTrackAndContinue(
                that.props.discs[disc][0], // disc doesn't matter, only passes the album ID 
                trackNumber)    
        });
    }

    render() {
        
        const tracklistStyle = {
            width: "100%",
            position:'absolute',
            zIndex:"100",
        }   
        var numDiscs = Object.keys(this.props.discs);
        let List = [];  
        var serverID = 0;
        numDiscs.forEach( (disc) => { 
               
                if ( numDiscs.length > 1 ) {
                    List.push(<div 
                            className={"disc-number"} 
                            key={"DISC-"+disc.toString()}>
                                <hr></hr>DISC {disc}
                            </div>);
                }
                this.props.discs[disc].forEach( (track) =>
                    { 
                        var trackNumber = track.tracknum;
                        track.serverID = serverID;
                        List.push( 
                            <TrackWithDetails 
                                    key={disc.toString()+'-'+trackNumber}
                                    discs={this.props.discs}
                                    disc={disc}
                                    track={track}
                                    trackNumber={trackNumber}
                                    serverID={serverID}
                                    playTrack={this.playTrack.bind(this)}
                                />
                        );
                    serverID++;
                    });
            });

        return (
            <div>
            { this.props.discs ? 
                <Scrollbars 
    
                    style={tracklistStyle}> 

                    <div className="grid-tracklist">
                        {List}
                    </div>
                </Scrollbars>
                :
                <div> Loading </div>
                }
            </div>
        )
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
                                playerInstance={this.props.playerInstance}
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


class TrackWithDetails extends React.Component {

    render() {
     
        return (
            <div>                       
                <span className="track-title"> 
                    {this.props.track.tracknum}: {this.props.track.title}
                </span> 
                <div className="codec">
                    { this.props.track.type == 'flc' ? 'FLAC'
                        : this.props.track.type }                            
                </div>
                <Button 
                    onClick={ () => { this.props.playTrack(this.props.disc, this.props.track.serverID) } } >Play
                </Button>
                <a href={"/music/"+this.props.track.id+"/download/"}>↓</a>
            </div>

        )
    }


}

export { TrackWithSourceAlbum, TrackList , TrackListScrolling }