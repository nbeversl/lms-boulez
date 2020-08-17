import * as React from "react";
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import AlbumGrid from './AlbumGrid';

class ArtistComposer extends React.Component {
   
    render() {
    
        return (
            <Card >      
                <Accordion.Toggle as={Card.Header} eventKey={this.props.composerName} >
                    <Card.Header> {this.props.composerName} </Card.Header>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={this.props.composerName}>
                    <Card.Body>
                    <AlbumGrid
                        albumList={this.props.albumList} 
                        />
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        );
    }

}

export default ArtistComposer;
