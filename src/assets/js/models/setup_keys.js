var setup_keys = function setup_keys(keyHandler,graph){
    //allows removing elements with supr key
    keyHandler.bindKey(46, function(evt)
    {
        if (graph.isEnabled())
        {
            graph.removeCells();
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