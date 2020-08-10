import * as React from "react";
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Zoom from '@material-ui/core/Zoom';
import TrackListScrolling from './TrackListScrolling'


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
                        { this.props.art ?
                            <img
                                src={"/music/"+this.props.art+"/cover.jpg"}
                                className={"album-image"}
                            />
                            :
                            <div>
                               {this.props.name}
                                <img 
                                    src={"/music/undefined/cover.jpg"}
                                    className={"album-image"}
                                />
                            </div>
                        }
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

export default Album