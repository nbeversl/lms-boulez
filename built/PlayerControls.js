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
exports.PlayerControls = void 0;
var Slider_1 = __importDefault(require("@material-ui/core/Slider"));
var Button_1 = __importDefault(require("@material-ui/core/Button"));
var react_1 = __importDefault(require("react"));
var MenuItem_1 = __importDefault(require("@material-ui/core/MenuItem"));
var Select_1 = __importDefault(require("@material-ui/core/Select"));
var InputLabel_1 = __importDefault(require("@material-ui/core/InputLabel"));
var FormControl_1 = __importDefault(require("@material-ui/core/FormControl"));
var PlayerControls = /** @class */ (function (_super) {
    __extends(PlayerControls, _super);
    function PlayerControls(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            volume: 0,
        };
        return _this;
    }
    PlayerControls.prototype.render = function () {
        return (<div>
                <div className={"player-selector"}>
                    <PlayerSelector players={this.props.serverStatus.players_loop} selectedPlayer={this.props.targetPlayer} onSelect={this.props.switchPlayer.bind(this)}/>
                </div>

                <Button_1.default onClick={this.props.player ? this.props.player.pause : null}> 
                    {this.props.playerStatus && this.props.playerStatus.mode == 'play' ?
            <img className={"btn-icon"} src={"./html/pause.png"}/>
            :
                <img className={"btn-icon"} src={"./html/play.png"}/>}   
                </Button_1.default>

                <Button_1.default onClick={this.props.player ? this.props.player.previousTrack : null}>
                    <img className={"btn-icon"} src={"./html/previous.png"}/>
                </Button_1.default>

                <Button_1.default onClick={this.props.player ? this.props.player.nextTrack : null}>
                    <img className={"btn-icon"} src={"./html/next.png"}/>
                </Button_1.default>

                <Button_1.default href="/settings/index.html" target="sc_settings">
                    <img className={"btn-icon"} src={"./html/settings.png"}/>
                </Button_1.default>

                <div className={"slider-volume"}>
                    <Slider_1.default value={this.props.volume} onChange={this.props.handleVolumeChange}/>
                </div> 
            </div>);
    };
    return PlayerControls;
}(react_1.default.Component));
exports.PlayerControls = PlayerControls;
var PlayerSelector = /** @class */ (function (_super) {
    __extends(PlayerSelector, _super);
    function PlayerSelector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlayerSelector.prototype.render = function () {
        var _this = this;
        var Players = [];
        Object.keys(this.props.players).forEach(function (item) {
            Players.push(<MenuItem_1.default key={_this.props.players[item].playerid} value={_this.props.players[item].playerid}> 
                    {_this.props.players[item].name}
                </MenuItem_1.default>);
        });
        Players.push(<MenuItem_1.default key={'browser'} value={'browser'}> 
                 Browser
             </MenuItem_1.default>);
        return (<div>
              <FormControl_1.default variant="outlined">
              <InputLabel_1.default id="demo-simple-select-disabled-label">Player</InputLabel_1.default>
            <Select_1.default label="Player" onChange={function (e) { return _this.props.onSelect(e); }} value={this.props.selectedPlayer ? this.props.selectedPlayer : "Select"}>
                {Players}
            </Select_1.default>
            </FormControl_1.default>
        </div>);
    };
    return PlayerSelector;
}(react_1.default.Component));
