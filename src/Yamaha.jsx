class Yamaha {
    
    constructor() {
        
        this.ready = false;
        this.APICall = (body, callback) => {

            fetch('http://10.0.0.210:8080/10.0.0.68/YamahaRemoteControl/ctrl',
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
        this.getStatus();
        this.getInputs();
        this.TurnOn = () => {
             this.APICall('<YAMAHA_AV cmd="PUT"><Main_Zone><Power_Control><Power>On</Power></Power_Control></Main_Zone></YAMAHA_AV>')    
        }
        
        this.TurnOn();
        setTimeout( ()=> { 
            this.setInput();
        }, 7000);
    }
}

export { Yamaha }