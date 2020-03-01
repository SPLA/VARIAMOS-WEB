import {getDevices} from '../adaptation_hardware/devices'
import {getActions} from '../adaptation_hardware/devices'

let setup_events = function setup_events(graph){
    //clean previous generated events
    if(graph.eventListeners.length>22){
        graph.eventListeners.pop();graph.eventListeners.pop();
        graph.eventListeners.pop();graph.eventListeners.pop();
        graph.eventListeners.pop();graph.eventListeners.pop();
        graph.eventListeners.pop();graph.eventListeners.pop();
    }
    //redirect to the original model when double click on a clon cell
    graph.addListener(mxEvent.DOUBLE_CLICK, function(sender, evt){ 
        let cell = evt.getProperty('cell');
        if (cell!=null){
            if(cell.getId().includes("clon")){
                let url = document.URL;
                let n = url.lastIndexOf('/');
                let result_url = url.substring(0,n);
                let original_cell_id = cell.getId().substring(4);
                let original_cell = graph.getModel().getCell(original_cell_id);
                let parent = original_cell.getParent();
                window.location.href = result_url+"/"+parent.getId();
            }
        }
    });
    graph.addListener(mxEvent.CLICK, function(sender, evt){ 
        let cell = evt.getProperty('cell');
        if (cell!=null){ 
            updatePalette(cell);
        }
    });
    updateActionsPalette('asdf');

    function updatePalette(cell){
        let subType=null;
        let type=cell.getAttribute("type");
        if(type=='device'){
            subType=cell.getAttribute("subtype"); 
        }
        updateActionsPalette(subType);
    }
    function updateActionsPalette(subtype){ 
        let actions=getActions(subtype);  
        let tbContainer = document.getElementById('tbContainer');
        let children=tbContainer.childNodes;
        for(let child of children) {
            let html=child.innerHTML;
            if(html.indexOf('readAction') !== -1 || html.indexOf('writeAction') !== -1){
                let image=child.childNodes[1];
                let title=image.getAttribute('title');
                let style = ""; 
                if(!actions.includes(title)){
                    style = "display:none;";
                }
                child.setAttribute("style", style);
            }
        }
    }
}

export default setup_events