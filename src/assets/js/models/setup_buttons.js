
import * as svgpng from 'save-svg-as-png';
let setup_buttons = function setup_buttons(graph,undoManager,reused_functions,route_pare,store){
    /* begin buttonxml */
    // Adds an option to view the XML of the graph
    let buttonXML = document.getElementById('buttonXML');
    buttonXML.innerHTML="";
    buttonXML.appendChild(mxUtils.button_with_icon(global.messages["setup_buttons_viewxml"], function()
    {
        let encoder = new mxCodec();
        let node = encoder.encode(graph.getModel());
        mxUtils.popup(mxUtils.getPrettyXml(node), true);
    },"code"));
    /* end buttonxml */

    /* begin buttonreset */
    // Adds an option to reset the graph
    let buttonRESET = document.getElementById('buttonRESET');
    buttonRESET.innerHTML="";
    buttonRESET.appendChild(mxUtils.button_with_icon(global.messages["setup_buttons_reset"], function()
    {

        let conf =  confirm("Are you sure you want to delete the current model?");
        if(conf){
            let removed_cells = graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));

            //remove clons if exist
            for (let i = 0; i < removed_cells.length; i++) {
                if(removed_cells[i].isVertex()){
                    let clon = graph.getModel().getCell("clon"+removed_cells[i].getId());
                    if(clon){
                        clon.removeFromParent();
                    }
                }
            }

            let encoder = new mxCodec();
            let result = encoder.encode(graph.getModel());
            let xml = mxUtils.getPrettyXml(result);
        
            let model_code = document.getElementById('model_code');
            model_code.value=xml;
            let event = new Event('change');
            model_code.dispatchEvent(event);
        }
    },"eraser"));
    /* end buttonreset */

    /* begin buttonreset */
    // Adds an option to reset the graph
    let buttonRESETALL = document.getElementById('buttonRESETALL');
    buttonRESETALL.innerHTML="";
    buttonRESETALL.appendChild(mxUtils.button_with_icon(global.messages["setup_buttons_reset_all"], function()
    {
        let conf =  confirm("Are you sure you want to delete all models?");

        if(conf){
            model_code.value="";
            let event = new Event('change');
            model_code.dispatchEvent(event);
            store.dispatch('updatecacheselected', []);
            location.reload();
        }
    },"eraser"));
    /* end buttonreset */

    /* begin buttonsave */
    // Adds an option to save in localstorage the graph
    let buttonSAVE = document.getElementById('buttonSAVE');
    buttonSAVE.innerHTML="";
    buttonSAVE.appendChild(mxUtils.button_with_icon(global.messages["setup_buttons_save"], function()
    {
        let encoder = new mxCodec();
        let result = encoder.encode(graph.getModel());
        let xml = mxUtils.getPrettyXml(result);
    
        let model_code = document.getElementById('model_code');
        model_code.value=xml;
        let event = new Event('change');
        model_code.dispatchEvent(event);
    },"save"));
    /* end buttonsave */

    /* begin buttonExport */
    let buttonEXPORT = document.getElementById('buttonEXPORT');
    buttonEXPORT.innerHTML="";
    buttonEXPORT.appendChild(mxUtils.button_with_icon(global.messages["setup_buttons_export"], function()
    {
        let encoder = new mxCodec();
        let result = encoder.encode(graph.getModel());
        let xml = mxUtils.getPrettyXml(result);
    
        let model_code = document.getElementById('model_code');
        model_code.value=xml;
    
        let textToSaveAsBlob = new Blob([model_code.value], {type:"text/xml"});
        let textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
        let downloadLink = document.createElement("a");
        downloadLink.download = route_pare.project + "_" + route_pare.folder + "_" + "model.xml";
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
    let file = document.getElementById("file");
    file.addEventListener('change', function(event) {
        let fileToLoad = file.files[0];
        let fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) 
        {
            let textFromFileLoaded = fileLoadedEvent.target.result;
            let model_code = document.getElementById('model_code');
            model_code.value=textFromFileLoaded;
            let event = new Event('change');
            model_code.dispatchEvent(event);
            location.reload();
        }
        fileReader.readAsText(fileToLoad, "UTF-8");
        });

    let buttonIMPORT = document.getElementById('buttonIMPORT');
    buttonIMPORT.innerHTML="";
    buttonIMPORT.appendChild(mxUtils.button_with_icon(global.messages["setup_buttons_import"], function()
    {   
        store.dispatch('updatecacheselected', []);
        file.click();
    },"download"));
    /* end buttonImport */

    let listener = function(sender, evt)
    {
        undoManager.undoableEditHappened(evt.getProperty('edit'));
    };
    graph.getModel().addListener(mxEvent.UNDO, listener);
    graph.getView().addListener(mxEvent.UNDO, listener);

    /* begin buttonUNDO */
    let buttonUNDO = document.getElementById('buttonUNDO');
    buttonUNDO.innerHTML="";
    buttonUNDO.appendChild(mxUtils.button_with_icon(global.messages["setup_buttons_undo"], function()
    {
        if(undoManager.canUndo()){
            undoManager.undo();
        }
    },"undo"));
    /* end buttonUNDO */

    /* begin buttonREDO */
    let buttonREDO = document.getElementById('buttonREDO');
    buttonREDO.innerHTML="";
    buttonREDO.appendChild(mxUtils.button_with_icon(global.messages["setup_buttons_redo"], function()
    {
        if(undoManager.canRedo()){
            undoManager.redo();
        }
    },"redo"));
    /* end buttonREDO */

    /* begin buttonSHOW */
    let buttonSHOW = document.getElementById('buttonSHOW');
    buttonSHOW.innerHTML="";
    buttonSHOW.appendChild(mxUtils.button_with_icon(global.messages["setup_buttons_show"], function()
    {
        let preview = new mxPrintPreview(graph, 1);
		preview.open();
    },"print"));
    /* end buttonSHOW */

    /* begin buttonDELETE */
    let buttonDELETE = document.getElementById('buttonDELETE');
    buttonDELETE.innerHTML="";
    buttonDELETE.appendChild(mxUtils.button_with_icon(global.messages["setup_buttons_delete"], reused_functions[0],"cut"));
    /* end buttonDELETE */


    /* begin buttonPONE print as IMG */
    let buttonPONE = document.getElementById('buttonPONE');
    buttonPONE.innerHTML="";
    buttonPONE.appendChild(mxUtils.button_with_icon(global.messages["setup_buttons_img"],function(evt){
        const svg = document.getElementById('graphContainer').firstElementChild;
        svgpng.saveSvgAsPng(svg, "diagram.png");
    },"print"));
    /* end buttonPONE */


    /* begin buttonZIN */
    let buttonZIN = document.getElementById('buttonZIN');
    buttonZIN.innerHTML="";

    buttonZIN.appendChild(mxUtils.button(global.messages["setup_buttons_zin"],function(evt){graph.zoomIn();}));

    /* end buttonZIN */

    /* begin buttonZOUT */
    let buttonZOUT = document.getElementById('buttonZOUT');
    buttonZOUT.innerHTML="";

    buttonZOUT.appendChild(mxUtils.button(global.messages["setup_buttons_zout"],function(evt){graph.zoomOut();}));

    /* end buttonZOUT */

    /* begin buttonZR */
    let buttonZR = document.getElementById('buttonZR');
    buttonZR.innerHTML="";

    buttonZR.appendChild(mxUtils.button(global.messages["setup_buttons_zr"],function(evt){graph.view.scaleAndTranslate(1, 0, 0);}));

    /* end buttonZR */
}

export default setup_buttons