import React from 'react';
import Button from '@material-ui/core/Button';
import Card from 'react-bootstrap/Card';
import { Scrollbars } from 'react-custom-scrollbars';
import './style.css';

class TrackList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tracks:[]
        }
    }
  
    componentDidMount() {
       
        this.props.playerInstance.getAlbumTracks(this.props.albumID, 
            (result) => {
                this.setState({tracks: result});
            });
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
            <div></div>
            :
            <div> Loading </div>
        );
    }
}

class TrackListScrolling extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            tracks:[],
        }
    }
  
    componentDidMount() {
       
        this.props.playerInstance.getAlbumTracks(this.props.albumID, 
            (result) => {
                this.setState({tracks: result});
            });
       }

    render() {
        
        let List = [];  
        Object.keys(this.state.tracks).forEach( (number) =>
            { 
                List.push( 
                    <li key={this.state.tracks[number].id}>                       
                        <Button 
                            onClick={ () => 
                                this.props.playerInstance.playTrackAndContinue(
                                        this.state.tracks, number)
                            }>
                            <span className="track-title"> 
                                {this.state.tracks[number].title}
                            </span> 
                            <div className="codec">
                                { this.state.tracks[number].type == 'flc' ? 'FLAC'
                                    : this.state.tracks[number].type }                            
                            </div>
                        </Button>
                    </li>
                );
            });
        return (
            this.state.tracks != [] ? 
            <Scrollbars > 
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