import * as React from "react";
import TrackWithSourceAlbum from "./TrackWithSourceAlbum";
import AlbumGrid  from './AlbumGrid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ServerContext from "./ServerContext";
import CircularProgress from '@material-ui/core/CircularProgress';

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
                        go to <a href="#tracks">Tracks</a> | <a href="#artists">Artists/Contributors</a>
                        { this.props.searchResultsAlbums != null ?
                            
                            <div> 

                                { this.props.searchResultsAlbums.length ?    
                                    <div>
                                        <h2>Albums</h2>                 
                                        <AlbumGrid
                                            albumList={this.props.searchResultsAlbums}
                                            screenWidth={this.props.screenWidth}
                                            checkPlayerInstance={this.props.checkPlayerInstance}
                                            >
                                        </AlbumGrid>
                                    </div>
                                    :
                                    <div>No Albums found</div>
                                }   
                            </div>
                            :<CircularProgress/>
                        }
                        { this.props.searchResultsTracks != null ?

                                <div> 
                                    <a name="tracks"></a>
                                    { this.props.searchResultsTracks.length ?
                                        <div>
                                            <a href="#tracks"></a><h2>Tracks</h2>
                                            <TrackWithSourceAlbum 
                                                tracks={this.props.searchResultsTracks} 
                                                checkPlayerInstance={this.props.checkPlayerInstance}
                                            />
                                        </div>
                                        :
                                        <div>No Tracks Found</div>
                                    }
                                </div>
                                :
                                <CircularProgress/>
                        }   
                        { this.props.searchResultsContributors ? 

                            <div><a name="artists"></a>
                                { this.props.searchResultsContributors.length ?
                                
                                <ArtistList 
                                    library={library}
                                    artists={this.props.searchResultsContributors} 
                                    checkPlayerInstance={this.props.checkPlayerInstance}
                                />
                                :
                                <div>No Contributors Found</div>

                                }
                            </div>
                            :
                            <CircularProgress/>
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
                        <div>
                            { this.state.albums[artistID].length ? 
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
                        </div>
                        :
                        <CircularProgress/>
                    }
                    { this.state.tracks[artistID] ? 

                        <div>
                            {this.state.tracks[artistID].length ? 

                                <TrackWithSourceAlbum 
                                tracks={this.state.tracks[artistID]} 
                                checkPlayerInstance={this.props.checkPlayerInstance}
                                />
                            :
                            <div>No Tracks Found</div>
                            }

                        </div>
                        :
                        <CircularProgress/>
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