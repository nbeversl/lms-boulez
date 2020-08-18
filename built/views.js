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
exports.BPMView = void 0;
var react_1 = __importDefault(require("react"));
var Button_1 = __importDefault(require("@material-ui/core/Button"));
var BPMView = /** @class */ (function (_super) {
    __extends(BPMView, _super);
    function BPMView(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            selection: '50',
            selections: [],
            table: [],
        };
        _this.handleBPMChange = _this.handleBPMChange.bind(_this);
        return _this;
    }
    BPMView.prototype.componentDidMount = function () {
        var _this = this;
        var selections = [];
        var numbers = [];
        for (var i = 50; i < 330; i += 10) {
            numbers.push(i);
        }
        numbers.map(function (bpm) {
            selections.push(<Button_1.default key={bpm} value={bpm.toString()} onClick={function () { _this.handleBPMChange(bpm); }}>{bpm.toString()}</Button_1.default>);
        });
        this.setState({ selections: selections });
    };
    BPMView.prototype.handleBPMChange = function (bpm) {
        this.setState({ selection: bpm });
    };
    BPMView.prototype.render = function () {
        var _this = this;
        var table = [];
        var tracksWithBPM = [];
        this.props.library.tracks.forEach(function (track) {
            if (track.bpm) {
                tracksWithBPM.push(track);
            }
        });
        tracksWithBPM.sort(compare).forEach(function (track) {
            if (track.bpm > parseInt(_this.state.selection) && track.bpm < parseInt(_this.state.selection) + 10) {
                table.push(<Button_1.default onClick={function () { _this.props.playerInstance.playTrack(track.id); }}>
                            {track.bpm} - {track.title} - {track.artist} - {track.album}
                        </Button_1.default>);
            }
            if ((track.bpm * 2) > parseInt(_this.state.selection) && (track.bpm * 2) < parseInt(_this.state.selection) + 10) {
                table.push(<Button_1.default onClick={function () { _this.props.playerInstance.playTrack(track.id); }}>
                            {(track.bpm * 2).toString() + " (orig. " + track.bpm + ") "} - {track.title} - {track.artist} - {track.album}
                        </Button_1.default>);
            }
        });
        return (<div>
                <div>{this.state.selections}</div>
                <div>{table}</div>

            </div>);
    };
    return BPMView;
}(react_1.default.Component));
exports.BPMView = BPMView;
function compare(a, b) {
    if (parseInt(a.bpm) < parseInt(b.bpm)) {
        return -1;
    }
    if (a.bpm > b.bpm) {
        return 1;
    }
    return 0;
}
