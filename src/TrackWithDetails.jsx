import * as React from "react";
import Button from '@material-ui/core/Button';
import './style.css';

class TrackWithDetails extends React.Component {

    render() {
     
        return (
            <div>                       
                <span className="track-title"> 
                    {this.props.track.tracknum}: {this.props.track.title}
                </span> 
                <div className="codec">
                    { this.props.track.type == 'flc' ? 'FLAC'
                        : this.props.track.type }                            
                </div>
                <Button 
                    onClick={ () => {  console.log( this.props.track.serverID);
                        this.props.playTrack(this.props.disc, this.props.track.serverID) } } >Play
                </Button>
                <a href={"/music/"+this.props.track.id+"/download/"}>↓</a>
            </div>

        )
    }
}

export default TrackWithDetails;