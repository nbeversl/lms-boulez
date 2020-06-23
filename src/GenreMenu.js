import React from 'react';
import Button from '@material-ui/core/Button';
import { ComposerList } from './Classical.js';
import { AlbumGrid }  from './Albums.js';
import { BPMView } from './views.js';


class GenreMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            genres : {},
            genreSelected :0,
            trackList : [],
            albumSelected : null,
            albumSelectedID : null,
            view : 'grid',
        }
        this.handleAlbumChange = this.handleAlbumChange.bind(this);
    }

    handleGenreChange(e) {
        this.setState({genreSelected: e.currentTarget.value});
        this.props.library.getAllTitlesforGenre( this.props.library.genres[e.currentTarget.value].id);
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

   

    render() {

        let genresTable = [];
        Object.keys(this.props.library.genres).forEach( (genreName) => { 
            genresTable.push(
                <Button   
                    className={"genre-choice"}  
                    key={genreName}
                    value={genreName} 
                    onClick={this.handleGenreChange.bind(this)} 
                >
                    {genreName}
                </Button>
        )});
            
        if ( this.state.genreSelected && this.state.genres ) {
           
            switch(this.state.view) {

                case("composer-list"):
                    var view = <ComposerList 
                        albumList={this.props.library.genres[this.state.genreSelected].albums} 
                        playerInstance={this.props.playerInstance}
                        library={this.props.library}
                        />;
                    break;
                    
                case('grid'):

                    var view =  <AlbumGrid 
                                    screenWidth={this.props.screenWidth}
                                    library={this.props.library}
                                    albumList={this.props.library.genres[this.state.genreSelected].albums}                 
                                    genre={this.state.genreSelected} 
                                    clickHandler={this.handleAlbumChange}
                                    playerInstance={this.props.playerInstance}
                                />
                    break;
                
                case('bpm'):
                   
                    var view = <BPMView 
                                library={this.props.library}
                                playerInstance={this.props.playerInstance}
                                />
                    break;
            }                       
        
        }
        return (
            <div>
                <div className='genre-selector'>
                    {genresTable}
                </div> 
                <ViewSelector handleChange={this.handleViewChange.bind(this)} />
                 { this.state.genreSelected ? view : <div></div> }
              
            </div>
        )
    }
}

class ViewSelector extends React.Component {
    render() {

        return (
            <div><hr/>
                <Button onClick={() => this.props.handleChange('grid')}>Album Grid</Button>
                <Button onClick={() => this.props.handleChange('composer-list')}>Composer List</Button>
                <Button onClick={() => this.props.handleChange('bpm')}>BPM</Button>
                <hr/>
            </div>
            );
    }
}

export { GenreMenu }