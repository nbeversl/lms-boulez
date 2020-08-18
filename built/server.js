"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LMSRequest = void 0;
var jquery_1 = __importDefault(require("jquery"));
function LMSRequest(params, callback) {
    var form_data = {
        'id': 1,
        'method': 'slim.request',
        'params': params,
    };
    jquery_1.default.post({
        headers: {
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        async: true,
        'url': '/jsonrpc.js',
        'data': JSON.stringify(form_data),
        'dataType': 'json',
        'success': callback,
    });
}
exports.LMSRequest = LMSRequest;
