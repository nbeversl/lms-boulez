"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LMSLibrary = void 0;
var server_1 = require("./server");
var LMSLibrary = /** @class */ (function () {
    function LMSLibrary() {
        this.genres = {};
        this.albums = {};
        this.tracks = [];
        this.establishLibrary();
    }
    LMSLibrary.prototype.establishLibrary = function () {
        var _this = this;
        server_1.LMSRequest(["", ["genres", "0", "1000"]], function (r) {
            r.result.genres_loop.forEach(function (item) {
                _this.genres[item.genre] = {};
                _this.genres[item.genre].id = item.id;
                server_1.LMSRequest(["", ["albums", "0", "1000", "genre_id:" + item.id.toString(), "tags:ljaS", "sort:artflow"]], function (r) {
                    _this.genres[item.genre].albums = r.result.albums_loop;
                });
            });
        });
    };
    LMSLibrary.prototype.getAllTitlesforGenre = function (id) {
        var _this = this;
        this.titles = [];
        server_1.LMSRequest(["", ["titles", "0", "50000", "genre_id:" + id.toString(), "tags:id**e****o****t****m****u****a****l**"]], function (r) {
            r.result.titles_loop.forEach(function (item) {
                _this.tracks.push(item);
                if (!(item.album_id in _this.albums)) {
                    _this.albums[item.album_id] = {};
                }
                _this.albums[item.album_id][item.tracknum] = item;
            });
        });
    };
    LMSLibrary.prototype.getAlbumTracks = function (albumID, callback) {
        server_1.LMSRequest(["", ["titles", "0", "100", "album_id:" + albumID, "sort:tracknum", "tags:**u****o****d****l****e**"]], function (r) {
            callback(r.result.titles_loop);
        });
    };
    return LMSLibrary;
}());
exports.LMSLibrary = LMSLibrary;
