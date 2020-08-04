import Card from 'react-bootstrap/Card';
import * as React from "react";
import { TrackList , TrackListScrolling } from './Tracks';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import Zoom from '@material-ui/core/Zoom';

class AlbumList extends React.Component {
    
    render() {
  
        let List = [];
        Object.keys(this.props.list).forEach( (id) =>
            { List.push(
                <Card key={this.props.list[id].id}>        
                        <Card.Body>
                             <Album 
                                name={this.props.list[id].album} 
                                id={this.props.list[id].id}
                                clickHandler={this.props.clickHandler}
                                art={this.props.list[id].artwork_track_id}
                                checkPlayerInstance={this.props.checkPlayerInstance}
                            />
                            <TrackList 
                                playerInstance={this.props.playerInstance} 
                                albumID={this.props.list[id].id}
                                library={this.props.library}
                                checkPlayerInstance={this.props.checkPlayerInstance}
                            />
                        </Card.Body>
                              
                </Card>
            )});
        return (
            <div>
            
                {List}
            </div>
        )
    }
}

class Album extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            discs : null,
            flipped : false,
            modalOpen : false,
            dimensions : 300,
        };
    }
    getMyTracks() {
        this.props.library.getAlbumTracks(this.props.id, (result) => {
            var discs = {};
            result.forEach( (track) => {
                var disc = track.disc;
                if (! disc ) {
                    disc = "1";
                }
                if (! Object.keys(discs).includes(disc)) {
                    discs[disc] = [] 
                } 
                discs[disc].push(track);
            });
            this.setState({
                discs: discs,
            });
            this.setState({flipped : true, modalOpen: true});
        });
    }
    handleMouseLeave() {
        this.setState({ flipped : false  });
    }
    handleOpen() {        
        this.getMyTracks();
        this.setState({modalOpen : true});
    }
    handleClose() {
        this.setState({modalOpen : false});
    }

    render() {   

        var modalStyle = {
            width: "600px",
            height:600,
            backgroundColor: 'white',
        }
        var backgroundImageStyle = {
            WebkitFilter: 'blur(10px) saturate(2) opacity(.3)',
            filter:'blur(10px) saturate(2) opacity(.3)',
            background: 'url("/music/'+this.props.art+'/cover.jpg")',
        }
        var buttonStyle = {
            width: this.props.albumWidth,
            height: this.props.albumWidth,
        }
        return (
            <div className="album">

                <div style={buttonStyle}>                    
                    <Button onClick={this.handleOpen.bind(this)}>
                        <img
                            src={"/music/"+this.props.art+"/cover.jpg"}
                            className={"album-image"}
                        />    
                    </Button>
                        <Dialog
                            TransitionComponent={Zoom}
                            open={this.state.modalOpen}
                            onBackdropClick= {this.handleClose.bind(this)} >
                            <div style={modalStyle} >
                                { this.state.discs ?
                                    <div>
                                        <div> 
                                            <TrackListScrolling      
                                                playerInstance={this.props.playerInstance} 
                                                discs = {this.state.discs}
                                                album = {this.props.id}
                                                checkPlayerInstance={this.props.checkPlayerInstance}x
                                            />
                                        </div>
                                        <div className={"album-background-image-wrapper"}>
                                            <div className={"album-background-image"} style={ backgroundImageStyle } />    
                                        </div>
                                    </div>                                        
                                    :
                                    <div>hang on ...</div>
                                }                                
                            </div>
                        </Dialog>
                </div>
            </div>
        )
    }
}


class AlbumGrid extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            albumWidth: this.props.screenWidth > 600 ? 300 : 90,
        }
     }
    
    adjustWidth(event, newValue) {
        this.setState({albumWidth : newValue })
    }

   
    render() {
        let List = [];

        var albums = this.props.albumList || [];
        albums.forEach( (album) =>
                { 
                List.push(

                    <Grid item  key={album.id}>
                        <Album  
                            screenWidth={this.props.screenWidth}
                            albumWidth={this.state.albumWidth}
                            name={album.album} 
                            id={album.id}
                            art={album.artwork_track_id}
                            library={this.props.library}
                            playerInstance={this.props.playerInstance}
                            checkPlayerInstance={this.props.checkPlayerInstance}
                        />
                    </Grid>
                )});
        return (
            <div>
                <a name="albums"></a><h2>Albums</h2>
                <Slider min={40} max={300} defaultValue={this.props.screenWidth > 600 ? 300 : 90}  onChange={this.adjustWidth.bind(this)} />
                
                <Grid 
                    container 
                    spacing={this.props.screenWidth > 600 ? 3 : 1 }
                    >
                
                    {List}
                </Grid>
            </div>
        )
    }


}
export {Album, AlbumList, AlbumGrid } 