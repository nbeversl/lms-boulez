import React from 'react';
import { render } from 'react-dom';
import Button from '@material-ui/core/Button';
import { LMSRequest } from './server.js';
import Select from '@material-ui/core/Select';
import { GenreMenu } from './GenreMenu.js';

class Player {
    
    constructor(address) {
        this.address = address;

        this.play = () => {
            LMSRequest([this.address,["play"]])
        }
        this.pause = () => {
            LMSRequest([this.address,["pause"]])
        }
        this.albums = () => {
            LMSRequest([this.address,["albums", "0", "1000"]], 
            function(r) { console.log(r.result.albums_loop); }
            );
        }
        this.genres = () => {
            LMSRequest([this.address,["genres", "0", "1000"]], 
            function(r) { console.log(r.result); }
            );
        }
    }
}


var workIMac = new Player("78:7b:8a:bf:cf:ad");

class App extends React.Component {
    
    render ()  {
        
        return (
            <div>    
                <link
                    rel="stylesheet"
                    href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                    integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
                    crossorigin="anonymous"
                    />
                <PlayerStatus />
                <Button onClick={workIMac.play}>
                    Play
                </Button>
                <Button onClick={workIMac.pause}>
                    Pause
                </Button>
                <hr></hr>
                <div>
                    <GenreMenu />
                </div>
               
            </div>
        );
    }
}
class PlayerStatus extends React.Component {

    constructor(props)  {
        super(props)
        this.state = {}
    }
    componentDidMount() {
        let statusCheck = setInterval( ()=> {
            LMSRequest(["78:7b:8a:bf:cf:ad",["serverstatus", "0","10"]], (response) => {
                this.setState(response)
                console.log(response);
            });
        }, 2500);
    }
    render() {
        return (
            this.state.result ?
            <div>
                Status Here
                <PlayerSelector players={this.state.result.players_loop} />
            </div>
            :
            <div> Loading</div>
        )
    }
}

class PlayerSelector extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        var Players = [];
        Object.keys(this.props.players).forEach( (item) => {
            Players.push( 
                <option value={this.props.players[item].playerid}> {this.props.players[item].name}</option>
            );
        });
        return (
            <Select value={this.props.players[0].playerid}>
                {Players}
            </Select>

        )
    }
}

render ( 
    <App />,
    document.getElementById('target')
)

