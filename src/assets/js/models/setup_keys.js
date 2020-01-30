let setupKeys = function setupKeys(keyHandler, graph, reusedFunctions){
    //allows removing elements with supr key
    keyHandler.bindKey(46, reusedFunctions[0]);

    /* zoomin, zoomout the model with ctrl + mousewheel */
    mxEvent.addMouseWheelListener(function(evt, up){
        //Print = false;
        if(evt.ctrlKey && up){
            graph.zoomIn();
            mxEvent.consume(evt);
        }else if(evt.ctrlKey){
            graph.zoomOut();
            mxEvent.consume(evt);
        }
    });
}

export default setupKeys