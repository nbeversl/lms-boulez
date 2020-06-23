import React from 'react';
import { render } from 'react-dom';
import { Player } from './Player.js';
import { GenreMenu } from './GenreMenu.js';
import './style.css';
import { LMSRequest } from './server.js';
import { PlayerControls } from './PlayerControls.js';
import { LMSLibrary } from './Library.js';
import Slider from '@material-ui/core/Slider';
import { Yamaha } from './Yamaha.js';
import { BrowserPlayer } from './BrowserPlayer.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Album } from './Albums.js';
import ScrollUpButton from "react-scroll-up-button";
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
            screenWidth: 500,           
            drawer:true,
            drawerVariant : 'permanent',
        }

       this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {

        this.updateWindowDimensions();

        LMSRequest(["",["serverstatus", "0","20"]], (response) => {
            //this.setState({playerInstance: new Player( response.result.players_loop[0].playerid) });
            //this.setState({targetPlayer: response.result.players_loop[0].playerid});
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
            
                LMSRequest([this.state.targetPlayer,[ "status","0","10","tags:duration,time,mode, **playlist index**, **l**,**J**"]], (r) => { 
                    this.setState({
                        playerStatus: r.result,
                        volume: r.result["mixer volume"]
                    });
                });
            }

            
        }, 5000);

        this.setState({library : new LMSLibrary() });
        
        // window.addEventListener("scroll", () => { 
        //     var st = window.pageYOffset || document.documentElement.scrollTop;
        //     var cover = document.getElementsByClassName("now-playing-album-cover");
        //     if (st > this.state.lastScrollTop){
        //         document.getElementsByClassName("now-playing")[0].style.opacity = "0";
        //     } else {
        //         document.getElementsByClassName("now-playing")[0].style.opacity = "1";
        //     }
        //     this.setState({lastScrollTop : st <= 0 ? 0 : st}); // For Mobile or negative scrolling
        //     }, false);

        window.addEventListener('resize', this.updateWindowDimensions );
            
    }

    updateWindowDimensions() {
    
        this.setState({ 
            screenWidth: window.innerWidth,
            drawerVariant : window.innerWidth > 600 ? 'permanent' : 'temporary',
        });
      }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
    }

    scrollFunction() {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        } else {
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
        console.log('asdfasdfasd');
        this.setState({drawer: open });
      };

    render ()  {
          
        return (
            this.state.serverStatus ?
                <div>
                    <SwipeableDrawer
                        disableSwipeToOpen={false}
                        anchor={'top'}
                        open={this.state.drawer}
                        onClose={() => this.toggleDrawer('top',false)}
                        onOpen={() => this.toggleDrawer('top',true)}
                    >
                        {/* https://stackoverflow.com/questions/45025397/media-query-not-working-in-react  */}
                        <meta name="viewport" content="width=device-width,initial-scale=1"></meta>
                        <link
                            rel="stylesheet"
                            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                            integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
                            crossorigin="anonymous"
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
                            
                                { this.state.playerStatus && this.state.playerStatus.player_name == "Den" ? 
                                    <YamahaStereo />
                                    :
                                    <div></div>
                                }
                            
                                { this.state.playerStatus && this.state.playerStatus.playlist_loop  && this.state.playerStatus.playlist_loop[this.state.playerStatus.playlist_cur_index] ? 
                                    <div className="now-playing">
                                        <div className="now-playing-meta">
                                            <div className="now-playing-artist">{this.state.playerStatus.playlist_loop[this.state.playerStatus.playlist_cur_index].artist}</div>
                                            <div className="now-playing-album-title">{this.state.playerStatus.playlist_loop[this.state.playerStatus.playlist_cur_index].album}</div>
                                            <div className="now-playing-track-name">{this.state.playerStatus.playlist_loop[this.state.playerStatus.playlist_cur_index].tracknum}. {this.state.playerStatus.playlist_loop[this.state.playerStatus.playlist_cur_index].title}</div>
                                            <Slider 
                                                value={ Math.floor(this.state.playerStatus.time / this.state.playerStatus.duration * 100) } 
                                                onChange={this.handleSeekChange.bind(this)} />

                                        </div>

                                        <div className="now-playing-album-cover">
                                            <Album
                                            id={this.state.playerStatus.playlist_loop[this.state.playerStatus.playlist_cur_index].album_id}
                                            art={this.state.playerStatus.playlist_loop[this.state.playerStatus.playlist_cur_index].artwork_track_id}
                                            library={this.state.library}
                                            modal={true}
                                            playerInstance={this.state.playerInstance}
                                            />
                                        </div>   
                                    </div>
                                    : <div></div>
                                }
                                        
                            </div>    
                        </div>
                    </SwipeableDrawer>   

                    {/* <ScrollUpButton /> */}
                    
                    <div className="the-rest">
                        <GenreMenu 
                            screenWidth={this.state.screenWidth}
                            playerInstance={this.state.playerInstance}
                            library={this.state.library} />
                    </div>
                          
                </div>
                     
            :
            <div className="loading-message"> 
                <CircularProgress />
                <div className="loading-text"> Loading the highest quality, most organized music library in the world...</div>
             </div>
        );
    }
}

class YamahaStereo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            instance: new Yamaha(),
        }
    }

    setInput(input) {
        this.state.instance.setInput(input);
    }
    render() {
       
        return (    
            <div>
                {   this.state.instance.ready ?
                    <div>
                      Volume Control Here
                      
                    </div>
                    :
                    <div></div>
                }

            </div>
        )    
    }
}

render ( 
    <App />,
    document.getElementById('target')
);
