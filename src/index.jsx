import * as React from "react";
import { render } from 'react-dom';
import { Player } from './Player';
import { GenreMenu } from './GenreMenu';
import './style.css';
import { LMSRequest } from './server';
import { PlayerControls } from './PlayerControls';
import { LMSLibrary } from './Library';
import Slider from '@material-ui/core/Slider';
import { BrowserPlayer } from './BrowserPlayer';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Album } from './Albums';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';

class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            serverStatus : null,
            targetPlayer : "",
            playerInstance : null,
            elapsedTime: 0,
            playerStatus : null,
            volume: 0,
            library : null,
            fullscreen: false,
            lastScrollTop :0,
            screenWidth: null,           
            drawer:false,
            drawerButton: true,
            drawerVariant : 'temporary',
        }

       this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {

        LMSRequest(["",["serverstatus", "0","20"]], (response) => {
           this.setState({serverStatus: response.result});

        });

        let statusCheck = setInterval( ()=> {

            if ( this.state.targetPlayer == 'browser') { 
                this.setState({
                    playerStatus: {
                        mode: this.state.playerInstance.playerInstance 
                            && this.state.playerInstance.playerInstance.playing() ? 'play' : 'pause',
                        playlist_loop: this.state.playerInstance.tracks,
                        playlist_cur_index : this.state.playerInstance.currentIndex,
                    }
                });
                return
            } 
            
            if ( this.state.targetPlayer != "") {
            
                LMSRequest([this.state.targetPlayer,[ "status","0","100","tags:duration,time,mode, **playlist index**, **l**,**J**"]], (r) => { 
                    this.setState({
                        playerStatus: r.result,
                        volume: r.result["mixer volume"]
                    });
                });
            }
        }, 2500);

        this.setState({library : new LMSLibrary() });
        window.addEventListener('resize', this.updateWindowDimensions );
        this.updateWindowDimensions();
            
    }

    updateWindowDimensions() {
        this.setState({ 
            screenWidth: screen.width,
            drawerVariant : screen.width > 320 ? 'permanent' : 'temporary',
        });
      }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
    }

    scrollFunction() {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        }
      }

    switchPlayer(e) {

        if (e.target.value != 'browser') {
            var newPlayer = new Player(e.target.value);
        } else {
            var newPlayer = new BrowserPlayer(this.state.serverStatus.players_loop[0].playerid);
        }
        this.setState({
            targetPlayer: e.target.value,
            playerInstance : newPlayer,
        });
        const playerChanged = new Event('playerChanged');
       
    }
    
    checkPlayerInstance(callback) {

        if (! this.state.playerInstance) {
            this.setState({drawer: true });
            this.waitForPlayerInstance(callback);
        } else {
            callback();
        }
    }

    waitForPlayerInstance(callback) {  
        setTimeout( () => {
            if ( ! this.state.drawer )  { return }
            if ( this.state.playerInstance) {
               callback();
            } else {
                this.waitForPlayerInstance(callback);
            }
        }, 500);
    }

    handleSeekChange (event, newValue)  {
        this.state.playerInstance.seek( this.state.playerStatus.duration * newValue / 100 );
        this.setState({seek:newValue})
    }

    handleVolumeChange (event, newValue ) {
        this.setState({volume:newValue});
        this.state.playerInstance.setVolume( newValue );
    }

    toggleDrawer (anchor, open) {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        this.setState({drawer: open, drawerButton: !open });
      };
    
   

    render ()  {      
        return (
            <div>
                 <meta name="viewport" content="width=device-width,initial-scale=1"></meta>
                        { this.state.serverStatus ?
                            <div>
                                <SwipeableDrawer
                                    disableSwipeToOpen={false}
                                    anchor={'top'}
                                    open={this.state.drawer}
                                    onClose={() => this.toggleDrawer('top',false)}
                                    onOpen={() => this.toggleDrawer('top',true)}
                                >
                                                                
                                    <link
                                        rel="stylesheet"
                                        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                                        />
                                    <div className="control-bar">
                                        <div className="control-content">
                                                
                                                <div className="player-controls">
                                                    <PlayerControls 
                                                        playerStatus={this.state.playerStatus}
                                                        player={this.state.playerInstance}
                                                        serverStatus={this.state.serverStatus}
                                                        targetPlayer={this.state.targetPlayer}
                                                        volume={this.state.volume }
                                                        switchPlayer={this.switchPlayer.bind(this)}
                                                        handleVolumeChange = {this.handleVolumeChange.bind(this)}
                                                    />
                                                </div>
                                        
                                            { this.state.playerStatus && this.state.playerStatus.playlist_loop && this.state.playerStatus.playlist_loop[parseInt(this.state.playerStatus.playlist_cur_index)] ? 
                                                <div className="now-playing">
                                                    <div className="now-playing-meta">
                                                       <div className="now-playing-artist">{this.state.playerStatus.playlist_loop[parseInt(this.state.playerStatus.playlist_cur_index)].artist}</div> 
                                                        <div className="now-playing-album-title">{this.state.playerStatus.playlist_loop[parseInt(this.state.playerStatus.playlist_cur_index)].album}</div>
                                                        <div className="now-playing-track-name">{this.state.playerStatus.playlist_loop[parseInt(this.state.playerStatus.playlist_cur_index)].tracknum}. {this.state.playerStatus.playlist_loop[parseInt(this.state.playerStatus.playlist_cur_index)].title}</div>
                                                        <Slider 
                                                            value={ Math.floor(this.state.playerStatus.time / this.state.playerStatus.duration * 100) } 
                                                            onChange={this.handleSeekChange.bind(this)} />

                                                    </div>

                                                    <div className="now-playing-album-cover">
                                                        <Album
                                                            id={this.state.playerStatus.playlist_loop[parseInt(this.state.playerStatus.playlist_cur_index)].album_id}
                                                            art={this.state.playerStatus.playlist_loop[parseInt(this.state.playerStatus.playlist_cur_index)].artwork_track_id}
                                                            library={this.state.library}
                                                            modal={true}
                                                            playerInstance={this.state.playerInstance}
                                                            checkPlayerInstance={this.checkPlayerInstance.bind(this)}
                                                        />
                                                    </div>   
                                                </div>
                                                : <div></div>
                                            }
                                                    
                                        </div>    
                                    </div>
                                </SwipeableDrawer>   
                                
                                    { this.state.library.genres ?
                                        <div className="the-rest">
                                            <GenreMenu 
                                                screenWidth={this.state.screenWidth}
                                                playerInstance={this.state.playerInstance}
                                                library={this.state.library} 
                                                checkPlayerInstance={this.checkPlayerInstance.bind(this)}
                                            />
                                        </div>
                                    : <div></div>
                                    }
                                { this.state.drawerButton ?
                                    <Button onClick={ () => { this.toggleDrawer('top', true)} } className="drawer-button">
                                       <img className={"btn-icon"} src={"./html/52558-200.png"}/>
                                    </Button>
                                    :
                                    <div></div>
                              }   
                                </div> 

                        :
                        <div className="loading-message"> 
                            <CircularProgress />
                            <div className="loading-text"></div>
                        </div>
                        }                       

                </div>  
        );
    }
}

render ( 
    <App />,
    document.getElementById('target')
);
