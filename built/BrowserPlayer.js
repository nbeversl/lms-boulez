"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserPlayer = void 0;
var howler_1 = require("howler");
var server_1 = require("./server");
var BrowserPlayer = /** @class */ (function () {
    function BrowserPlayer(proxyAddress) {
        var _this = this;
        this.address = proxyAddress;
        this.playerInstance = null;
        this.tracks = [];
        this.currentIndex = null;
        this.play = function () {
            _this.playerInstance.play();
        };
        this.pause = function () {
            if (_this.playerInstance.playing()) {
                _this.playerInstance.pause();
            }
            else {
                _this.playerInstance.play();
            }
        };
        this.playAlbum = function (albumTitle) {
            server_1.LMSRequest([_this.address, ["playlist", "loadalbum", '*', '*', albumTitle]], function (r) {
            });
        };
        this.playTrack = function (id) {
            server_1.LMSRequest([_this.address, ["playlist", "clear"]], function (r) {
                server_1.LMSRequest([_this.address, ["playlistcontrol", "cmd:add", "track_id:" + id.toString()]], function (r) {
                });
            });
        };
        this.setVolume = function (value) {
            _this.playerInstance.volume(value / 100);
        };
        this.playAlbumFromTrackAndContinue = function (track, startNumber) {
            var albumID = track.album_id;
            server_1.LMSRequest(["", ["titles", "0", "100", "album_id:" + albumID, "sort:tracknum"]], function (r) {
                startNumber = parseInt(startNumber);
                _this.currentIndex = startNumber;
                _this.tracks = r.result.titles_loop;
                _this.clearPlaylist();
                _this.playerInstance = new howler_1.Howl({
                    html5: true,
                    src: ['/music/' + _this.tracks[_this.currentIndex].id.toString() + '/download/.flac'],
                    onend: function () {
                        _this.nextTrack();
                    },
                });
                _this.playerInstance.play();
            });
        };
        this.clearPlaylist = function () {
            if (_this.playerInstance) {
                _this.playerInstance.stop();
                _this.playerInstance.unload();
            }
        };
        this.nextTrack = function () {
            _this.clearPlaylist();
            if (_this.currentIndex < _this.tracks.length) {
                _this.currentIndex++;
                _this.playerInstance._src = '/music/' + _this.tracks[_this.currentIndex].id.toString() + '/download/.flac';
                _this.playerInstance.play();
            }
        };
        this.previousTrack = function () {
            _this.clearPlaylist();
            if (_this.currentIndex > 0) {
                _this.currentIndex--;
                _this.playerInstance._src = '/music/' + _this.tracks[_this.currentIndex].id.toString() + '/download/.flac';
                _this.playerInstance.play();
            }
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
    return BrowserPlayer;
}());
exports.BrowserPlayer = BrowserPlayer;
