var setup_keys = function setup_keys(keyHandler,graph){
    //allows removing elements with supr key
    keyHandler.bindKey(46, function(evt)
    {
        if (graph.isEnabled())
        {
            graph.removeCells();
        }
    });
}

export default setup_keys