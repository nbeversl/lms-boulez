import * as React from "react";
import './style.css';
import Slider from '@material-ui/core/Slider';
import Album from './Album';

class NowPlaying extends React.Component {
    
    render() {

        var playingTrack = parseInt(this.props.playerStatus.playlist_cur_index);

        return( 
            <div>
            
                {   this.props.playerStatus 
                    && this.props.playerStatus.playlist_loop 
                    && this.props.playerStatus.playlist_loop[playingTrack] ? 
                    <div>
                        <div className="now-playing">
                            
                            <div className="now-playing-meta">
                                <div className="now-playing-artist">{this.props.playerStatus.playlist_loop[playingTrack].artist}</div> 
                                <div className="now-playing-album-title">{this.props.playerStatus.playlist_loop[playingTrack].album}</div>
                                <div className="now-playing-track-name">{
                                        this.props.playerStatus.playlist_loop[playingTrack].tracknum}. 
                                        {this.props.playerStatus.playlist_loop[playingTrack].title}
                                </div>
                                <Slider 
                                    value={ Math.floor(this.props.playerStatus.time / this.props.playerStatus.duration * 100) } 
                                    onChange={this.handleSeekChange} />
                            </div>

                            <div className="now-playing-album-cover">
                                <Album
                                    id={this.props.playerStatus.playlist_loop[playingTrack].album_id}
                                    art={this.props.playerStatus.playlist_loop[playingTrack].artwork_track_id}
                                    library={this.props.library}
                                    modal={true}
                                    playerInstance={this.props.playerInstance}
                                    checkPlayerInstance={this.checkPlayerInstance}
                                />
                            </div>   
                        </div>
                    </div>
                : 
                <div></div>
                }
            </div>
        );
    }
}

export default NowPlaying;