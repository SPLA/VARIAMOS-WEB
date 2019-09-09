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
}

export default setup_events