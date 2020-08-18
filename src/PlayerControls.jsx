import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import ServerContext from './ServerContext';
import Typography from '@material-ui/core/Typography';

class PlayerControls extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            volume: 100,
            nowPlayingShowing: false,
        }
    }
    toggleNowPlaying() {
       this.props.toggleNowPlaying();
       this.setState({nowPlayingShowing: ! this.state.nowPlayingShowing});
    }
    render() {
        
        return (
           <ServerContext.Consumer>
             
               { ({ serverStatus, playerStatus, playerInstance } )  => (
                        <div className="player-bar">
                            <div className={"player-selector"}>
                                <PlayerSelector 
                                    open={this.props.selectOpen}
                                    players={serverStatus.players_loop} 
                                    selectedPlayer={this.props.targetPlayer}
                                    onSelect={this.props.switchPlayer}
                                    openSelect={this.props.openSelect}
                                    closeSelect={this.props.closeSelect}
                                />
                            </div>
                        { playerInstance ? 
                            <div className="player-controls">
                                <Button className="player-control-button" onClick={playerInstance ? playerInstance.pause : null}> 
                                    {  playerStatus && playerStatus.mode == 'play' ? 
                                        <img className={"btn-icon"} src={"./html/pause.png"} />
                                        :
                                        <img className={"btn-icon"} src={"./html/play.png"} />
                                    }   
                                </Button>

                                <Button className="player-control-button" onClick={playerInstance ? playerInstance.previousTrack : null}>
                                    <img className={"btn-icon"} src={"./html/previous.png"} />
                                </Button>

                                <Button className="player-control-button" onClick={playerInstance ? playerInstance.nextTrack : null}>
                                    <img className={"btn-icon"} src={"./html/next.png"} />
                                </Button>

                                <Button className="player-control-button" href="/settings/index.html" target="sc_settings">
                                    <img className={"btn-icon"} src={"./html/settings.png"} />
                                </Button>
                                
                            
                                <Button onClick={this.toggleNowPlaying.bind(this)}>
                                N
                                </Button>
                            </div>
                           
                        :   <div></div>
                        }    
                        { playerInstance ? 
                              <div className={"slider-volume"}>
                                <Slider
                                    value={this.state.volume}
                                    onChange={ (event, newValue) => { 
                                        this.setState({volume:newValue});
                                        playerInstance.setVolume( newValue );
                                        } } />
                                <Typography variant="caption">Server Volume</Typography>
                            </div>
                            : <div></div>
                        }
                </div>
               )}
            </ServerContext.Consumer>
        )      
    } 
}


class PlayerSelector extends React.Component {

    render() {
        
        var Players = [ ];
        Object.keys(this.props.players).forEach( (item) => {
            Players.push( 
                <MenuItem key={this.props.players[item].playerid } value={this.props.players[item].playerid}> 
                    {this.props.players[item].name}
                </MenuItem>
            );
        });
        Players.push( 
            <MenuItem key={'browser'} value={'browser'}> 
                 Browser
             </MenuItem>
            );
        return (
          <div>
              <FormControl variant="outlined">
                <InputLabel id="demo-simple-select-disabled-label">Player</InputLabel>
                    <Select
                        open={this.props.open}
                        className="player-selector"
                        label="Player"
                        onOpen={this.props.openSelect}
                        onClose={this.props.closeSelect}
                        onChange={(e) => this.props.onSelect(e)}
                        value={this.props.selectedPlayer || ""}>
                        {Players}
                    </Select>
            </FormControl>
        </div>
       
        )
    }
}

export { PlayerControls }
