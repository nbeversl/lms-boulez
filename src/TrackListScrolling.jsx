import * as React from "react";
import { Scrollbars } from 'react-custom-scrollbars';
import './style.css';
import TrackWithDetails from './TrackWithDetails';

class TrackListScrolling extends React.Component {
  
   playTrack(disc, trackNumber) {
        var that = this;
        this.props.checkPlayerInstance( (playerInstance) => {
            console.log(playerInstance);
            playerInstance.playAlbumFromTrackAndContinue(
                that.props.discs[disc][0], // disc doesn't matter, only passes the album ID 
                trackNumber)    
        });
    }

    render() {
        
        const tracklistStyle = {
            width: "100%",
            position:'absolute',
            zIndex:"100",
        }   
        var numDiscs = Object.keys(this.props.discs);
        let List = [];  
        var serverID = 0;
        numDiscs.forEach( (disc) => { 
               
                if ( numDiscs.length > 1 ) {
                    List.push(<div 
                            className={"disc-number"} 
                            key={"DISC-"+disc.toString()}>
                                <hr></hr>DISC {disc}
                            </div>);
                }
                this.props.discs[disc].forEach( (track) =>
                    { 
                        var trackNumber = track.tracknum;
                        track.serverID = serverID;
                        List.push( 
                            <TrackWithDetails 
                                    key={disc.toString()+'-'+trackNumber}
                                    discs={this.props.discs}
                                    disc={disc}
                                    track={track}
                                    trackNumber={trackNumber}
                                    serverID={serverID}
                                    playTrack={this.playTrack.bind(this)}
                                />
                        );
                    serverID++;
                    });
            });

        return (
            <div>
            { this.props.discs ? 
                <Scrollbars 
                    style={tracklistStyle}> 
                    <div className="grid-tracklist">
                        {List}
                    </div>
                </Scrollbars>
                :
                <div> Loading </div>
                }
            </div>
        )
    }
}

export default TrackListScrolling;