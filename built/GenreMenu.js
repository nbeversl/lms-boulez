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
exports.GenreMenu = void 0;
var react_1 = __importDefault(require("react"));
var Button_1 = __importDefault(require("@material-ui/core/Button"));
var Classical_1 = require("./Classical");
var Albums_1 = require("./Albums");
var views_1 = require("./views");
var GenreMenu = /** @class */ (function (_super) {
    __extends(GenreMenu, _super);
    function GenreMenu(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            genres: {},
            genreSelected: 0,
            trackList: [],
            albumSelected: null,
            albumSelectedID: null,
            view: 'grid',
        };
        _this.handleAlbumChange = _this.handleAlbumChange.bind(_this);
        return _this;
    }
    GenreMenu.prototype.handleGenreChange = function (e) {
        this.setState({ genreSelected: e.currentTarget.value });
        this.props.library.getAllTitlesforGenre(this.props.library.genres[e.currentTarget.value].id);
    };
    GenreMenu.prototype.handleAlbumChange = function (id, name) {
        var _this = this;
        this.props.playerInstance.getAlbumTracks(id, function (result) {
            _this.setState({ trackList: result });
        });
        this.setState({ albumSelected: name });
        this.setState({ albumSelectedID: id });
    };
    GenreMenu.prototype.handleViewChange = function (name) {
        this.setState({ view: name });
    };
    GenreMenu.prototype.render = function () {
        var _this = this;
        var genresTable = [];
        Object.keys(this.props.library.genres).forEach(function (genreName) {
            genresTable.push(<Button_1.default className={"genre-choice"} key={genreName} value={genreName} onClick={_this.handleGenreChange.bind(_this)}>
                    {genreName}
                </Button_1.default>);
        });
        if (this.state.genreSelected && this.state.genres) {
            switch (this.state.view) {
                case ("composer-list"):
                    var view = <Classical_1.ComposerList albumList={this.props.library.genres[this.state.genreSelected].albums} playerInstance={this.props.playerInstance} library={this.props.library}/>;
                    break;
                case ('grid'):
                    var view = <Albums_1.AlbumGrid screenWidth={this.props.screenWidth} library={this.props.library} albumList={this.props.library.genres[this.state.genreSelected].albums} genre={this.state.genreSelected} clickHandler={this.handleAlbumChange} playerInstance={this.props.playerInstance}/>;
                    break;
                case ('bpm'):
                    var view = <views_1.BPMView library={this.props.library} playerInstance={this.props.playerInstance}/>;
                    break;
            }
        }
        return (<div>
                <div className='genre-selector'>
                    {genresTable}
                </div> 
                <ViewSelector handleChange={this.handleViewChange.bind(this)}/>
                 {this.state.genreSelected ? view : <div></div>}
              
            </div>);
    };
    return GenreMenu;
}(react_1.default.Component));
exports.GenreMenu = GenreMenu;
var ViewSelector = /** @class */ (function (_super) {
    __extends(ViewSelector, _super);
    function ViewSelector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ViewSelector.prototype.render = function () {
        var _this = this;
        return (<div><hr />
                <Button_1.default onClick={function () { return _this.props.handleChange('grid'); }}>Album Grid</Button_1.default>
                <Button_1.default onClick={function () { return _this.props.handleChange('composer-list'); }}>Composer List</Button_1.default>
                <Button_1.default onClick={function () { return _this.props.handleChange('bpm'); }}>BPM</Button_1.default>
                <hr />
            </div>);
    };
    return ViewSelector;
}(react_1.default.Component));
