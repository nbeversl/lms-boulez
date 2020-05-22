import React from 'react';
import Button from '@material-ui/core/Button';
import { ComposerList } from './Classical.js';
import { AlbumList }  from './Albums.js';
import { TrackList } from './Tracks.js';
import { LMSRequest } from './server.js';

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
    
    playSelf () {
        this.props.playerInstance.playAlbum(this.state.albumSelected );
    }

    play() {
        this.props.playerInstance.play();
    }

    componentDidMount() {

        LMSRequest(["78:7b:8a:bf:cf:ad",["genres", "0", "1000"]], (r) => {
            this.setState({genres:r.result.genres_loop})
        });
          
    }

    handleGenreChange(e) {
        this.setState({genreSelected: e.currentTarget.value});
        var selectedGenre = this.state.genres[e.currentTarget.value].id;
        LMSRequest(["78:7b:8a:bf:cf:ad",["albums", "0","1000","genre_id:"+ selectedGenre.toString(),"tags:ljaS" ]], (r) => {
            this.setState({albums: r.result.albums_loop || [] })
          
        });
    }
    handleAlbumChange(id, name) {

        LMSRequest(["78:7b:8a:bf:cf:ad",["titles","0","100","album_id:"+id]],(r) => {

            this.setState({trackList:r.result.titles_loop})
            this.setState({albumSelected : name }); 
            this.setState({albumSelectedID : id });
        });
        
    }
    render() {
        let Table = [];
        Object.keys(this.state.genres).forEach( (index) => { 
            Table.push(
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
                        />;
        } else {
            var view =  <AlbumList 
                            genre={this.state.genreSelected} 
                            list={this.state.albums} 
                            clickHandler={this.handleAlbumChange}
                            playerInstance={this.props.playerInstance} 
                            />
        }
        return (
            <div>
                {Table}
                
                <hr></hr>
                    {view}
                    <hr></hr>
                <TrackList 
                    albumID={this.state.albumSelectedID}
                    playerInstance={this.props.playerInstance} 
                    playSelf={this.playSelf.bind(this)}
                />
            </div>
        )
    }
}

export { GenreMenu }