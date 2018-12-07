var setup_buttons = function setup_buttons(graph,undoManager){
    /* begin buttonxml */
    // Adds an option to view the XML of the graph
    buttonXML.appendChild(mxUtils.button_with_icon('View XML', function()
    {
        var encoder = new mxCodec();
        var node = encoder.encode(graph.getModel());
        mxUtils.popup(mxUtils.getPrettyXml(node), true);
    },"code"));
    /* end buttonxml */

    /* begin buttonreset */
    // Adds an option to reset the graph
    var buttonRESET = document.getElementById('buttonRESET');
    buttonRESET.appendChild(mxUtils.button_with_icon('Reset', function()
    {
        graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
        var model_code = document.getElementById('model_code');
        model_code.value="";
        var event = new Event('change');
        model_code.dispatchEvent(event);
    },"eraser"));
    /* end buttonreset */

    /* begin buttonsave */
    // Adds an option to save in localstorage the graph
    var buttonSAVE = document.getElementById('buttonSAVE');
    buttonSAVE.appendChild(mxUtils.button_with_icon('Save LocalStorage', function()
    {
        var encoder = new mxCodec();
        var result = encoder.encode(graph.getModel());
        var xml = mxUtils.getXml(result);
        var model_code = document.getElementById('model_code');
        model_code.value=xml;
        var event = new Event('change');
        model_code.dispatchEvent(event);
        alert("Model saved!");
    },"save"));
    /* end buttonsave */

    var listener = function(sender, evt)
    {
        undoManager.undoableEditHappened(evt.getProperty('edit'));
    };
    graph.getModel().addListener(mxEvent.UNDO, listener);
    graph.getView().addListener(mxEvent.UNDO, listener);

    /* begin buttonUNDO */
    var buttonUNDO = document.getElementById('buttonUNDO');
    //clear undo redo history
    undoManager.clear();
    buttonUNDO.appendChild(mxUtils.button_with_icon('Undo', function()
    {
        if(undoManager.canUndo()){
            undoManager.undo();
        }
    },"undo"));
    /* end buttonUNDO */

    /* begin buttonREDO */
    var buttonREDO = document.getElementById('buttonREDO');
    buttonREDO.appendChild(mxUtils.button_with_icon('Redo', function()
    {
        if(undoManager.canRedo()){
            undoManager.redo();
        }
    },"redo"));
    /* end buttonREDO */

    /* begin buttonSHOW */
    var buttonSHOW = document.getElementById('buttonSHOW');
    buttonSHOW.appendChild(mxUtils.button_with_icon('Show', function()
    {
        mxUtils.show(graph);
    },"image"));
    /* end buttonSHOW */
}

export default setup_buttons