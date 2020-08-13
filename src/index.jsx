import * as React from "react";
import { render } from 'react-dom';
import { Player } from './Player';
import { GenreMenu } from './GenreMenu';
import './style.css';
import { LMSRequest } from './server';
import { PlayerControls } from './PlayerControls';
import { LMSLibrary } from './Library';
import { BrowserPlayer } from './BrowserPlayer';
import CircularProgress from '@material-ui/core/CircularProgress';
import NowPlaying from './NowPlaying';
import ServerContext from './ServerContext';

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

        var l = new LMSLibrary();
        l.establishLibrary( (library) => {
            this.setState({library : library});
        })
 
        window.addEventListener('resize', this.updateWindowDimensions );
        this.updateWindowDimensions();
            
    }

    updateWindowDimensions() {
        this.setState({ 
            screenWidth: screen.width,
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
    }
    
    checkPlayerInstance(callback) {
        if (! this.state.playerInstance) {
            this.waitForPlayerInstance(callback);
        } else {
            callback(this.state.playerInstance);

        }
    }

    waitForPlayerInstance(callback) {  
        setTimeout( () => {
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
    
    render ()  {      
        var globals = {
            currentPlayer: this.state.targetPlayer,
            playerInstance: this.state.playerInstance,
            library: this.state.library,
            serverStatus: this.state.serverStatus,
            playerStatus : this.state.playerStatus,
        }
        return (
            <ServerContext.Provider value={globals}>
                <div>
                    <meta name="viewport" content="width=device-width,initial-scale=1"></meta>
                        { this.state.serverStatus && this.state.library ?
                            <div>
                                 <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"/>
                                <div className="control-bar">
                                    <div className="control-content">                                        
                                        <PlayerControls 
                                            targetPlayer={this.state.targetPlayer}
                                            volume={this.state.volume}
                                            switchPlayer={this.switchPlayer.bind(this)}
                                            handleVolumeChange = {this.handleVolumeChange.bind(this)} />
                                        
                                        <NowPlaying
                                            checkPlayerInstance={this.checkPlayerInstance.bind(this)} 
                                            handleSeekChange={this.handleSeekChange.bind(this)}/>
                                    </div>    
                                </div>
                                { this.state.library.genres ?
                                    <div className="the-rest">
                                        <GenreMenu 
                                            genres={this.state.library.genres}
                                            library={this.state.library}
                                            screenWidth={this.state.screenWidth}
                                            checkPlayerInstance={this.checkPlayerInstance.bind(this)}
                                        />
                                    </div>
                                    : <div></div>
                                }
                            </div> 

                        :
                        <div className="loading-message"> 
                            <CircularProgress />
                        </div>
                        }                      
                    </div> 
            </ServerContext.Provider>
        );
    }
}
render ( 
    <App />,
    document.getElementById('target')
);
