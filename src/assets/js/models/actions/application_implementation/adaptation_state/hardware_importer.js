import { createElement } from '@/assets/js/common/graphutils';
import { getElementsByType } from '@/assets/js/common/graphutils';
import { getBoard } from "@/assets/js/models/custom/adaptation_hardware/boards.js";
import { getDevice } from "@/assets/js/models/custom/adaptation_hardware/devices.js";

var hardware_importer = function hardware_importer(graph) {
    this.graph = graph;
}

hardware_importer.prototype.importFromArchitectureModel = function () {
    this.importFromArchitectureModelReal();
};

hardware_importer.prototype.generateHardwareFromArchitecture = function () {
    let computers=getElementsByType(this.graph,"adaptation_architecture", "computer");
    if(computers){
        for (let index = 0; index < computers.length; index++) {
            const computer = computers[index];
            const subType = "ArduinoUNO"; //computer.getAttribute("board");
            const label =computer.getAttribute("label");
            this.createElement("board", subType, label, 100, 200);
        }
    }

    let devices=getElementsByType(this.graph,"adaptation_architecture", "device");
    if(devices){ 
        for (let index = 0; index < devices.length; index++) {
            const device = devices[index];
            const subType = device.getAttribute("label"); //computer.getAttribute("subType");
            const label =device.getAttribute("label");
            this.createElement("device", subType, label, 100, 200); 
        }
    }
};

hardware_importer.prototype.importFromArchitectureModelTest = function () {
    this.createElement("board", "ArduinoUNO", "board", 100, 200);
    this.createElement("device", "button", "button", 100, 50);
    this.createElement("device", "led", "ledRed", 250, 50);
    this.createElement("device", "led", "ledGreen", 400, 50);
};

hardware_importer.prototype.importFromArchitectureModelReal = function () {
    this.importFromArchitectureReferenceModel();

    // let computers=getElementsByType(this.graph,"adap_architecture", "computer");
    // if(computers){
    //     for (let index = 0; index < computers.length; index++) {
    //         const computer = computers[index];
    //         const subType = "ArduinoUNO"; //computer.getAttribute("board");
    //         const label =computer.getAttribute("label");
    //         this.createElement("board", subType, label, 100, 200);
    //     }
    // }

    // let devices=getElementsByType(this.graph,"adap_architecture", "device");
    // if(devices){
    //     for (let index = 0; index < devices.length; index++) {
    //         const devices = devices[index];
    //         const subType = computer.getAttribute("label"); //computer.getAttribute("subType");
    //         const label =computer.getAttribute("label");
    //         this.createElement("device", subType, label, 100, 200);
    //     }
    // }
 
    // this.createElement("board", "ArduinoUNO", "board", 100, 200);
    // this.createElement("device", "button", "button", 100, 50);
    // this.createElement("device", "led", "led", 250, 50); 
};

hardware_importer.prototype.importFromArchitectureReferenceModel = function () {
    let project="LedBoton5";
    let xmlDomain=localStorage["Domain - " + project];
    if(!xmlDomain){
        return;
    } 
    let tmp="<mxCell id=\"adap_architecture\" parent=\"0\" visible=\"0\"/>"; 
    let p1=xmlDomain.indexOf(tmp);
    if(p1>-1){
        p1+=55; 
    }else{
        tmp="<mxCell id=\"adap_architecture\" parent=\"0\"/>"; 
        p1=xmlDomain.indexOf(tmp);
        if(p1>-1){
            p1+=43; 
        }else{
            return;
        }
    }
    let p2=xmlDomain.indexOf("<mxCell id=\"adaptation_architecture\" parent=\"0\" visible=\"0\"/>");
    let xmlArch=xmlDomain.substring(p1, p2-5);
    xmlArch=xmlArch.replace(/adap_architecture/g, "adaptation_architecture");
    
    let xmlApplication=localStorage["Application - " + project + " - 1"];
    if(!xmlApplication){
        return;
    } 
    tmp="<mxCell id=\"adaptation_architecture\" parent=\"0\"/>"
    p1=xmlApplication.indexOf(tmp);
    if(p1<0){
        tmp="<mxCell id=\"adaptation_architecture\" parent=\"0\" visible=\"0\"/>"
    } 
    xmlApplication= xmlApplication.replace(tmp, tmp + xmlArch);
    
    localStorage["Application - " + project + " - 1"]=xmlApplication;


    let textFromFileLoaded = xmlApplication;
    let model_code = document.getElementById('model_code');
    model_code.value=textFromFileLoaded;
    let event = new Event('change');
    model_code.dispatchEvent(event);
    location.reload(); 
    this.graph.refresh();
};

hardware_importer.prototype.createElement = function (type, subType, label, x, y) {
    let doc = mxUtils.createXmlDocument();
    let node = doc.createElement(type);
    node.setAttribute('label', label);
    node.setAttribute('type', type);
    node.setAttribute('subtype', subType);

    let digitalPins = [];
    let analogPins = [];
    let pwmPins = [];

    let style = "shape=device";
    let w = 100;
    let h = 35;
    let clonModel = null;

    if (["board"].includes(type)) {
        let boardName = subType;
        let board = getBoard(boardName);
        digitalPins = board.digitalPins;
        analogPins = board.analogPins;
        pwmPins = board.pwmPins;
        node.setAttribute('boardType', subType);
        style = "shape=board";
        w = 280;
        h = 180;
    }

    if (["device"].includes(type)) {
        let deviceName = subType;
        let device = getDevice(deviceName);
        digitalPins = device.digitalPins;
        analogPins = device.analogPins;
        pwmPins = device.pwmPins;
        clonModel = "adaptation_behavior_hardware";
    }

    let vertex = new mxCell(node, new mxGeometry(0, 0, w, h), style);
    vertex.setConnectable(true);
    vertex.setVertex(true);

    let graph = this.graph;
    let newCells = createElement(graph, vertex, null, x, y);
    newCells.forEach(element => {

        let x = 10;
        let y = 24;
        if (digitalPins) {
            //x = 10;
            //y += 20;
            let args = digitalPins;
            for (let a = 0; a < args.length; a++) {
                let arg = args[a];
                const doc = mxUtils.createXmlDocument();
                const node = doc.createElement(arg);
                node.setAttribute('label', arg);
                node.setAttribute('type', "digital");
                //node.setAttribute('type', class_name_type);

                let geometry = new mxGeometry(x, y, 7.5, 7.5);
                geometry.offset = new mxPoint(0, 0);
                geometry.relative = false;
                let connector = new mxCell(node, geometry, "shape=ellipse;perimeter=ellipsePerimeter;direction=north");
                graph.setCellStyles(mxConstants.STYLE_MOVABLE, '0', [connector]);
                graph.setCellStyles(mxConstants.STYLE_RESIZABLE, '0', [connector]);
                connector.setConnectable(true);
                connector.setVertex(true);

                graph.addCell(connector, element);
                x += 15;
            }
        }

        if (analogPins) {
            //x = 10;
            //y += 20;
            let args = analogPins;
            for (let a = 0; a < args.length; a++) {
                let arg = args[a];
                const doc = mxUtils.createXmlDocument();
                const node = doc.createElement(arg);
                node.setAttribute('label', arg);
                node.setAttribute('type', "analog");

                let geometry = new mxGeometry(x, y, 7.5, 7.5);
                geometry.offset = new mxPoint(0, 0);
                geometry.relative = false;
                let connector = new mxCell(node, geometry, "shape=ellipse;perimeter=ellipsePerimeter;direction=north");
                graph.setCellStyles(mxConstants.STYLE_MOVABLE, '0', [connector]);
                graph.setCellStyles(mxConstants.STYLE_RESIZABLE, '0', [connector]);
                connector.setConnectable(true);
                connector.setVertex(true);

                graph.addCell(connector, element);
                x += 15;
            }
        }

        if (pwmPins) {
            //x = 10;
            //y += 20;
            let args = pwmPins;
            for (let a = 0; a < args.length; a++) {
                let arg = args[a];
                const doc = mxUtils.createXmlDocument();
                const node = doc.createElement(arg);
                node.setAttribute('label', arg);
                node.setAttribute('type', "pwm");
                //node.setAttribute('type', class_name_type);

                let geometry = new mxGeometry(x, y, 7.5, 7.5);
                geometry.offset = new mxPoint(0, 0);
                geometry.relative = false;
                let connector = new mxCell(node, geometry, "shape=ellipse;perimeter=ellipsePerimeter;direction=north");
                graph.setCellStyles(mxConstants.STYLE_MOVABLE, '0', [connector]);
                graph.setCellStyles(mxConstants.STYLE_RESIZABLE, '0', [connector]);
                connector.setConnectable(true);
                connector.setVertex(true);

                graph.addCell(connector, element);
                x += 15;
            }
        }


    });

    //execute if there are clons for the current element
    if (clonModel != null) {
        graph.getModel().prefix = "clon"; //cloned cell contains clon prefix
        graph.getModel().nextId = graph.getModel().nextId - 1;
        let vertex2 = graph.getModel().cloneCell(newCells[0]);
        let parent2 = graph.getModel().getCell(clonModel);
        graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#DCDCDC", [vertex2]); //different background for a cloned cell
        graph.importCells([vertex2], 0, 0, parent2);
        graph.getModel().prefix = ""; //restart prefix
    }

};

hardware_importer.prototype.createBoard = function (subType, label, x, y) {
    let type = "board";
    let doc = mxUtils.createXmlDocument();
    let node = doc.createElement(type);
    node.setAttribute('label', label);
    node.setAttribute('type', type);
    node.setAttribute('boardType', subType);
    node.setAttribute('subType', subType);

    let w = 280;
    let h = 180;
    let style = "shape=device";
    let vertex = new mxCell(node, new mxGeometry(0, 0, w, h), style);
    vertex.setConnectable(true);
    vertex.setVertex(true);

    createElement(this.graph, vertex, null, x, y);

};

hardware_importer.prototype.createDevice = function (subType, label, x, y) {
    let type = "device";
    let doc = mxUtils.createXmlDocument();
    let node = doc.createElement(type);
    node.setAttribute('label', label);
    node.setAttribute('type', type);
    node.setAttribute('subType', subType);

    let w = 100;
    let h = 35;
    let style = "shape=device";
    let vertex = new mxCell(node, new mxGeometry(0, 0, w, h), style);
    vertex.setConnectable(true);
    vertex.setVertex(true);

    createElement(this.graph, vertex, null, x, y);

};


export default hardware_importer;