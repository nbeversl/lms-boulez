import * as React from "react";
import TrackWithSourceAlbum from "./TrackWithSourceAlbum";
import AlbumGrid  from './AlbumGrid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ServerContext from "./ServerContext";

class SearchResults extends React.Component {

    constructor(props) {
        this.state = {
            artistResults :[],
        }
    }
  
    render() {
        return (
            <ServerContext.Consumer> 
                { ( { playerInstance, library } )  => (
                    <div>
                        <a href="#tracks">Tracks</a><a href="#artists">Artists/Contributors</a>
                        { this.props.searchResultsAlbums ?
                            
                            <AlbumGrid
                                albumList={this.props.searchResultsAlbums}
                                screenWidth={this.props.screenWidth}
                                checkPlayerInstance={this.props.checkPlayerInstance}
                                >
                            </AlbumGrid>
                            :
                            <div>No Albums found</div>
                        }
                        { this.props.searchResultsTracks ?
                        
                            <TrackWithSourceAlbum 
                                tracks={this.props.searchResultsTracks} 
                                checkPlayerInstance={this.props.checkPlayerInstance}
                            />
                            :
                            <div>No Tracks Found</div>
                        }   
                        { this.props.searchResultsContributors ? 

                            <ArtistList 
                                library={library}
                                artists={this.props.searchResultsContributors} 
                                checkPlayerInstance={this.props.checkPlayerInstance}
                            />
                            :
                            <div>No Contributors Found</div>
                        } 
                    </div>
                )}
            </ServerContext.Consumer>
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
                            checkPlayerInstance={this.props.checkPlayerInstance}
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

export default SearchResults;