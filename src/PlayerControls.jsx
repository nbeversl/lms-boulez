import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

class PlayerControls extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            volume: 0,
        }
    }
 
    render() {
        
        return (
           
            <div>
                <div className={"player-selector"}>
                    <PlayerSelector 
                        players={this.props.serverStatus.players_loop} 
                        selectedPlayer={this.props.targetPlayer}
                        onSelect={this.props.switchPlayer.bind(this)}
                    />
                </div>

                <Button onClick={this.props.player ? this.props.player.pause : null}> 
                    {  this.props.playerStatus && this.props.playerStatus.mode == 'play' ? 
                        <img className={"btn-icon"} src={"./html/pause.png"} />
                        :
                        <img className={"btn-icon"} src={"./html/play.png"} />
                    }   
                </Button>

                <Button onClick={this.props.player ? this.props.player.previousTrack : null}>
                    <img className={"btn-icon"} src={"./html/previous.png"} />
                </Button>

                <Button onClick={this.props.player ? this.props.player.nextTrack : null}>
                    <img className={"btn-icon"} src={"./html/next.png"} />
                </Button>

                <Button href="/settings/index.html" target="sc_settings">
                    <img className={"btn-icon"} src={"./html/settings.png"} />
                </Button>

                <div className={"slider-volume"}>
                    <Slider
                        value={this.props.volume}
                        onChange={this.props.handleVolumeChange} />
                </div> 
            </div>
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
                label="Player"                     
                onChange={(e) => this.props.onSelect(e)}
                value={this.props.selectedPlayer ? this.props.selectedPlayer : "Select"}>
                {Players}
            </Select>
            </FormControl>
        </div>
       
        )
    }
}

export { PlayerControls }
