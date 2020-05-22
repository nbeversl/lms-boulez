import Card from 'react-bootstrap/Card';
import React from 'react';
import Button from '@material-ui/core/Button';
import { TrackList } from './Tracks.js';

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
                            <TrackList playerInstance={this.props.playerInstance} albumID={this.props.list[id].id}/>
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
            <Button 
                style={buttonStyle} 
                value={this.props.name} 
                onClick={() => this.props.clickHandler(this.props.id, this.props.name)}>
                    
                <img style ={imageStyle} src={"/music/"+this.props.art+"/cover.jpg"}/>
            </Button>
        )

    }
}

export {Album, AlbumList } 