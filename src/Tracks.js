import React from 'react';
import Button from '@material-ui/core/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { LMSRequest } from './server.js';

class TrackList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tracks:[]
        }
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
                        <Button onClick={() => this.props.playerInstance.playTrack(this.state.tracks[number].id)}>play</Button>
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

export { TrackList }