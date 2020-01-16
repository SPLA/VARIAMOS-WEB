let customDevices = [
    {
        name: "led",
        digitalPins: [
            "D1"
        ],
        analogPins: [],
        pwmPins: []
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
        digitalPins: [],
        analogPins: [
            "A0",
            "A1",
            "A2"
        ],
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
        digitalPins: [],
        analogPins: [
            "A0",
            "A1",
            "A2"
        ],
        pwmPins: []
    }
];

export function getDevices() {

    return customDevices;
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