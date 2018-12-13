var setup_buttons = function setup_buttons(graph,undoManager){
    /* begin buttonxml */
    // Adds an option to view the XML of the graph
    buttonXML.appendChild(mxUtils.button_with_icon(messages["setup_buttons_viewxml"], function()
    {
        var encoder = new mxCodec();
        var node = encoder.encode(graph.getModel());
        mxUtils.popup(mxUtils.getPrettyXml(node), true);
    },"code"));
    /* end buttonxml */

    /* begin buttonreset */
    // Adds an option to reset the graph
    var buttonRESET = document.getElementById('buttonRESET');
    buttonRESET.appendChild(mxUtils.button_with_icon(messages["setup_buttons_reset"], function()
    {
        var removed_cells = graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));

        //remove clons if exist
        for (var i = 0; i < removed_cells.length; i++) {
            if(removed_cells[i].isVertex()){
                var clon = graph.getModel().getCell("clon"+removed_cells[i].getId());
                if(clon){
                    clon.removeFromParent();
                }
            }
        }

        var encoder = new mxCodec();
        var result = encoder.encode(graph.getModel());
        var xml = mxUtils.getPrettyXml(result);
    
        var model_code = document.getElementById('model_code');
        model_code.value=xml;
        var event = new Event('change');
        model_code.dispatchEvent(event);
    },"eraser"));
    /* end buttonreset */

    /* begin buttonreset */
    // Adds an option to reset the graph
    var buttonRESETALL = document.getElementById('buttonRESETALL');
    buttonRESETALL.appendChild(mxUtils.button_with_icon(messages["setup_buttons_reset_all"], function()
    {
        model_code.value="";
        var event = new Event('change');
        model_code.dispatchEvent(event);
        location.reload();
    },"eraser"));
    /* end buttonreset */

    /* begin buttonsave */
    // Adds an option to save in localstorage the graph
    var buttonSAVE = document.getElementById('buttonSAVE');
    buttonSAVE.appendChild(mxUtils.button_with_icon(messages["setup_buttons_save"], function()
    {
        var encoder = new mxCodec();
        var result = encoder.encode(graph.getModel());
        var xml = mxUtils.getPrettyXml(result);
    
        var model_code = document.getElementById('model_code');
        model_code.value=xml;
        var event = new Event('change');
        model_code.dispatchEvent(event);
        alert(messages["setup_buttons_save_model"]);
    },"save"));

    /* begin buttonExport */
    var buttonEXPORT = document.getElementById('buttonEXPORT');
    buttonEXPORT.appendChild(mxUtils.button_with_icon(messages["setup_buttons_export"], function()
    {
        var encoder = new mxCodec();
        var result = encoder.encode(graph.getModel());
        var xml = mxUtils.getPrettyXml(result);
    
        var model_code = document.getElementById('model_code');
        model_code.value=xml;
    
        var textToSaveAsBlob = new Blob([model_code.value], {type:"text/xml"});
        var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
        var downloadLink = document.createElement("a");
        downloadLink.download = "model.xml";
        downloadLink.href = textToSaveAsURL;
        downloadLink.onclick = function(event)
        {
            document.body.removeChild(event.target);
        }
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
     
        downloadLink.click();
        
    },"upload"));
    /* end buttonExport */

    /* begin buttonImport */
    var file = document.getElementById("file")
    file.addEventListener('change', function(event) {
        var fileToLoad = file.files[0];
        var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) 
        {
            var textFromFileLoaded = fileLoadedEvent.target.result;
            var model_code = document.getElementById('model_code');
            model_code.value=textFromFileLoaded;
            var event = new Event('change');
            model_code.dispatchEvent(event);
            location.reload();
        }
        fileReader.readAsText(fileToLoad, "UTF-8");
        });

    var buttonIMPORT = document.getElementById('buttonIMPORT');
    buttonIMPORT.appendChild(mxUtils.button_with_icon(messages["setup_buttons_import"], function()
    {   
        file.click();
    },"download"));
    /* end buttonImport */

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
    buttonUNDO.appendChild(mxUtils.button_with_icon(messages["setup_buttons_undo"], function()
    {
        if(undoManager.canUndo()){
            undoManager.undo();
        }
    },"undo"));
    /* end buttonUNDO */

    /* begin buttonREDO */
    var buttonREDO = document.getElementById('buttonREDO');
    buttonREDO.appendChild(mxUtils.button_with_icon(messages["setup_buttons_redo"], function()
    {
        if(undoManager.canRedo()){
            undoManager.redo();
        }
    },"redo"));
    /* end buttonREDO */

    /* begin buttonSHOW */
    var buttonSHOW = document.getElementById('buttonSHOW');
    buttonSHOW.appendChild(mxUtils.button_with_icon(messages["setup_buttons_show"], function()
    {
        mxUtils.show(graph);
    },"image"));
    /* end buttonSHOW */
}

export default setup_buttons