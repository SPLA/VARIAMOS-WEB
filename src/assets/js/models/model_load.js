/*
To check available models go to Public/js/global_info.js
*/
let model_load = function model_load(graph,models,m_code){
    let layers = {};
    if(m_code){
        //load saved model
        let doc = mxUtils.parseXml(m_code);
        let codec = new mxCodec(doc);
        codec.decode(doc.documentElement, graph.getModel());
        
        let root = graph.getModel().getRoot();

        let maxVal = root.getChildCount();
        for (let i = 0; i < models.length; i++) {
            
            if(i<maxVal){
                let current_cell = root.getChildAt(i);
                let c_id = current_cell.getId();
                if(c_id==models[i]){
                    layers[models[i]]=current_cell;
                    if(current_cell.id == "adap_architecture"){
                        loadmodal(current_cell, graph);
                    }
                }else{
                    let valid_cell=false;
                    for (let j = 0; j < models.length; j++) {
                        if(c_id==models[j]){
                            layers[models[j]]=current_cell;
                            valid_cell=true;
                        }
                    }
                    if(!valid_cell){
                        console.log(global.messages["model_load_invalid_cell"]);
                    }
                }
            }else{
                let cell=new mxCell();
                layers[models[i]]=root.insert(cell);
                cell.setId(models[i]);
            }
        }
    }else{
        //create base model (first child represent feature model, second child component model, etc)
        let root = new mxCell();
        for (let i = 0; i < models.length; i++) {
            let m_cell =new mxCell();
            m_cell.setId(models[i]);
            layers[models[i]]=root.insert(m_cell);
        }
        graph.getModel().setRoot(root);
    }
    return layers;
}

function loadmodal(adap, graph){

    for (let i=0; i < adap.children.length; i++){
        if(adap.children[i]){
            if(adap.children[i].children){
                cargarAdap(adap.children[i], graph);
            }
            else{
                cargarAdap(adap, graph);
            }
        }
    }

    
}


function cargarAdap(adap, graph){
    for (let i=0; i < adap.children.length; i++){
        let overlay_left = null;
        let overlay_rigth = null;

        if(adap.children[i].children){
            loadmodal(adap.children[i], graph);
        }
        else if(adap.children[i] && adap.children[i].value.attributes){     
            switch (adap.children[i].value.attributes[1].value) {
                case "layer":
                    graph.removeCellOverlay(adap.children[i]);
                    overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/layer-frame.png', 16, 16), 'Overlay tooltip');
                    overlay_left.offset = new mxPoint(10,10);
                    break;
                case "module":
                    graph.removeCellOverlay(adap.children[i]);
                    overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/module-frame.png', 16, 16), 'Overlay tooltip');
                    overlay_left.offset = new mxPoint(10,10);
                    switch (adap.children[i].value.attributes[2].value) {
                        case "Parallel":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/paralelo.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "Secuential":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/secuencial.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "Ad-Hoc":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/ad-hoc.png', 16, 16), 'Overlay tooltip');
                            break;
                        default:
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/paralelo.png', 16, 16), 'Overlay tooltip');	
                            break;
                    }
                    break;
                case "package":
                    graph.removeCellOverlay(adap.children[i]);
                    overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/package.png', 16, 16), 'Overlay tooltip');
                    overlay_left.offset = new mxPoint(10,10);
                    break;
                case "device":
                    graph.removeCellOverlay(adap.children[i]);
                    overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/DEVICES.png', 16, 16), 'Overlay tooltip');
                    overlay_left.offset = new mxPoint(10,10);
                    switch (adap.children[i].value.attributes[2].value) {
                        case "Cloud Computer":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/cloud_computer.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "Local Computer":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/local_computer.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "Firmware":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/firmware.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "Electric":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/Electric.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "Electronic":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/electronic.png', 16, 16), 'Overlay tooltip');
                            break;
                        default:
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/cloud_computer.png', 16, 16), 'Overlay tooltip');
                            break;
                    }
                    break;
                case "software":
                    graph.removeCellOverlay(adap.children[i]);
                    overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/software.png', 16, 16), 'Overlay tooltip');
                    overlay_left.offset = new mxPoint(10,10);
                    switch (adap.children[i].value.attributes[2].value) {
                        case "OPSystem":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/OS.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "Midleware":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/Midleware.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "Database":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/db.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "AppWeb":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/App Web.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "AppMovil":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/App movil.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "AppStandalone":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/App Standalone.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "Embedded":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/embeded.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "APPI":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/Appi app.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "Services":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/Web services.png', 16, 16), 'Overlay tooltip');
                            break;
                        default:
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/OS.png', 16, 16), 'Overlay tooltip');
                            break;
                        }

                    break;
                case "sensor":
                    graph.removeCellOverlay(adap.children[i]);
                    overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/Sensor.png', 16, 16), 'Overlay tooltip');
                    overlay_left.offset = new mxPoint(10,10);
                    switch (adap.children[i].value.attributes[2].value) {
                        case "Digital":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/digital.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "Analog":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/analog.png', 16, 16), 'Overlay tooltip');
                            break;
        
                        default:
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/digital.png', 16, 16), 'Overlay tooltip');
                            break;
                    }
                    break;
                case "actuator":
                    graph.removeCellOverlay(adap.children[i]);
                    overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/actuator.png', 16, 16), 'Overlay tooltip');
                    overlay_left.offset = new mxPoint(10,10);
                    break;
                case "resource":
                    graph.removeCellOverlay(adap.children[i]);
                    overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/resource.png', 16, 16), 'Overlay tooltip');
                    overlay_left.offset = new mxPoint(10,10);
                    switch (adap.children[i].value.attributes[2].value) {
                        case "Cyber":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/cyber.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "Physical":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/physical.png', 16, 16), 'Overlay tooltip');
                            break;

                        default:
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/cyber.png', 16, 16), 'Overlay tooltip');
                            break;
                    }
                    break;
                case "network":
                    graph.removeCellOverlay(adap.children[i]);
                    overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/network.png', 16, 16), 'Overlay tooltip');
                    overlay_left.offset = new mxPoint(10,10);
                    switch (adap.children[i].value.attributes[2].value) {
                        case "Internet":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/internet.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "IoT":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/IoT.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "Wan":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/wan.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "Lan":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/internet.png', 16, 16), 'Overlay tooltip');
                            break;
                        default:
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/internet.png', 16, 16), 'Overlay tooltip');
                            break;
                    }
                    break;
                case "computer":
                    graph.removeCellOverlay(adap.children[i]);
                    overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/computer.png', 16, 16), 'Overlay tooltip');
                    overlay_left.offset = new mxPoint(10,10);
                    switch (adap.children[i].value.attributes[2].value) {
                        case "Cloud Computer":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/cloud_computer.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "Station Computer":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/local_computer.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "Movil Computer":
                            graph.removeCellOverlay(graph.getModel().getCell(this.name));
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/movil.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "Embeded Computer":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/firmware.png', 16, 16), 'Overlay tooltip');
                            break;
                        case "Single Board Computer":
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/singleBoard.png', 16, 16), 'Overlay tooltip');
                            break;
                        default:
                            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/cloud_computer.png', 16, 16), 'Overlay tooltip');
                            break;
                    }
                    break;
                default:
                    break;
            }
            
            if (overlay_rigth != null){
                overlay_rigth.align = mxConstants.ALIGN_RIGTH;
                overlay_rigth.verticalAlign = mxConstants.ALIGN_TOP;	
                overlay_rigth.offset = new mxPoint(-10,10);
                graph.addCellOverlay(adap.children[i], overlay_rigth);
            }
            if (overlay_left != null){
                overlay_left.align = mxConstants.ALIGN_LEFT;
                overlay_left.verticalAlign = mxConstants.ALIGN_TOP;	
                graph.addCellOverlay(adap.children[i], overlay_left);
            }   
            
        }
    }
}



export default model_load