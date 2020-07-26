import * as React from "react";
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { AlbumGrid }  from './Albums';
import  { TrackWithSourceAlbum  } from './Tracks';

class ComposerList extends React.Component {
    
    render() {
       
        let artistList = {};
        this.props.albumList.forEach( (item) => { 
            if ( ! Object.keys(artistList).includes(item.artist) ) { 
                artistList[item.artist] = [];
            }
            artistList[item.artist].push(item);
        });
        var artists = Object.keys(artistList).sort(); 
        var Table = [];
        artists.forEach( (artistName) => { 
            Table.push(
                <Composer 
                    key={artistName} 
                    composerName={artistName} 
                    albumList={artistList[artistName]}
                    playerInstance={this.props.playerInstance}
                    checkPlayerInstance={this.props.checkPlayerInstance}
                    library={this.props.library}
                    />     
                );
        });
             
        return (
           <Accordion >  
                {Table}
           </Accordion>
        );

    }
}

class Composer extends React.Component {
   
    render() {
    
        return (
            <Card >      
                <Accordion.Toggle as={Card.Header} eventKey={this.props.composerName} >
                    <Card.Header> {this.props.composerName} </Card.Header>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={this.props.composerName}>
                    <Card.Body>
                    <AlbumGrid
                        playerInstance={this.props.playerInstance}
                        albumList={this.props.albumList} 
                        library={this.props.library}
                        checkPlayerInstance={this.props.checkPlayerInstance}
                        />
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        );
    }

}

class ArtistListWithTracks extends React.Component {
    
    constructor(props) {
        this.state = {
            tracks :[]
        }
    }

    componentDidUpdate () {
       
        this.props.artists.forEach( (artist) => {
            this.props.library.searchTracksByArtist( artist.id, (result) => {
                if (result) {
                    result.forEach( (track) => {
                        var currentTracks = this.state.tracks;
                        if ( ! currentTracks.includes(track) ) {
                            currentTracks.push(result);
                            this.setState({tracks: currentTracks});
                        }
                    });
                }
            });
        });
    }

    render() {
        var Table = [];
        this.state.tracks.forEach( (track) => {
            Table.push(track.title);
        });     
        return( 
            <div>
                HERE IS THE ARTIST LIST
                {Table}
            </div>
        )
    }

}

export { Composer, ComposerList, ArtistListWithTracks }