let classMain = function classMain(graph) {
  classConstraints(graph);
  classCustomOverrides();
  let data = {};
  data["m_type"] = "normal"; //custom type
  data["m_elements"] = classElements(); //custom elements
  data["m_attributes"] = classAttributes(); //custom attributes
  data["m_relation_styles"] = classRelationStyles(); //custom relation styles
  data["m_constraints_relations"] = classConstraintsRelations; //custom constraints for relations
  return data;

  function classCustomOverrides() {
    graph.isHtmlLabel = function (cell) {
      return mxUtils.isNode(cell.value);
    }
  }

  function classConstraints(graph) {
    graph.multiplicities = []; //reset multiplicities
    graph.multiplicities.push(new mxMultiplicity(
      true, "class", null, null, 0, 0, null,
      "Invalid connection",
      "Only shape targets allowed"));
    graph.multiplicities.push(new mxMultiplicity(
      true, "file", null, null, 0, 1, ["class"],
      "Invalid connection",
      "Only shape targets allowed"));
    graph.multiplicities.push(new mxMultiplicity(
      true, "custom", null, null, 0, 1, ["class"],
      "Invalid connection",
      "Only shape targets allowed"));
    graph.multiplicities.push(new mxMultiplicity(
      true, "fragment", null, null, 0, null, ["file", "class"],
      "Invalid connection",
      "Only shape targets allowed"));
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


  function classRelationStyles() {
    var relations = [];
    relations.push({
      "source": ["fragment"],
      "rel_source_target": "and",
      "target": ["file"],
      "style": "dashed=1;endArrow=open;strokeColor=red;"
    });

    return relations;
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