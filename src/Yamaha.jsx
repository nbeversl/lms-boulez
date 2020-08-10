/* 
For XML reference and to extend, see
https://github.com/christianfl/av-receiver-docs
https://www.openhab.org/addons/bindings/yamahareceiver/ 
https://github.com/BirdAPI/yamaha-network-receivers/blob/master/yamaha_xml.py

*/

class Yamaha {
    
    constructor(ip) {
        
        this.ready = false;
        this.ip = ip;
        this.APICall = (body, callback) => {
        
            fetch(this.ip+'/YamahaRemoteControl/ctrl',
                { method: 'POST', 
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: body,
            }).then( (r) => {return r.text() })
            .then( (x) => {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(x,"text/xml");
                if (callback) { callback(xmlDoc); }
            });
        }

        this.getStatus = () => {
            var result = this.APICall('<YAMAHA_AV cmd="GET"><Main_Zone><Basic_Status>GetParam</Basic_Status></Main_Zone></YAMAHA_AV>',
            (xmlDoc) => {
           
                var power = xmlDoc.getElementsByTagName("Power")[0].textContent;
                if ( power == 'On') { this.on = true } 
                if ( power == 'Off') { this.on = false } 
                this.ready = true;
            });
            }
        
        this.getInputs = () => {
            var result = this.APICall('<YAMAHA_AV cmd="GET"><Main_Zone><Input><Input_Sel_Item>GetParam</Input_Sel_Item></Input></Main_Zone></YAMAHA_AV>',
            (xmlDoc) => {
                console.log(xmlDoc);   
            });   

        }
        this.setInput = () => {
            var result = this.APICall('<YAMAHA_AV cmd="PUT"><Main_Zone><Input><Input_Sel>AV5</Input_Sel></Input></Main_Zone></YAMAHA_AV>',
            (xmlDoc) => { 
            });   
        }

        this.TurnOn = () => {
             this.APICall('<YAMAHA_AV cmd="PUT"><Main_Zone><Power_Control><Power>On</Power></Power_Control></Main_Zone></YAMAHA_AV>')    
        }

        this.getStatus();
        this.getInputs();        
        this.TurnOn();

        setTimeout( ()=> { 
            this.setInput();
        }, 7000);
    }
}

export { Yamaha }