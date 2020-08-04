import * as React from "react";
import Button from '@material-ui/core/Button';
import { ComposerList } from './Classical';
import { AlbumGrid }  from './Albums';
import { BPMView } from './views';
import { SearchBar, SearchResults } from './Search';
import ScrollUpButton from "react-scroll-up-button";

class GenreMenu extends React.Component {
    constructor(props) {
        this.state = {
            genresTable : [],
            genreSelected :0,
            trackList : [],
            albumSelected : null,
            albumSelectedID : null,
            view : 'grid',
            searchResultsAlbums : [],
            searchResultsTracks : [],
            searchResultsContributors : [] 
        }
        this.handleAlbumChange = this.handleAlbumChange.bind(this);
    }

    handleGenreChange(e) {
        
        var genreSelected = e.currentTarget.value;
        this.props.library.getAllTitlesforGenre( this.props.library.genres[genreSelected].id, () => {
            this.setState({
                genreSelected: genreSelected,
            });
        });
    }

    handleAlbumChange(id, name) {
        
        this.props.playerInstance.getAlbumTracks(id, 
            (result) => { 
                this.setState({trackList:result})
            });
        this.setState({albumSelected : name }); 
        this.setState({albumSelectedID : id });
    }

    handleViewChange(name) {
        this.setState({view:name});
    }
   
    searchFor (item) {

        this.setState({view:'search'});

        this.props.library.searchAlbums(item, (result) => {
            this.setState({searchResultsAlbums: result});
         });

        this.props.library.searchTracks(item, (result) => {
            this.setState({searchResultsTracks: result});
         });

        this.props.library.searchContributors(item, (result) => {
            this.setState({searchResultsContributors: result});
         });
        
    }
    componentDidMount() {
        this.getGenres();
    }

    componentDidUpdate() {
        this.getGenres();
    }

    getGenres() {
        let genresTable = [];
        Object.keys(this.props.library.genres).forEach( (genreName) => { 
           
            genresTable.push(
                <Button   
                    className={"genre-choice"}  
                    key={genreName}
                    value={genreName} 
                    onClick={this.handleGenreChange.bind(this)} >
                        {genreName}
                </Button>
            );
            if (genresTable.length == Object.keys(this.props.library.genres).length) {
               
                if ( genresTable.length != this.state.genresTable.length ) {
                    this.setState({genresTable : genresTable });        
                }
            }
        });

    }   

    render() {
       
        switch(this.state.view) {

            case("composer-list"):

                var view = this.state.genreSelected ?
                        <ComposerList 
                            albumList={this.props.library.genres[this.state.genreSelected].albums} 
                            playerInstance={this.props.playerInstance}
                            library={this.props.library}
                            checkPlayerInstance={this.props.checkPlayerInstance}
                            />
                        :
                        <div>Select a Genre</div>;
                        break;
                
            case('grid'):

                var view =  this.state.genreSelected ?
                                <AlbumGrid 
                                    screenWidth={this.props.screenWidth}
                                    library={this.props.library}
                                    
                                    /* List is from the pre-built library list for the selected genre */
                                    albumList={this.props.library.genres[this.state.genreSelected].albums}                                 
                                    genre={this.state.genreSelected} 
                                    clickHandler={this.handleAlbumChange}
                                    playerInstance={this.props.playerInstance}
                                    checkPlayerInstance={this.props.checkPlayerInstance}

                                />
                            :
                            <div>Select a Genre</div>
                break;
            
            case('bpm'):
                
                var view = <BPMView 
                            library={this.props.library}
                            playerInstance={this.props.playerInstance}
                            />
                break;

            case('search'):

                var view =  <SearchResults 
                                screenWidth={this.props.screenWidth}
                                library={this.props.library}
                                playerInstance={this.props.playerInstance}
                                searchResultsAlbums={this.state.searchResultsAlbums}
                                searchResultsTracks={this.state.searchResultsTracks}
                                searchResultsContributors={this.state.searchResultsContributors}
                                checkPlayerInstance={this.props.checkPlayerInstance}
                          />
        }
        

        return (
            
            <div className="test">
                <div className='genre-selector'>
                    {this.state.genresTable}
                </div> 
                
                <ViewSelector 
                    handleChange={this.handleViewChange.bind(this)} 
                    showDrawer={this.props.showDrawer}
                    searchFor={this.searchFor.bind(this)}
                />

                {view}
                <ScrollUpButton />
            
            </div>
        )
    }
}

class ViewSelector extends React.Component {
    render() {

        return (
            <div ><hr/>
                <Button onClick={() => this.props.handleChange('grid')}>Grid</Button>
                <Button onClick={() => this.props.handleChange('composer-list')}>Composer/Artist</Button>
                <Button onClick={() => this.props.handleChange('bpm')}>BPM</Button>
                <SearchBar searchFor={this.props.searchFor } />
                <hr/>
            </div>
            );
    }
}

export { GenreMenu }