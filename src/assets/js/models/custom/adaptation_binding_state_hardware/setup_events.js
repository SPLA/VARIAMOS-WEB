let setup_events = function setup_events(graph) {
    //clean previous generated events
    if (graph.eventListeners.length > 22) {
        graph.eventListeners.pop(); graph.eventListeners.pop();
        graph.eventListeners.pop(); graph.eventListeners.pop();
        graph.eventListeners.pop(); graph.eventListeners.pop();
        graph.eventListeners.pop(); graph.eventListeners.pop();
    }
    //redirect to the original model when double click on a clon cell
    graph.addListener(mxEvent.DOUBLE_CLICK, function (sender, evt) {
        let cell = evt.getProperty('cell');
        if (cell != null) {
            if (cell.getId().includes("clon")) {
                let url = document.URL;
                let n = url.lastIndexOf('/');
                let result_url = url.substring(0, n);
                let original_cell_id = cell.getId().substring(4);
                let original_cell = graph.getModel().getCell(original_cell_id);
                let parent = original_cell.getParent();
                window.location.href = result_url + "/" + parent.getId();
            }
            else {
                var type = cell.getAttribute("type");
                if (type == "controlAction") {
                    openControlModel(cell);
                }
            }
        }
    });

    function openControlModel(controlAction) {
        // let hidControlAction = document.getElementById('hidControlAction');
        // if (!hidControlAction) {
        //     hidControlAction = document.createElement("input");
        //     hidControlAction.setAttribute("type", "hidden");
        //     hidControlAction.setAttribute("id", "hidControlAction");
        //     let tbContainer = document.getElementById('tbContainer');
        //     tbContainer.appendChild(hidControlAction);
        // }
        // hidControlAction.value = controlAction;

        // let url = "http://localhost:8080/variamosweb#/models/Luz%20controlada/Application-Luzcontrolada-1/control?controlAction=control_led_1";
        // url = document.URL;
        // url = url.replace("adaptation_binding_state_hardware", "control");
        // url = url + "?controlAction="+controlAction.getAttribute("label"); 
        // //alert(url);
        // window.location = url;

        localStorage['adaptation_binding_state_hardware_controlAction']=controlAction.getAttribute("label");
        //alert(localStorage['adaptation_binding_state_hardware_controlAction']);
        let url = document.URL;
        url = url.replace("adaptation_binding_state_hardware", "control");
        window.location = url; 
    }
}

export default setup_events