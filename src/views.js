import React from 'react';
import Button from '@material-ui/core/Button';

class BPMView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selection: '50',
            selections: [],
            table: [],
        }
        this.handleBPMChange = this.handleBPMChange.bind(this);
    }

    componentDidMount() {

        var selections = [];
        var numbers = [];
        for (var i=50; i <330; i += 10) {
            numbers.push(i);
        }
        numbers.map( (bpm) =>  {
            selections.push( 
                <Button key={bpm} value={bpm.toString()} onClick={ () => { this.handleBPMChange(bpm) } }>{bpm.toString()}</Button>
            )
            });
        this.setState({selections:selections});

    }
    handleBPMChange (bpm) {
        console.log(bpm);
        this.setState({selection: bpm})
    }
    render() {
        
        var table = [];
        var tracksWithBPM = [];       
        this.props.library.tracks.forEach( (track) => {
            if (track.bpm) { tracksWithBPM.push(track); }
        });

        tracksWithBPM.sort(compare).forEach( (track)=> {
            if ( track.bpm > parseInt(this.state.selection) && track.bpm < parseInt(this.state.selection) + 10 ) {
                table.push(
                   
                        <Button onClick={() => { this.props.playerInstance.playTrack(track.id)} }>
                            {track.bpm} - {track.title} - {track.artist} - {track.album}
                        </Button>
                   
                );
            }
            if ( ( track.bpm * 2 )  > parseInt(this.state.selection) && ( track.bpm * 2 ) < parseInt(this.state.selection) + 10 ) {
                table.push(
                   
                        <Button onClick={() => { this.props.playerInstance.playTrack(track.id)} }>
                            {(track.bpm * 2).toString() + " (orig. "+track.bpm+") "} - {track.title} - {track.artist} - {track.album}
                        </Button>
                   
                );
            }
        });

            return(
            <div>
                <div>{this.state.selections}</div>
                <div>{table}</div>

            </div>
        );
    }


}
export { BPMView }

function compare( a, b ) {

        if ( parseInt(a.bpm) < parseInt(b.bpm) ){
        return -1;
        }
        if ( a.bpm > b.bpm ){
        return 1;
        }
        return 0;
 
  }
