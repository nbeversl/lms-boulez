import * as React from "react";
import TextField from '@material-ui/core/TextField';
import { TrackWithSourceAlbum } from "./Tracks";
import { AlbumGrid }  from './Albums';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button from '@material-ui/core/Button';

class SearchBar extends React.Component {
    
    constructor(props) {
        this.state = {
            searchString: '',
        }
    }
    handleSubmit(event) {
        event.preventDefault();
        this.props.searchFor(this.state.searchString);
    }
    handleChange(event) {
        this.setState({searchString: event.target.value})
    }
    clearSearchString() {
        this.setState({searchString:''});
    }
    
    render () {
    
        return (
            <div className="search-bar">
                <form onSubmit={this.handleSubmit.bind(this) }>
                    <TextField 
                        variant="outlined"
                        size="small"
                        value={this.state.searchString}
                        onChange={this.handleChange.bind(this)} 
                    />
                    <Button className="search-clear" onClick={this.clearSearchString.bind(this) }>x</Button>
                    <Button className="search-button" onClick={this.handleSubmit.bind(this) }>Search</Button>
                </form>
            </div>
        )
    }
}

class SearchResults extends React.Component {

    constructor(props) {
        this.state = {
            artistResults :[],
        }
    }
  
    render() {
        return (
            <div>
                <a href="#tracks">Tracks</a>  <a href="#artists">Artists/Contributors</a>
                { this.props.searchResultsAlbums ?
                    
                    <AlbumGrid
                        albumList={this.props.searchResultsAlbums}
                        screenWidth={this.props.screenWidth}
                        library={this.props.library}
                        playerInstance={this.props.playerInstance}
                        checkPlayerInstance={this.props.checkPlayerInstance}
                        >
                    </AlbumGrid>
                    :
                    <div>No Albums found</div>
                }
                { this.props.searchResultsTracks ?
                   
                    <TrackWithSourceAlbum 
                        tracks={this.props.searchResultsTracks} 
                        playerInstance={this.props.playerInstance}
                        library={this.props.library}
                        checkPlayerInstance={this.props.checkPlayerInstance}
                    />
                    :
                    <div>No Tracks Found</div>
                }   
                { this.props.searchResultsContributors ? 

                    <ArtistList 
                        artists={this.props.searchResultsContributors} 
                        library={this.props.library}
                        playerInstance={this.props.playerInstance}
                        checkPlayerInstance={this.props.checkPlayerInstance}
                    />
                    :
                    <div>No Contributors Found</div>
                } 
            </div>
        )
    }
}

class ArtistList extends React.Component {

    constructor(props) {
        this.state = {
            albums : {},
            tracks : {},
        }
    }

    populateArtist(artistID) {
        
        this.props.library.searchAlbumsByArtist(artistID, (result) => {
            var albumList = this.state.albums;
            if (! Object.keys(albumList).includes(artistID) ) {
                albumList[artistID] = result;
            }
            this.setState({albums : albumList });
        });

        this.props.library.searchTracksByArtist(artistID, (result) => {
            var trackList = this.state.tracks;
          
            if (! Object.keys(trackList).includes(artistID) ) {
                trackList[artistID] = result;
            }
            this.setState({tracks : trackList });
        })

    }

    render() {
        var List = [];
        this.props.artists.forEach( (artist) => {
            var artistID = artist.id;
            List.push( 
                <Accordion key={artistID} onChange={() => { this.populateArtist(artistID)} } >
                    <AccordionSummary>{artist.artist}</AccordionSummary>
                    {   this.state.albums[artistID] ?
                            <AccordionDetails> 
                                <AlbumGrid 
                                    albumList={this.state.albums[artistID]}
                                    library={this.props.library}
                                    playerInstance={this.props.playerInstance}
                                    checkPlayerInstance={this.props.checkPlayerInstance}
                                    >
                                </AlbumGrid>
                                
                            </AccordionDetails>
                        :
                        <div>No Albums Found</div>
                    }
                    { this.state.tracks[artistID] ? 
                        <TrackWithSourceAlbum 
                            tracks={this.state.tracks[artistID]} 
                            playerInstance={this.props.playerInstance}
                            checkPlayerInstance={this.props.checkPlayerInstance}
                            library={this.props.library}
                    />
                    :
                        <div>No Tracks Found</div>
                    }

                </Accordion>
            );
        });

        return (
            <div>
                <a name="artists"></a><h2>Artists/Contributors</h2>
                {List}
            </div>
        )

    }
}

export { SearchBar, SearchResults }