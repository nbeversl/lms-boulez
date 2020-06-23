import React from 'react';
import Button from '@material-ui/core/Button';
import { Scrollbars } from 'react-custom-scrollbars';
import './style.css';

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
  
    render() {
        
        const tracklistStyle = {
            width: "100%",
            position:'absolute',
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
                            onClick={ () => 

                                this.props.playerInstance.playAlbumFromTrackAndContinue(
                                    this.props.tracks[trackNumber], trackNumber)
                                
                            }>Play
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



export { TrackList , TrackListScrolling }