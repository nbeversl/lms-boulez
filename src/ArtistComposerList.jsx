import * as React from "react";
import Accordion from 'react-bootstrap/Accordion';
import ArtistComposer from './ArtistComposer';

class ArtistComposerList extends React.Component {
    
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
                <ArtistComposer 
                    key={artistName} 
                    composerName={artistName} 
                    albumList={artistList[artistName]}
                    checkPlayerInstance={this.props.checkPlayerInstance}
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

export default ArtistComposerList;
