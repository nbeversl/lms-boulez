"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yamaha = void 0;
var Yamaha = /** @class */ (function () {
    function Yamaha() {
        var _this = this;
        this.ready = false;
        this.APICall = function (body, callback) {
            fetch('http://10.0.0.210:8080/10.0.0.68/YamahaRemoteControl/ctrl', { method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: body,
            }).then(function (r) { return r.text(); })
                .then(function (x) {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(x, "text/xml");
                if (callback) {
                    callback(xmlDoc);
                }
            });
        };
        this.getStatus = function () {
            var result = _this.APICall('<YAMAHA_AV cmd="GET"><Main_Zone><Basic_Status>GetParam</Basic_Status></Main_Zone></YAMAHA_AV>', function (xmlDoc) {
                var power = xmlDoc.getElementsByTagName("Power")[0].textContent;
                if (power == 'On') {
                    _this.on = true;
                }
                if (power == 'Off') {
                    _this.on = false;
                }
                _this.ready = true;
            });
        };
        this.getInputs = function () {
            var result = _this.APICall('<YAMAHA_AV cmd="GET"><Main_Zone><Input><Input_Sel_Item>GetParam</Input_Sel_Item></Input></Main_Zone></YAMAHA_AV>', function (xmlDoc) {

            });
        };
        this.setInput = function () {
            var result = _this.APICall('<YAMAHA_AV cmd="PUT"><Main_Zone><Input><Input_Sel>AV5</Input_Sel></Input></Main_Zone></YAMAHA_AV>', function (xmlDoc) {
            });
        };
        this.getStatus();
        this.getInputs();
        this.TurnOn = function () {
            _this.APICall('<YAMAHA_AV cmd="PUT"><Main_Zone><Power_Control><Power>On</Power></Power_Control></Main_Zone></YAMAHA_AV>');
        };
        this.TurnOn();
        setTimeout(function () {
            _this.setInput();
        }, 7000);
    }
    return Yamaha;
}());
exports.Yamaha = Yamaha;
