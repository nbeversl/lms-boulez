import React from 'react';
import Button from '@material-ui/core/Button';
import { ComposerList } from './Classical.js';
import { AlbumList, AlbumGrid }  from './Albums.js';
import { TrackList } from './Tracks.js';

class GenreMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            genres : {},
            genreSelected :0,
            albums: [],
            trackList : [],
            albumSelected : null,
            albumSelectedID : null,
        }
        this.handleAlbumChange = this.handleAlbumChange.bind(this);
    }

    componentDidMount() {
        this.props.playerInstance.getGenres( 
            (result) => {
                this.setState({genres: result});
        });
        
    }

    handleGenreChange(e) {
     
        this.setState({genreSelected: e.currentTarget.value});
        var selectedGenre = this.state.genres[e.currentTarget.value].id;
        this.props.playerInstance.getAlbumsInGenre( selectedGenre, 
            (result) => {
                this.setState({albums: result })            
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

    render() {

        let genresTable = [];
        Object.keys(this.state.genres).forEach( (index) => { 
            genresTable.push(
                <Button     
                    value={index} 
                    onClick={this.handleGenreChange.bind(this)} 
                    >
                    {this.state.genres[index].genre}
                </Button>
        )});
     
        if (Object.keys(this.state.genres).length  && this.state.genres[this.state.genreSelected].genre == "Classical") {
            var view = <ComposerList 
                            albumList={this.state.albums} 
                            playerInstance={this.props.playerInstance}
                        />;
        } else {
            var view =  <AlbumGrid 
                            playerInstance={this.props.playerInstance}
                            genre={this.state.genreSelected} 
                            list={this.state.albums} 
                            clickHandler={this.handleAlbumChange}
                        />
        }
        return (
            <div>
                <div className='genre-selector'>
                    {genresTable}
                </div>
                {view}
                <TrackList 
                    albumID={this.state.albumSelectedID}
                    playerInstance={this.props.playerInstance} 
                />
            </div>
        )
    }
}

export { GenreMenu }