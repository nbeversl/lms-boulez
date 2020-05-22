import React from 'react';
import Button from '@material-ui/core/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { LMSRequest } from './server.js';

class TrackList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tracks:[]
        }
    }
    playTrack(id) {
        LMSRequest(["78:7b:8a:bf:cf:ad",["playlist","clear"]],(r) => {
            LMSRequest(["78:7b:8a:bf:cf:ad",["playlistcontrol", "cmd:add", "track_id:"+id.toString()]],(r) => {
                LMSRequest(["78:7b:8a:bf:cf:ad",["play"]]);
            });
        });

    }
    componentDidMount() {
       
        LMSRequest(["78:7b:8a:bf:cf:ad",["titles","0","100","album_id:"+this.props.albumID, "sort:tracknum", "tags:**o**"]],(r) => {
            if ( r.result.titles_loop ){ this.setState({tracks:r.result.titles_loop}); }
        });
    }

    render() {
        var listStyle = {
            width:'45%',
            float:'right',
        }
        let List = [];  
        Object.keys(this.state.tracks).forEach( (number) =>
            { 
                List.push( 
                    <ListGroup.Item key={this.state.tracks[number].id}>
                        {this.state.tracks[number].title} ({this.state.tracks[number].type})
                        <Button onClick={() => this.playTrack(this.state.tracks[number].id)}>play</Button>
                    </ListGroup.Item>
                );
            });
        return (
            this.state.tracks != [] ? 
            <ListGroup style={listStyle}>
                {List}
            </ListGroup>
            :
            <div> Loading </div>
        );
    }
}

class AlbumList extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        
        let List = [];
        Object.keys(this.props.list).forEach( (id) =>
            { List.push(
                <Card key={this.props.list[id].id}>
                    
                        <Card.Header>
                         {this.props.list[id].album}
                        </Card.Header>
        
                        <Card.Body>
                             <Album 
                                name={this.props.list[id].album} 
                                id={this.props.list[id].id}
                                clickHandler={this.props.clickHandler}
                                art={this.props.list[id].artwork_track_id}
                            />
                            
                            <TrackList albumID={this.props.list[id].id}/>
                        </Card.Body>
                              
                </Card>
            )});
        return (
            <div>
                {List}
            </div>
        )
    }
}

class Album extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        const buttonStyle = {
            display: 'inline-block',
            width:'45%',
          };
        const imageStyle = {
            width:'500px'
        }
        return (
            <Button style={buttonStyle} value={this.props.name} onClick={() => this.props.clickHandler(this.props.id, this.props.name)}>
                <img style ={imageStyle} src={"/music/"+this.props.art+"/cover.jpg"}/>
            </Button>
        )

    }
}

export {Album, AlbumList, TrackList }