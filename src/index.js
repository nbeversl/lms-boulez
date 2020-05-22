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

class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            serverStatus : null,
            targetPlayer : null,
            playerInstance : null,
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
                console.log(response.result);
            });
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
                <PlayerSelector 
                    players={this.state.serverStatus.players_loop} 
                    selectedPlayer={this.state.targetPlayer}
                    onSelect={this.switchPlayer.bind(this)}
                />
                <PlayerControls player={this.state.playerInstance}/>
                <hr></hr>
                <div>
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

