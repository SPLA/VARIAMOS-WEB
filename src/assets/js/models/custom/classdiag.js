let classMain = function classMain(graph) {
  classConstraints(graph);
  classCustomOverrides();
  let data = {};
  data["m_type"] = "normal"; //custom type
  data["m_elements"] = classElements(); //custom elements
  data["m_attributes"] = classAttributes(); //custom attributes
  data["m_relations"]= classRelations(); //custom relations
  data["m_relation_styles"] = classRelationStyles(); //custom relation styles
  data["m_properties_styles"] = classPropertiesStyles();
  data["m_constraints_relations"] = classConstraintsRelations; //custom constraints for relations
  return data;

  function classCustomOverrides() {
    graph.isHtmlLabel = function (cell) {
      return mxUtils.isNode(cell.value);
    }
  }

  function classConstraints(graph) {
    graph.multiplicities = []; //reset multiplicities
  }

  function classElements() {
    let class_elem = { src: projectPath + "images/models/feature/rectangle.png", wd: 100, hg: 30, type: "class", style: "html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", pname: "Class" };

    let elements = [];
    elements[0] = class_elem;

    return elements;
  }

  function classAttributes() {
    let attributes = [];
    attributes[0] = {
      "types": ["file"],
      "custom_attributes": [{
        "name": "filename",
        "def_value": ""
      },
      {
        "name": "destination",
        "def_value": ""
      }]
    };
    attributes[1] = {
      "types": ["fragment"],
      "custom_attributes": [{
        "name": "filename",
        "def_value": ""
      }]
    };

    return attributes;
  }

  function classRelations(){
    var relations = [];
    relations.push({
      "source":["class"],
      "rel_source_target":"and",
      "target":["class"],
      "attributes":[{
        "name":"relation",
        "def_value":"and"
      }]
    });
    return relations;
  }


  function classRelationStyles() {
    var relations = [];
    relations.push({
      "source": ["class"],
      "rel_source_target": "and",
      "target": ["class"],
      "style": "endArrow=diamond;endFill=1;endSize=10;"
    });

    return relations;
  }

  function classPropertiesStyles(){
    const styles = {};
    styles["rel_class_class"] = [{
      "attribute":"relation",
      "input_type": "select",
      "input_values": 
        [
          "Composition", 
          "Aggregation", 
          "Inheritance", 
          "Association"
        ],
      "onchange": changeRelStyle
    }]
    return styles;
  }

  function changeRelStyle(){
    const currentCell = graph.getModel().getCell(this.name);
    graph.getModel().beginUpdate();
    try{
      let styleArrow = "";
      let styleFill = "";
      switch(this.value){
        case "Composition":
          styleArrow = "diamond";
          styleFill = "1";
          break;
        case "Aggregation":
          styleArrow = "diamond";
          styleFill = "0"
          break;
        case "Inheritance":
          styleArrow = "block";
          styleFill = "0";
          break;
        case "Association":
          styleArrow = "none";
          styleFill = "none";
          break;
      }
      graph.setCellStyles(mxConstants.STYLE_ENDARROW, styleArrow, [currentCell]);
      graph.setCellStyles(mxConstants.STYLE_ENDFILL, styleFill, [currentCell]);
    } finally {
      graph.getModel().endUpdate();
    }
  }

  function classConstraintsRelations(graph, source, target) {
    //only one custom file per class
    if (target.getAttribute("type") == "class" && source.getAttribute("type") == "custom") {
      let targetId = target.getId();
      let incoEgdes = graph.getModel().getIncomingEdges(graph.getModel().getCell(targetId));
      for (let j = 0; j < incoEgdes.length; j++) {
        if (incoEgdes[j].source.getAttribute("type") == "custom") {
          alert("Invalid connection only one custom. file can be linked for this class");
          return false;
        }
      }
    }

    //fragment can be only linked with one class
    if (target.getAttribute("type") == "class" && source.getAttribute("type") == "fragment") {
      let sourceId = source.getId();
      let outEgdes = graph.getModel().getOutgoingEdges(graph.getModel().getCell(sourceId));
      for (let j = 0; j < outEgdes.length; j++) {
        if (outEgdes[j].target.getAttribute("type") == "class") {
          alert("Invalid connection one fragment can be only linked with one class");
          return false;
        }
      }
    }

    return true;
  }

}

export default classMain