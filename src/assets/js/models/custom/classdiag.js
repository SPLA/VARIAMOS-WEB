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

    graph.isCellSelectable = function(cell)
    {
      let state = this.view.getState(cell);
      let style = (state != null) ? state.style : this.getCellStyle(cell);

      return this.isCellsSelectable() && !this.isCellLocked(cell) && style['selectable'] != 0;
    };

    // Selects descendants before children selection mode
		const graphHandlerGetInitialCellForEvent = mxGraphHandler.prototype.getInitialCellForEvent;
		mxGraphHandler.prototype.getInitialCellForEvent = function(me)
		{
      let cell = graphHandlerGetInitialCellForEvent.apply(this, arguments);
      const model = this.graph.getModel();
      const parent = model.getParent(cell);
      const parentType = parent.getAttribute('type');
			
      if (cell !== null && parent !== null) {
        if (parentType === 'class'){
          cell = parent;
        } else if (['class_attributes', 'class_methods'].includes(parentType)) {
          cell = model.getParent(parent);
        }
			}
			
			return cell;
		};
  }

  function classConstraints(graph) {
    graph.multiplicities = []; //reset multiplicities
    graph.multiplicities.push(new mxMultiplicity(true,"file",null,null,0,1,
      ["class"],
      "Only 1 class allowed","Only class targets allowed"));
  }

  function classElements() {
    let class_elem = { src: projectPath + "images/models/feature/rectangle.png", wd: 100, hg: 100, type: "class", style: "html=1;whiteSpace=wrap;overflow=visible;fontColor=black;fillColor=none;strokeColor=#000000;strokeWidth=5;", pname: "Class" };
    let file = {src:projectPath + "images/models/component/file.png", wd:100, hg:40, style:"shape=file", type:"file", pname:"File"};
    let elements = [];
    elements.push(class_elem);
    elements.push(file);

    return elements;
  }

  function classAttributes() {
    let attributes = [];
    attributes.push({
      "types": ["class"],
      "custom_attributes": [{
        "name": "name",
        "def_value": ""
      }]
    });

    return attributes;
  }

  function classRelations(){
    let relations = [];
    relations.push({
      "source":["class"],
      "rel_source_target":"and",
      "target":["class"],
      "attributes":[{
        "name":"relation",
        "def_value":"and"
      }]
    });
    relations.push({
      "source":["file"],
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
    let relations = [];
    relations.push({
      "source": ["class"],
      "rel_source_target": "and",
      "target": ["class"],
      "style": "endArrow=diamond;endFill=1;endSize=10;"
    });
    relations.push({
      "source": ["file"],
      "rel_source_target": "and",
      "target": ["class"],
      "style": "endArrow=none;dashed=1;"
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
    }];
    styles["class"] = [{
      "attribute":"name",
      "input_type":"text",
      "onchange": setDisplayName
    }];
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

  function setDisplayName(){
    const currentCell = graph.getModel().getCell(this.name);
    if(currentCell.getAttribute('type') === 'class'){
      const nameContainer = currentCell.getChildAt(0);
      graph.getModel().beginUpdate();
        try{
          let edit = new mxCellAttributeChange(
            nameContainer, 'label',
            this.value);
          graph.getModel().execute(edit);
        }
        finally{
          graph.getModel().endUpdate();
        }
    }
  }

  function classConstraintsRelations(graph, source, target) {
    //only one custom file per class
    if (target.getAttribute("type") == "file" && source.getAttribute("type") == "class") {
      alert("Classes may not connect to notes, it must be in the other direction");
      return false;
    }

    return true;
  }

}

export default classMain