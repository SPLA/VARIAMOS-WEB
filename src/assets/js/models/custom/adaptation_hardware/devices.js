let customDevices = [
    {
        name: "timer",
        digitalPins: [],
        analogPins: [],
        pwmPins: [],
        writeActions:[
            {
                "name":"reset",
                "parameters":[]
            }
        ],
        readActions:[
            {
                "name":"getTime",
                "parameters":[]
            }
        ]
    },
    {
        name: "led",
        digitalPins: [
            "D0"
        ],
        analogPins: [],
        pwmPins: [],
        writeActions:[
            {
                "name":"on",
                "parameters":[]
            },
            {
                "name":"off",
                "parameters":[]
            },
            {
                "name":"turnOnWithPower",
                "parameters":[
                    {
                        "name":"power",
                        "type":"float"
                    }
                ]
            }
        ],
    },
    {
        name: "powerLed",
        digitalPins: [],
        analogPins: [],
        pwmPins: ["P0"],
        writeActions:[
            {
                "name":"turnOn",
                "parameters":[
                    {
                        "name":"power",
                        "type":"float"
                    }
                ]
            },
            {
                "name":"turnOff",
                "parameters":[]
            },
        ],
    },
    {
        name: "rgb",
        digitalPins: [],
        analogPins: [
            "A0",
            "A1",
            "A2"
        ],
        pwmPins: []
    },
    {
        name:"button" ,
        readActions:[
            {
                "name":"isPressed",
                "parameters":[]
            }
        ],
        digitalPins: ["D0"],
        analogPins: [],
        pwmPins: []
    },
    {
        name:"switch" ,
        readActions:[
            {
                "name":"isPressed",
                "parameters":[]
            }
        ],
        digitalPins: ["D0"],
        analogPins: [],
        pwmPins: []
    },
    {
        name:"tmp36" ,
        readActions:[
            {
                "name":"getTemperature",
                "parameters":[]
            }
        ],
        digitalPins: [],
        analogPins: ["A0"],
        pwmPins: []
    },
    {
        name:"me2o2" ,
        readActions:[
            {
                "name":"getConcentration",
                "parameters":[]
            }
        ],
        digitalPins: [],
        analogPins: ["A0"],
        pwmPins: []
    },
    {
        name:"phototransistor" ,
        readActions:[
            {
                "name":"getIntensity",
                "parameters":[]
            }
        ],
        digitalPins: [],
        analogPins: ["A0"],
        pwmPins: []
    },
    {
        name:"potentiometer" ,
        readActions:[
            {
                "name":"getIntensity",
                "parameters":[]
            }
        ],
        digitalPins: [],
        analogPins: ["A0"],
        pwmPins: []
    },
    {
        name:"keyboard",
        digitalPins: [],
        analogPins: [
            "A0",
            "A1",
            "A2"
        ],
        pwmPins: []
    },
    {
        name:"piezo",
        writeActions:[
            {
                "name":"turnOn",
                "parameters":[
                    {
                        "name":"frecuency",
                        "type":"int"
                    }
                ]
            },
            {
                "name":"turnOff",
                "parameters":[]
            }
        ],
        readActions:[
            {
                name:"test",
                parameters:[
                    {
                        name:"arg1",
                        type:"int"
                    },
                    {
                        name:"arg2",
                        type:"int"
                    } ,
                    {
                        name:"arg3",
                        type:"int"
                    }  ,
                    {
                        name:"arg4",
                        type:"int"
                    }
                ]
            }
        ],
        digitalPins: ["D0"],
        analogPins: [],
        pwmPins: []
    },
    {
        name: "ledRGB",
        digitalPins: [
        ],
        analogPins: [
            "A0","A1","A2"
        ],
        pwmPins: [],
        writeActions:[
            {
                "name":"RED_on",
                "parameters":[
                    {
                        "name":"intensityRED",
                        "type":"int"
                    }
                ]
            },
            {
                "name":"GREEN_on",
                "parameters":[
                    {
                        "name":"intensityGREEN",
                        "type":"int"
                    }
                ]
            },
            {
                "name":"BLUE_on",
                "parameters":[
                    {
                        "name":"intensityBLUE",
                        "type":"int"
                    }
                ]
            },
            {
                "name":"RED_off",
                "parameters":[]
            },
            {
                "name":"GREEN_off",
                "parameters":[]
            },
            {
                "name":"BLUE_off",
                "parameters":[]
            }
        ]
    },
    {
        name: "dht11",
        digitalPins: [
        ],
        analogPins: [
            "A0"
        ],
        pwmPins: [],
        writeActions:[],
        readActions:[
            {
                name:"getTemperature",
                parameters:[]
            },
            {
                name:"getHumidity",
                parameters:[]
            }
        ]
    },
    {
        name: "motorDc",
        digitalPins: [],
        analogPins: [],
        pwmPins: ["P0"],
        readActions:[],
        writeActions:[
            {
                name:"move",
                "parameters":[
                    {
                        "name":"power",
                        "type":"float"
                    }
                ]
            } 
        ]
    },
    {
        name: "wifiHttpErazo",
        digitalPins: [],
        analogPins: [],
        pwmPins: [], 
        readActions:[
            {
                name:"process",
                "parameters":[
                    {
                        "name":"url",
                        "type":"string"
                    },
                    {
                        "name":"project",
                        "type":"string"
                    },
                    {
                        "name":"sp",
                        "type":"double"
                    },
                    {
                        "name":"y",
                        "type":"double"
                    }
                ]
            }
        ] ,
        writeActions:[
            {
                name:"init",
                "parameters":[
                    {
                        "name":"ssid",
                        "type":"string"
                    },
                    {
                        "name":"pass",
                        "type":"string"
                    }
                ]
            } 
        ]
    }
];

export function getDevices() {

    return customDevices;
}

export function getDevice(name) { 
    for(let device of customDevices) {
        if(device.name==name){
            return device;
        }
    }
    return null;
}

export function getActions(deviceName) {
    let ret=[];
    for(let device of customDevices) {
        if(device.name==deviceName){
            let actions=device.writeActions;
            if(actions!=null){
                for(let action of actions) {
                    ret.push(action.name);
                }
            }
            actions=device.readActions;
            if(actions!=null){
                for(let action of actions) {
                    ret.push(action.name);
                }
            }
        }
    }
    return ret;
}

export function getAction(deviceName, actionName) {  
    for(let device of customDevices) {
        if(device.name==deviceName){
            let actions=device.writeActions;
            if(actions!=null){
                for(let action of actions) {
                    if (action.name==actionName) {
                        return action;
                    } 
                }
            }
            actions=device.readActions;
            if(actions!=null){
                for(let action of actions) {
                    if (action.name==actionName) {
                        return action;
                    } 
                }
            }
        }
    }
    return null;
}