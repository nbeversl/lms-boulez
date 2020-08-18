"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var server_1 = require("./server");
var Player = /** @class */ (function () {
    function Player(address) {
        var _this = this;
        this.address = address;
        this.tracks = [];
        this.playing = null;
        this.play = function () {
            server_1.LMSRequest([_this.address, ["play"]]);
            _this.playing = true;
        };
        this.pause = function () {
            server_1.LMSRequest([_this.address, ["pause"]], function (r) {
            });
            _this.playing = !_this.playing;
        };
        this.playAlbum = function (albumTitle) {
            server_1.LMSRequest([_this.address, ["playlist", "loadalbum", '*', '*', albumTitle]], function (r) {
                _this.play();
            });
        };
        this.playTrack = function (id) {
            server_1.LMSRequest([_this.address, ["playlist", "clear"]], function (r) {
                server_1.LMSRequest([_this.address, ["playlistcontrol", "cmd:add", "track_id:" + id.toString()]], function (r) {
                    server_1.LMSRequest([_this.address, ["play"]]);
                });
            });
        };
        this.setVolume = function (value) {
            server_1.LMSRequest([_this.address, ["mixer", "volume", value.toString()]], function (r) {
            });
        };
        this.playAlbumFromTrackAndContinue = function (track, startNumber) {
            var albumTitle = track.album;
            server_1.LMSRequest([_this.address, ["playlist", "clear"]], function (r) {
                server_1.LMSRequest([_this.address, ["playlist", "loadalbum", '*', '*', albumTitle]], function (r) {
                    server_1.LMSRequest([_this.address, ["playlist", "index", '+' + startNumber.toString()]]);
                });
            });
        };
        this.nextTrack = function () {
            server_1.LMSRequest([_this.address, ["playlist", "index", "+1"]], function (r) {
            });
        };
        this.previousTrack = function () {
            server_1.LMSRequest([_this.address, ["playlist", "index", "-1"]], function (r) {
            });
        };
        this.PlayerStatus = function (callback) {
            server_1.LMSRequest([_this.address, ["status", "0", "10", "tags:duration,time,mode"]], function (r) {
                callback(r.result);
            });
        };
        this.ElapsedTimePerecent = function (callback) {
            server_1.LMSRequest([_this.address, ["time", "?"]], function (r) {
                callback(r.result._time);
            });
        };
        this.seek = function (seconds) {
            server_1.LMSRequest([_this.address, ["time", seconds]]);
        };
    }
    return Player;
}());
exports.Player = Player;
