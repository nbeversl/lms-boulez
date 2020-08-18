import * as React from "react";
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Zoom from '@material-ui/core/Zoom';
import TrackListScrolling from './TrackListScrolling'
import ServerContext from "./ServerContext";
import { useContext } from 'react';

function Album (props) {
    const globals = useContext(ServerContext);

    return <AlbumKnowingAboutLibrary 
                library = {globals.library}
                album={props.album}
                fromAlbumID={props.fromAlbumID}
                albumWidth={props.albumWidth}
                screenWidth={props.screenWidth}
                tempArt={props.tempArt}
                checkPlayerInstance={globals.checkPlayerInstance}
            />;
}

class AlbumKnowingAboutLibrary extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            discs : null,
            flipped : false,
            modalOpen : false,
            dimensions : 300,
            id : null,
            album: null,
        }
    }

    componentDidMount () {

        if ( ! this.props.album) {
            this.props.library.getAlbumFromID(this.props.fromAlbumID, (album) => {
                this.setState({ album:album });
            });  
        } else {
            this.setState({ album : this.props.album });
        }       
        
    }

    getMyTracks() {
        
        this.props.library.getAlbumTracks( this.state.album.id, (result) => {
            console.log(result);
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

    handleOpen(library) {        
        this.getMyTracks(library);
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
            //background: this.state.album ? 'url("/music/'+this.state.album.artwork_track_id+'/cover.jpg")' : '',
            background: this.state.album ? 'url("/music/'+this.props.tempArt+'/cover.jpg")' : '',
        }
        var buttonStyle = {
            width: this.props.albumWidth,
            height: this.props.albumWidth,
        }
        
        return (
            <ServerContext.Consumer>
                { ( { playerInstance, library, checkPlayerInstance } )  => (

                    <div className="album">
                        { this.state.album ? 
                            <div style={buttonStyle}>                    
                                <Button onClick={() => { this.handleOpen(library) }}>
                                <div>
                                    { this.state.album.artwork_track_id == undefined ? 
                                        <div className="album-title-text">{this.state.album.album}</div>
                                        :
                                        <div></div>                            
                                    }
                                        <img
                                            src={"/music/"+this.state.album.artwork_track_id+"/cover.jpg"}
                                            className={"album-image"}
                                        />
                                </div>
                                </Button>
                                <Dialog
                                    TransitionComponent={Zoom}
                                    open={this.state.modalOpen}
                                    onBackdropClick= {this.handleClose.bind(this)} >
                                    <div style={modalStyle} >
                                        { this.state.discs ?
                                            <div>
                                                <TrackListScrolling      
                                                    playerInstance={playerInstance} 
                                                    discs = {this.state.discs}
                                                    album = {this.state.id}
                                                    checkPlayerInstance={checkPlayerInstance}
                                                />
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
                        :<div></div>    
                    }
                    </div>
                )}
            
            </ServerContext.Consumer> 
         
    )}
}
export default Album;