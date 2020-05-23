import Card from 'react-bootstrap/Card';
import React from 'react';
import Button from '@material-ui/core/Button';
import { TrackList , TrackListScrolling } from './Tracks.js';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Grid from '@material-ui/core/Grid';
import FlipCard from 'react-png-flipcard';

class AlbumList extends React.Component {
    
    render() {
  
        let List = [];
        Object.keys(this.props.list).forEach( (id) =>
            { List.push(
                <Card key={this.props.list[id].id}>        
                        <Card.Body>
                             <Album 
                                name={this.props.list[id].album} 
                                id={this.props.list[id].id}
                                clickHandler={this.props.clickHandler}
                                art={this.props.list[id].artwork_track_id}
                            />
                            <TrackList 
                                playerInstance={this.props.playerInstance} 
                                albumID={this.props.list[id].id}
                            />
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
   
        return (
            <Button 
                value={this.props.name} 
                onClick={() => this.props.clickHandler(this.props.id, this.props.name)}>
                    
                <LazyLoadImage
                    src={"/music/"+this.props.art+"/cover.jpg"}
                    width={'100%'}
                 />
            </Button>
        )

    }
}


class AlbumGrid extends React.Component {
    
    render() {
      
        let List = [];
        Object.keys(this.props.list).forEach( (id) =>
            { List.push(
                <FlipCard item xs={3} key={this.props.list[id].id}
                    
                    front = {       
                        <Album 
                                name={this.props.list[id].album} 
                                id={this.props.list[id].id}
                                clickHandler={this.props.clickHandler}
                                art={this.props.list[id].artwork_track_id}
                            />
                    }
                    back = {
                        
                            <TrackListScrolling 
                            
                                playerInstance={this.props.playerInstance} 
                                albumID={this.props.list[id].id}/> 

                    } />
            )});
        return (
            <Grid container spacing={1}>
                {List}
            </Grid>
        )
    }


}
export {Album, AlbumList, AlbumGrid } 