let setup_devices = function setup_devices(){
    let customDevices = [
        {
            "name":"piezo",
            "writeActions":[
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
            "readActions":[
                {
                    "name":"isOn",
                    "parameters":[]
                },
                {
                    "name":"isOff",
                    "parameters":[]
                },{
                    "name":"test",
                    "parameters":[
                        {
                            "name":"arg1",
                            "type":"int"
                        },
                        {
                            "name":"arg2",
                            "type":"int"
                        } ,
                        {
                            "name":"arg3",
                            "type":"int"
                        }  ,
                        {
                            "name":"arg4",
                            "type":"int"
                        }  
                    ]
                }
            ]
        } 
    ];

    function getDevices()
	{
        return customDevices;
    }
}

export default setup_devices