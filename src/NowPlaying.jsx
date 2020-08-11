import * as React from "react";
import './style.css';
import Slider from '@material-ui/core/Slider';
import Album from './Album';
import ServerContext from './ServerContext';

class NowPlaying extends React.Component {
    
    render() {
        return( 
            <ServerContext.Consumer>

                { ({ serverStatus, playerStatus, playerInstance, library } )  => (
                    <div>
                        {   playerStatus 
                            && playerStatus.playlist_loop 
                            && playerStatus.playlist_loop[parseInt(playerStatus.playlist_cur_index)] ? 
                            <div>
                                <div className="now-playing">
                                    
                                    <div className="now-playing-meta">
                                        <div className="now-playing-artist">{playerStatus.playlist_loop[parseInt(playerStatus.playlist_cur_index)].artist}</div> 
                                        <div className="now-playing-album-title">{playerStatus.playlist_loop[parseInt(playerStatus.playlist_cur_index)].album}</div>
                                        <div className="now-playing-track-name">{
                                                playerStatus.playlist_loop[parseInt(playerStatus.playlist_cur_index)].tracknum}. 
                                                {playerStatus.playlist_loop[parseInt(playerStatus.playlist_cur_index)].title}
                                        </div>
                                        <Slider 
                                            value={ Math.floor(playerStatus.time / playerStatus.duration * 100) } 
                                            onChange={this.props.handleSeekChange} />
                                    </div>

                                    <div className="now-playing-album-cover">
                                        <Album
                                            album={library.albums[playerStatus.playlist_loop[parseInt(playerStatus.playlist_cur_index)].album_id]}
                                            modal={true}
                                            checkPlayerInstance={this.checkPlayerInstance}
                                        />
                                    </div>   
                                </div>
                            </div>
                        : 
                        <div></div>
                        }
                    </div>
                )}

            </ServerContext.Consumer>
        );
    }
}

export default NowPlaying;