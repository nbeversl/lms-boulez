"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumGrid = exports.AlbumList = exports.Album = void 0;
var Card_1 = __importDefault(require("react-bootstrap/Card"));
var react_1 = __importDefault(require("react"));
var Tracks_tsx_1 = require("./Tracks.tsx");
var Grid_1 = __importDefault(require("@material-ui/core/Grid"));
var react_png_flipcard_1 = __importDefault(require("react-png-flipcard"));
var Dialog_1 = __importDefault(require("@material-ui/core/Dialog"));
var Slider_1 = __importDefault(require("@material-ui/core/Slider"));
var Button_1 = __importDefault(require("@material-ui/core/Button"));
var Zoom_1 = __importDefault(require("@material-ui/core/Zoom"));
var AlbumList = /** @class */ (function (_super) {
    __extends(AlbumList, _super);
    function AlbumList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AlbumList.prototype.render = function () {
        var _this = this;
        var List = [];
        Object.keys(this.props.list).forEach(function (id) {
            List.push(<Card_1.default key={_this.props.list[id].id}>        
                        <Card_1.default.Body>
                             <Album name={_this.props.list[id].album} id={_this.props.list[id].id} clickHandler={_this.props.clickHandler} art={_this.props.list[id].artwork_track_id}/>
                            <Tracks_tsx_1.TrackList playerInstance={_this.props.playerInstance} albumID={_this.props.list[id].id} library={_this.props.library}/>
                        </Card_1.default.Body>
                              
                </Card_1.default>);
        });
        return (<div>
                {List}
            </div>);
    };
    return AlbumList;
}(react_1.default.Component));
exports.AlbumList = AlbumList;
var Album = /** @class */ (function (_super) {
    __extends(Album, _super);
    function Album(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            tracks: [],
            flipped: false,
            modalOpen: false,
            dimensions: 300,
            modalOpen: false,
        };
        return _this;
    }
    Album.prototype.getMyTracks = function () {
        var _this = this;
        this.props.library.getAlbumTracks(this.props.id, function (result) {
            _this.setState({
                tracks: result,
            });
            _this.setState({ flipped: true, modalOpen: true });
        });
    };
    Album.prototype.handleMouseLeave = function () {
        this.setState({ flipped: false });
    };
    Album.prototype.handleOpen = function () {
        this.getMyTracks();
        this.setState({ modalOpen: true });
    };
    Album.prototype.handleClose = function () {
        this.setState({ modalOpen: false });
    };
    Album.prototype.render = function () {
        var modalStyle = {
            //position: 'inherit',
            width: "300px",
            height: 600,
            backgroundColor: 'white',
        };
        var backgroundImageStyle = {
            position: 'absolute',
            WebkitFilter: 'blur(10px) saturate(2) opacity(.3)',
            filter: 'blur(10px) saturate(2) opacity(.3)',
            background: 'url("/music/' + this.props.art + '/cover.jpg") no-repeat fixed top',
            width: "100%",
            maxWidth: "100%",
            height: "800px",
        };
        var buttonStyle = {
            width: this.props.albumWidth,
            height: this.props.albumWidth,
        };
        return (<div>
                {this.props.screenWidth > 600 && this.props.modal != true ?
            <div className="album-cover" onMouseLeave={this.handleMouseLeave.bind(this)}>
                        <react_png_flipcard_1.default width={this.props.albumWidth} height={this.props.albumWidth} // keep square
             flip={this.state.flipped} manual={true} key={this.props.id} value={this.props.name} front={<div onClick={this.getMyTracks.bind(this)}>
                                    <img src={"/music/" + this.props.art + "/cover.jpg"} className={"album-image"}/>                 
                                </div>} back={this.state.tracks ?
                <Tracks_tsx_1.TrackListScrolling playerInstance={this.props.playerInstance} tracks={this.state.tracks} album={this.props.id}/>
                :
                    <div>hang on ...</div>}>
                        </react_png_flipcard_1.default>

                    </div>
            :
                <div style={buttonStyle}>                    
                        <Button_1.default onClick={this.handleOpen.bind(this)}>
                            <img src={"/music/" + this.props.art + "/cover.jpg"} className={"album-image"}/>    
                        </Button_1.default>
                     
                            <Dialog_1.default TransitionComponent={Zoom_1.default} open={this.state.modalOpen}>
                                <div style={modalStyle}>
                                    {this.state.tracks ?
                    <div>
                                           
                                                <div>
                                                    <Button_1.default onClick={this.handleClose.bind(this)}>
                                                        Close
                                                    </Button_1.default>
                                                </div>
                                                <div> 
                                                    <Tracks_tsx_1.TrackListScrolling playerInstance={this.props.playerInstance} tracks={this.state.tracks} album={this.props.id}/>
                                                </div>
                                                <div style={backgroundImageStyle}/>    
                                        </div>
                    :
                        <div>hang on ...</div>}
                                
                                </div>
                                
                            </Dialog_1.default>
                  
                </div>}
            </div>);
    };
    return Album;
}(react_1.default.Component));
exports.Album = Album;
var AlbumGrid = /** @class */ (function (_super) {
    __extends(AlbumGrid, _super);
    function AlbumGrid(props) {
        var _this = _super.call(this, props) || this;
        console.log(_this.props.screenWidth);
        _this.state = {
            albumWidth: _this.props.screenWidth > 600 ? 300 : 90,
        };
        return _this;
    }
    AlbumGrid.prototype.adjustWidth = function (event, newValue) {
        this.setState({ albumWidth: newValue });
    };
    AlbumGrid.prototype.render = function () {
        var _this = this;
        var List = [];
        this.props.albumList.forEach(function (album) {
            List.push(<Grid_1.default item key={album.id}>
                    <Album screenWidth={_this.props.screenWidth} albumWidth={_this.state.albumWidth} name={album.album} id={album.id} art={album.artwork_track_id} library={_this.props.library} playerInstance={_this.props.playerInstance}/>
                </Grid_1.default>);
        });
        return (<div>
                <Slider_1.default min={40} max={300} defaultValue={this.state.albumWidth} onChange={this.adjustWidth.bind(this)}/>
                
                <Grid_1.default container spacing={this.props.screenWidth > 600 ? 3 : 1}>
                    {List}
                </Grid_1.default>
                
            
            </div>);
    };
    return AlbumGrid;
}(react_1.default.Component));
exports.AlbumGrid = AlbumGrid;
