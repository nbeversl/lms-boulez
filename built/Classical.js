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
exports.ComposerList = exports.Composer = void 0;
var react_1 = __importDefault(require("react"));
var Accordion_1 = __importDefault(require("react-bootstrap/Accordion"));
var Card_1 = __importDefault(require("react-bootstrap/Card"));
var Albums_1 = require("./Albums");
var ComposerList = /** @class */ (function (_super) {
    __extends(ComposerList, _super);
    function ComposerList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ComposerList.prototype.render = function () {
        var _this = this;
        var artistList = {};
        this.props.albumList.forEach(function (item) {
            if (!Object.keys(artistList).includes(item.artist)) {
                artistList[item.artist] = [];
            }
            artistList[item.artist].push(item);
        });
        var artists = Object.keys(artistList).sort();
        var Table = [];
        artists.forEach(function (artistName) {
            Table.push(<Composer key={artistName} composerName={artistName} albumList={artistList[artistName]} playerInstance={_this.props.playerInstance} library={_this.props.library}/>);
        });
        return (<Accordion_1.default>  
                {Table}
           </Accordion_1.default>);
    };
    return ComposerList;
}(react_1.default.Component));
exports.ComposerList = ComposerList;
var Composer = /** @class */ (function (_super) {
    __extends(Composer, _super);
    function Composer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Composer.prototype.render = function () {
        return (<Card_1.default>      
                <Accordion_1.default.Toggle as={Card_1.default.Header} eventKey={this.props.composerName}>
                    <Card_1.default.Header> {this.props.composerName} </Card_1.default.Header>
                </Accordion_1.default.Toggle>
                <Accordion_1.default.Collapse eventKey={this.props.composerName}>
                    <Card_1.default.Body>
                    <Albums_1.AlbumGrid playerInstance={this.props.playerInstance} albumList={this.props.albumList} library={this.props.library}/>
                    </Card_1.default.Body>
                </Accordion_1.default.Collapse>
            </Card_1.default>);
    };
    return Composer;
}(react_1.default.Component));
exports.Composer = Composer;
