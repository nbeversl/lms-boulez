import * as React from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class SearchBar extends React.Component {
    
    constructor(props) {
        this.state = {
            searchString: '',
        }
    }
    handleSubmit(event) {
        event.preventDefault();
        this.props.searchFor(this.state.searchString);
    }
    handleChange(event) {
        this.setState({searchString: event.target.value})
    }
    clearSearchString() {
        this.setState({searchString:''});
    }
    
    render () {
    
        return (
            <div className="search-bar">
                <form onSubmit={this.handleSubmit.bind(this) }>
                    <TextField 
                        variant="outlined"
                        size="small"
                        value={this.state.searchString}
                        onChange={this.handleChange.bind(this)} 
                    />
                    <Button className="search-clear" onClick={this.clearSearchString.bind(this) }>x</Button>
                    <Button className="search-button" onClick={this.handleSubmit.bind(this) }>Search</Button>
                </form>
            </div>
        )
    }
}

export default SearchBar;