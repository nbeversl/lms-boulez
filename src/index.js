import React from 'react';
import { render } from 'react-dom';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import { Player } from './Player.js';
import { GenreMenu } from './GenreMenu.js';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import './style.css';
import { LMSRequest } from './server.js';
import Slider from '@material-ui/core/Slider';

class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            serverStatus : null,
            targetPlayer : null,
            playerInstance : null,
            elapsedTime: 0,
            playerStatus : null,
        }
    }

    componentDidMount() {
        
        LMSRequest([this.props.mac,["serverstatus", "0","20"]], (response) => {
            this.setState({playerInstance: new Player( response.result.players_loop[0].playerid) });
            this.setState({targetPlayer: response.result.players_loop[0].playerid});
        });

        let statusCheck = setInterval( ()=> {
            LMSRequest([this.props.mac,["serverstatus", "0","20"]], (response) => {
                this.setState({serverStatus: response.result});
            });
            if (this.state.playerInstance) {
                this.state.playerInstance.PlayerStatus( (r) => {
                    this.setState({playerStatus: r});
                });
            }

        }, 2500);
    }
    
    switchPlayer(e) {
        this.setState({targetPlayer: e.target.value});
        this.setState({playerInstance : new Player(e.target.value)});
    }

    render ()  {
        
        return (
            this.state.serverStatus ?
            <div>    
                <link
                    rel="stylesheet"
                    href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                    integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
                    crossorigin="anonymous"
                    />
                <div className="control-bar">
                    <div className="control-content">
                        <PlayerSelector 
                            players={this.state.serverStatus.players_loop} 
                            selectedPlayer={this.state.targetPlayer}
                            onSelect={this.switchPlayer.bind(this)}
                        />
                        <PlayerControls 
                            status={this.state.playerStatus}
                            player={this.state.playerInstance}
                        />
                    </div>
                </div>
                <div className="the-rest">
                    <GenreMenu playerInstance={this.state.playerInstance}/>
                </div>
               

            </div>
            :
            <div> Loading </div>
        );
    }
}


class PlayerSelector extends React.Component {
    
    render() {
        
        var Players = [];
        Object.keys(this.props.players).forEach( (item) => {
            Players.push( 
                <MenuItem value={this.props.players[item].playerid}> 
                    {this.props.players[item].name}
                </MenuItem>
            );
        });
       
       
        return (
            this.props.selectedPlayer ?
          <div>
            <InputLabel id="player-select">Player</InputLabel>
            <Select                     
                onChange={(e) => this.props.onSelect(e)}
                value={this.props.selectedPlayer}>
                {Players}
            </Select>
            </div>
            :
            <div>Waiting</div>

        )
    }
}


class PlayerControls extends React.Component {
    handleSliderChange(e) {
        const newPlace = e.value;
        console.log(e);
        this.props.player.seek( this.props.status.duration / newPlace );
    }
    render() {
        return (
            this.props.player ?
            <div>
                <Button onClick={this.props.player.play}>
                    Play
                </Button>
                <Button onClick={this.props.player.pause}>
                    Pause
                </Button>
                <Button href="/settings/index.html" target="sc_settings">Settings</Button>
                <Button href="/html/docs/help.html" target="sc_help">Help</Button>
                { this.props.status ?
                    <Slider 
                        value={Math.floor(this.props.status.time / this.props.status.duration * 100)} 
                        onChangeCommitted={this.handleSliderChange.bind(this)}
                    />
                : <div></div>
                }

            </div>
            :
            <div>Waiting</div>
        )
    }
}

render ( 
    <App mac={"78:7b:8a:bf:cf:ad"}/>,
    document.getElementById('target')
)

