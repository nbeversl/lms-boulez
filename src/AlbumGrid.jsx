import * as React from "react";
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import Album from './Album';

class AlbumGrid extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            albumWidth: this.props.screenWidth > 600 ? 300 : 90,
        }
     }
    
    adjustWidth(event, newValue) {
        this.setState({albumWidth : newValue })
    }

    render() {
        let List = [];

        var albums = this.props.albumList || [];
        albums.forEach( (album) =>
                { 
                    List.push(
                        <Grid item key={album.id}>
                            <Album  
                                screenWidth={this.props.screenWidth}
                                albumWidth={this.state.albumWidth}
                                album={album} 
                                checkPlayerInstance={this.props.checkPlayerInstance}
                            />
                        </Grid>
                )});
        return (
            <div>
                <a name="albums"></a>
                <Slider min={40} max={300} defaultValue={this.props.screenWidth > 600 ? 300 : 90}  onChange={this.adjustWidth.bind(this)} />
                <Grid 
                    container 
                    spacing={this.props.screenWidth > 600 ? 3 : 1 }>
                    {List}
                </Grid>
            </div>
        )
    }
}

export default AlbumGrid;