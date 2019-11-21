let setupEvents = function setupEvents(graph){
    //clean previous generated events
    if(graph.eventListeners.length > 22){
        graph.eventListeners.pop(); graph.eventListeners.pop();
        graph.eventListeners.pop(); graph.eventListeners.pop();
        graph.eventListeners.pop(); graph.eventListeners.pop();
        graph.eventListeners.pop(); graph.eventListeners.pop();
    }

    //redirect to the original model when double click on a clon cell
    graph.addListener(mxEvent.DOUBLE_CLICK, function(sender, evt){
        let cell = evt.getProperty('cell');
        if(cell != null){
            if(cell.getId().includes("clon")){
                let url = document.URL;
                let n = url.lastIndexOf('/');
                let resultUrl = url.substring(0,n);
                let originalCellId = cell.getId().substring(4);
                let originalCell = graph.getModel().getCell(originalCellId);
                let parent = originalCell.getParent();
                window.location.href = resultUrl+"/"+parent.getId();
            }
        }
    });
}

export default setupEvents