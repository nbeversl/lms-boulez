import Card from 'react-bootstrap/Card';
import React from 'react';
import { TrackList , TrackListScrolling } from './Tracks.js';
import Grid from '@material-ui/core/Grid';
import FlipCard from 'react-png-flipcard';
import Modal from '@material-ui/core/Modal';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
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
                            />
                            <TrackList 
                                playerInstance={this.props.playerInstance} 
                                albumID={this.props.list[id].id}
                                library={this.props.library}
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
            tracks : [],
            flipped : false,
            modalOpen : false,
            dimensions : 300,
            modalOpen : false,
        }; 
    }

    getMyTracks() {
        this.props.library.getAlbumTracks(this.props.id, (result) => {
            this.setState({
                tracks: result,
            });
            this.setState({flipped : true, modalOpen: true});
        });
    }
    
    handleMouseLeave() {
        this.setState({ flipped : false  });
    }
    handleOpen() {
        this.setState({modalOpen : true});
        this.getMyTracks();
    }
    handleClose() {
        this.setState({modalOpen : false});
    }
    render() {   
        
        var modalStyle = {
            position: 'inherit',
            width: "100%",
            height:600,
            backgroundColor: 'white',
            border: '2px solid #000',
            //boxShadow: theme.shadows[5],
            //padding: theme.spacing(2, 4, 3),
        }
        var buttonStyle = {
            width: this.props.albumWidth,
            height: this.props.albumWidth,
        }
        return (
            <div>
                { this.props.screenWidth > 600 && this.props.modal != true ? 
                    <div className="album-cover" onMouseLeave={this.handleMouseLeave.bind(this)} >
                        <FlipCard  
                            width={this.props.albumWidth}
                            height={this.props.albumWidth} // keep square
                            flip={this.state.flipped} 
                            manual={true} 
                            key={this.props.id}
                            value={this.props.name} 
                            front = {   
                                <div onClick={this.getMyTracks.bind(this)} >
                                    <img
                                        src={"/music/"+this.props.art+"/cover.jpg"}
                                        className={"album-image"}
                                    />                 
                                </div>
                            }
                            back = { 
                                this.state.tracks ?
                                    <TrackListScrolling             
                                            playerInstance={this.props.playerInstance} 
                                            tracks = {this.state.tracks}
                                            album = {this.props.id}
                                        /> 
                                :
                                <div>hang on ...</div>
                            } >
                        </FlipCard>

                    </div>
                :
                    <div style={buttonStyle}>                    
                        <Button onClick={this.handleOpen.bind(this)}>
                            <img
                                src={"/music/"+this.props.art+"/cover.jpg"}
                                className={"album-image"}
                            />    
                        </Button>
                        <Modal
                            open={this.state.modalOpen}
                        ><div>
                            <div style={modalStyle} >
                            { this.state.tracks ?
                                <div> 
                                    <div>
                                        <Button onClick={this.handleClose.bind(this)}>
                                            Close
                                        </Button>
                                    </div>
                                    <TrackListScrolling             
                                        playerInstance={this.props.playerInstance} 
                                        tracks = {this.state.tracks}
                                        album = {this.props.id}
                                    /> 
                                </div>
                                :
                                <div>hang on ...</div>
                            }
                            </div>
                            </div>
                        </Modal>
                </div>
                }
            </div>
        )
    }
}


class AlbumGrid extends React.Component {
    constructor(props) {
        super(props)
        console.log(this.props.screenWidth);
        this.state = {
            albumWidth: this.props.screenWidth > 600 ? 300 : 90,
        }
     }
    
    adjustWidth(event, newValue) {
        this.setState({albumWidth : newValue })
    }

    render() {
       
        let List = [];
        this.props.albumList.forEach( (album) =>

            { List.push(
                <Grid item  key={album.id}>
                    <Album  
                        screenWidth={this.props.screenWidth}
                        albumWidth={this.state.albumWidth}
                        name={album.album} 
                        id={album.id}
                        art={album.artwork_track_id}
                        library={this.props.library}
                        playerInstance={this.props.playerInstance}
                        />
                </Grid>
            )});
        return (
            <div>
                <Slider min={40} max={300} defaultValue={this.state.albumWidth}  onChange={this.adjustWidth.bind(this)} />
                
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