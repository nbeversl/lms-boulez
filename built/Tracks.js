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
exports.TrackListScrolling = exports.TrackList = void 0;
var react_1 = __importDefault(require("react"));
var Button_1 = __importDefault(require("@material-ui/core/Button"));
var react_custom_scrollbars_1 = require("react-custom-scrollbars");
require("./style.css");
var TrackList = /** @class */ (function (_super) {
    __extends(TrackList, _super);
    function TrackList(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            tracks: []
        };
        return _this;
    }
    TrackList.prototype.render = function () {
        var _this = this;
        var List = [];
        Object.keys(this.state.tracks).forEach(function (number) {
            List.push(<li key={_this.state.tracks[number].id}>
                        {_this.state.tracks[number].title} ({_this.state.tracks[number].type})
                        <Button_1.default onClick={function () { return _this.props.playerInstance.playTrack(_this.state.tracks[number].id); }}>play</Button_1.default>
                    </li>);
        });
        return (this.state.tracks != [] ?
            <div>{List}</div>
            :
                <div> Loading </div>);
    };
    return TrackList;
}(react_1.default.Component));
exports.TrackList = TrackList;
var TrackListScrolling = /** @class */ (function (_super) {
    __extends(TrackListScrolling, _super);
    function TrackListScrolling() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TrackListScrolling.prototype.render = function () {
        var _this = this;
        var tracklistStyle = {
            width: "100%",
            position: 'absolute',
            zIndex: "100",
        };
        var List = [];
        Object.keys(this.props.tracks).forEach(function (trackNumber) {
            List.push(<li key={trackNumber}>                       
                        <span className="track-title"> 
                                {_this.props.tracks[trackNumber].title}
                        </span> 
                        <div className="codec">
                            {_this.props.tracks[trackNumber].type == 'flc' ? 'FLAC'
                : _this.props.tracks[trackNumber].type}                            
                        </div>
                        <Button_1.default onClick={function () {
                return _this.props.playerInstance.playAlbumFromTrackAndContinue(_this.props.tracks[trackNumber], trackNumber);
            }}>Play
                        </Button_1.default>
                        <a href={"/music/" + _this.props.tracks[trackNumber].id + "/download/"}>↓</a>
                    
                        
                    </li>);
        });
        return (this.props.tracks != [] ?
            <react_custom_scrollbars_1.Scrollbars style={tracklistStyle}> 
                <ol className="grid-tracklist">
                    {List}
                </ol>
            </react_custom_scrollbars_1.Scrollbars>
            :
                <div> Loading </div>);
    };
    return TrackListScrolling;
}(react_1.default.Component));
exports.TrackListScrolling = TrackListScrolling;
