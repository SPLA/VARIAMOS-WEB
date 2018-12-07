var setup_buttons = function setup_buttons(graph){
    /* begin buttonxml */
    // Adds an option to view the XML of the graph
    var buttonXML = document.getElementById('buttonXML');
    buttonXML.appendChild(mxUtils.button('View XML', function()
    {
        var encoder = new mxCodec();
        var node = encoder.encode(graph.getModel());
        mxUtils.popup(mxUtils.getPrettyXml(node), true);
    }));
    /* end buttonxml */

    /* begin buttonreset */
    // Adds an option to reset the graph
    var buttonRESET = document.getElementById('buttonRESET');
    buttonRESET.appendChild(mxUtils.button('Reset', function()
    {
        graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
        var model_code = document.getElementById('model_code');
        model_code.value="";
        var event = new Event('change');
        model_code.dispatchEvent(event);
    }));
    /* end buttonreset */

    /* begin buttonsave */
    // Adds an option to save in localstorage the graph
    var buttonSAVE = document.getElementById('buttonSAVE');
    buttonSAVE.appendChild(mxUtils.button('Save Locally', function()
    {
        var encoder = new mxCodec();
        var result = encoder.encode(graph.getModel());
        var xml = mxUtils.getXml(result);
        var model_code = document.getElementById('model_code');
        model_code.value=xml;
        var event = new Event('change');
        model_code.dispatchEvent(event);
        alert("Model saved!");
    }));
    /* end buttonsave */
}

export default setup_buttons