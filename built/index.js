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
var react_1 = __importDefault(require("react"));
var react_dom_1 = require("react-dom");
var Player_1 = require("./Player");
var GenreMenu_1 = require("./GenreMenu");
require("./style.css");
var server_1 = require("./server");
var PlayerControls_1 = require("./PlayerControls");
var Library_1 = require("./Library");
var Slider_1 = __importDefault(require("@material-ui/core/Slider"));
var Yamaha_1 = require("./Yamaha");
var BrowserPlayer_1 = require("./BrowserPlayer");
var CircularProgress_1 = __importDefault(require("@material-ui/core/CircularProgress"));
var Albums_1 = require("./Albums");
var SwipeableDrawer_1 = __importDefault(require("@material-ui/core/SwipeableDrawer"));
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            serverStatus: null,
            targetPlayer: "",
            playerInstance: null,
            elapsedTime: 0,
            playerStatus: null,
            volume: 0,
            library: null,
            fullscreen: false,
            lastScrollTop: 0,
            screenWidth: 500,
            drawer: true,
            drawerVariant: 'permanent',
        };
        _this.updateWindowDimensions = _this.updateWindowDimensions.bind(_this);
        return _this;
    }
    App.prototype.componentDidMount = function () {
        var _this = this;
        this.updateWindowDimensions();
        server_1.LMSRequest(["", ["serverstatus", "0", "20"]], function (response) {
            //this.setState({playerInstance: new Player( response.result.players_loop[0].playerid) });
            //this.setState({targetPlayer: response.result.players_loop[0].playerid});
            _this.setState({ serverStatus: response.result });
        });
        var statusCheck = setInterval(function () {
            if (_this.state.targetPlayer == 'browser') {
                _this.setState({
                    playerStatus: {
                        mode: _this.state.playerInstance.playerInstance
                            && _this.state.playerInstance.playerInstance.playing() ? 'play' : 'pause',
                        playlist_loop: _this.state.playerInstance.tracks,
                        playlist_cur_index: _this.state.playerInstance.currentIndex,
                    }
                });
                return;
            }
            if (_this.state.targetPlayer != "") {
                server_1.LMSRequest([_this.state.targetPlayer, ["status", "0", "10", "tags:duration,time,mode, **playlist index**, **l**,**J**"]], function (r) {
                    _this.setState({
                        playerStatus: r.result,
                        volume: r.result["mixer volume"]
                    });
                });
            }
        }, 5000);
        this.setState({ library: new Library_1.LMSLibrary() });
        // window.addEventListener("scroll", () => { 
        //     var st = window.pageYOffset || document.documentElement.scrollTop;
        //     var cover = document.getElementsByClassName("now-playing-album-cover");
        //     if (st > this.state.lastScrollTop){
        //         document.getElementsByClassName("now-playing")[0].style.opacity = "0";
        //     } else {
        //         document.getElementsByClassName("now-playing")[0].style.opacity = "1";
        //     }
        //     this.setState({lastScrollTop : st <= 0 ? 0 : st}); // For Mobile or negative scrolling
        //     }, false);
        window.addEventListener('resize', this.updateWindowDimensions);
    };
    App.prototype.updateWindowDimensions = function () {
        this.setState({
            screenWidth: window.innerWidth,
            drawerVariant: window.innerWidth > 600 ? 'permanent' : 'temporary',
        });
    };
    App.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
    };
    App.prototype.scrollFunction = function () {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        }
        else {
        }
    };
    App.prototype.switchPlayer = function (e) {
        if (e.target.value != 'browser') {
            var newPlayer = new Player_1.Player(e.target.value);
        }
        else {
            var newPlayer = new BrowserPlayer_1.BrowserPlayer(this.state.serverStatus.players_loop[0].playerid);
        }
        this.setState({
            targetPlayer: e.target.value,
            playerInstance: newPlayer,
        });
    };
    App.prototype.handleSeekChange = function (event, newValue) {
        this.state.playerInstance.seek(this.state.playerStatus.duration * newValue / 100);
        this.setState({ seek: newValue });
    };
    App.prototype.handleVolumeChange = function (event, newValue) {
        this.setState({ volume: newValue });
        this.state.playerInstance.setVolume(newValue);
    };
    App.prototype.toggleDrawer = function (anchor, open) {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        this.setState({ drawer: open });
    };
    ;
    App.prototype.render = function () {
        var _this = this;
        return (this.state.serverStatus ?
            <div>
                    <SwipeableDrawer_1.default disableSwipeToOpen={false} anchor={'top'} open={this.state.drawer} onClose={function () { return _this.toggleDrawer('top', false); }} onOpen={function () { return _this.toggleDrawer('top', true); }}>
                        
                        <meta name="viewport" content="width=device-width,initial-scale=1"></meta>
                        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"/>
                        <div className="control-bar">
                            <div className="control-content">
                                    
                                    <div className="player-controls">
                                        <PlayerControls_1.PlayerControls playerStatus={this.state.playerStatus} player={this.state.playerInstance} serverStatus={this.state.serverStatus} targetPlayer={this.state.targetPlayer} volume={this.state.volume} switchPlayer={this.switchPlayer.bind(this)} handleVolumeChange={this.handleVolumeChange.bind(this)}/>
                                    </div>
                            
                                {this.state.playerStatus && this.state.playerStatus.player_name == "Den" ?
                <YamahaStereo />
                :
                    <div></div>}
                            
                                {this.state.playerStatus && this.state.playerStatus.playlist_loop && this.state.playerStatus.playlist_loop[this.state.playerStatus.playlist_cur_index] ?
                <div className="now-playing">
                                        <div className="now-playing-meta">
                                            <div className="now-playing-artist">{this.state.playerStatus.playlist_loop[this.state.playerStatus.playlist_cur_index].artist}</div>
                                            <div className="now-playing-album-title">{this.state.playerStatus.playlist_loop[this.state.playerStatus.playlist_cur_index].album}</div>
                                            <div className="now-playing-track-name">{this.state.playerStatus.playlist_loop[this.state.playerStatus.playlist_cur_index].tracknum}. {this.state.playerStatus.playlist_loop[this.state.playerStatus.playlist_cur_index].title}</div>
                                            <Slider_1.default value={Math.floor(this.state.playerStatus.time / this.state.playerStatus.duration * 100)} onChange={this.handleSeekChange.bind(this)}/>

                                        </div>

                                        <div className="now-playing-album-cover">
                                            <Albums_1.Album id={this.state.playerStatus.playlist_loop[this.state.playerStatus.playlist_cur_index].album_id} art={this.state.playerStatus.playlist_loop[this.state.playerStatus.playlist_cur_index].artwork_track_id} library={this.state.library} modal={true} playerInstance={this.state.playerInstance}/>
                                        </div>   
                                    </div>
                : <div></div>}
                                        
                            </div>    
                        </div>
                    </SwipeableDrawer_1.default>   

                    
                    
                    <div className="the-rest">
                        <GenreMenu_1.GenreMenu screenWidth={this.state.screenWidth} playerInstance={this.state.playerInstance} library={this.state.library}/>
                    </div>
                          
                </div>
            :
                <div className="loading-message"> 
                <CircularProgress_1.default />
                <div className="loading-text"> Loading the highest quality, most organized music library in the world...</div>
             </div>);
    };
    return App;
}(react_1.default.Component));
var YamahaStereo = /** @class */ (function (_super) {
    __extends(YamahaStereo, _super);
    function YamahaStereo(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            instance: new Yamaha_1.Yamaha(),
        };
        return _this;
    }
    YamahaStereo.prototype.setInput = function (input) {
        this.state.instance.setInput(input);
    };
    YamahaStereo.prototype.render = function () {
        return (<div>
                {this.state.instance.ready ?
            <div>
                      Volume Control Here
                      
                    </div>
            :
                <div></div>}

            </div>);
    };
    return YamahaStereo;
}(react_1.default.Component));
react_dom_1.render(<App />, document.getElementById('target'));
