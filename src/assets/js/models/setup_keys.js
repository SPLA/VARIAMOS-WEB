var setup_keys = function setup_keys(keyHandler,graph,c_type){
    //allows removing elements with supr key
    keyHandler.bindKey(46, function(evt)
    {
        if (graph.isEnabled())
        {
            if(c_type=="binding"){
                alert(messages["setup_keys_remove_binding"]);
            }else{
                var removed_cells=graph.removeCells();

                //removed clons
                for (var i = 0; i < removed_cells.length; i++) {
                    if(removed_cells[i].isVertex()){
                        var clon = graph.getModel().getCell("clon"+removed_cells[i].getId());
                        console.log(clon);
                        if(clon){
                            clon.removeFromParent();
                        }
                    }
                }
            }
        }
    });

    /* zoomin, zoomout the model with ctrl + mousewheel */
    mxEvent.addMouseWheelListener(function (evt, up) {
        //Print = false;
        if (evt.ctrlKey && up) {
            graph.zoomIn();
            mxEvent.consume(evt);
        } else if (evt.ctrlKey) {
            graph.zoomOut();
            mxEvent.consume(evt);
        }
    });
}

export default setup_keys