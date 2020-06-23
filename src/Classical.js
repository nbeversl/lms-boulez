import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { AlbumList , AlbumGrid}  from './Albums.js';

class ComposerList extends React.Component {
    
    render() {
       
        let artistList = {};
        this.props.albumList.forEach( (item) => { 
            if ( ! Object.keys(artistList).includes(item.artist) ) { 
                artistList[item.artist] = [];
            }
            artistList[item.artist].push(item);
        });
        var artists = Object.keys(artistList).sort(); 
        var Table = [];
        artists.forEach( (artistName) => { 
            Table.push(
                <Composer 
                    key={artistName} 
                    composerName={artistName} 
                    albumList={artistList[artistName]}
                    playerInstance={this.props.playerInstance}
                    library={this.props.library}
                    />     
                );
        });
             
        return (
           <Accordion >  
                {Table}
           </Accordion>
        );

    }
}

class Composer extends React.Component {
   
    render() {
    
        return (
            <Card >      
                <Accordion.Toggle as={Card.Header} eventKey={this.props.composerName} >
                    <Card.Header> {this.props.composerName} </Card.Header>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={this.props.composerName}>
                    <Card.Body>
                    <AlbumGrid
                        playerInstance={this.props.playerInstance}
                        albumList={this.props.albumList} 
                        library={this.props.library}
                        />
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        );
    }

}

export { Composer, ComposerList }