let component_verification = function component_verification()
{
  //custom verification menu options and functions
  let data=[];
  data[0]={
      "label":"Hide all fragment alter relations",
      "func":hide_fragment_rel
  };
  data[1]={
    "label":"Show all fragment alter relations",
    "func":show_fragment_rel
  };
  data[2]={
    "label":"Show alter relations for current fragment",
    "func":show_fragment_rel_selected
  };

  return data;

  function hide_fragment_rel(graph,c_errors,c_overlays){
    let component_root = graph.getModel().getCell("component");    
    let childs = graph.getModel().getChildEdges(component_root);

    for (let i = 0; i < childs.length; i++) {
      if(childs[i].getValue().nodeName=="rel_fragment_file"){
        childs[i].setVisible(false);
      }
    }
    graph.refresh();
  }

  function show_fragment_rel(graph,c_errors,c_overlays){
    let component_root = graph.getModel().getCell("component");    
    let childs = graph.getModel().getChildEdges(component_root);

    for (let i = 0; i < childs.length; i++) {
      if(childs[i].getValue().nodeName=="rel_fragment_file"){
        childs[i].setVisible(true);
      }
    }
    graph.refresh();
  }

  function show_fragment_rel_selected(graph,c_errors,c_overlays){

    let cell = graph.getSelectionCell(); 
    if(cell==null){
      alert("Please select a valid fragment");
    }else{
      if(!cell.getAttribute("type")=="fragment"){
        alert("Please select a valid fragment");
      }else{
        let component_root = graph.getModel().getCell("component");    
        let childs = graph.getModel().getChildEdges(component_root);

        for (let i = 0; i < childs.length; i++) {
          if(childs[i].getValue().nodeName=="rel_fragment_file"){
            childs[i].setVisible(false);
          }
        }

        let childs_current = graph.getModel().getOutgoingEdges(cell);
        for (let i = 0; i < childs_current.length; i++) {
          if(childs_current[i].getValue().nodeName=="rel_fragment_file"){
            childs_current[i].setVisible(true);
          }
        }

        graph.refresh();
      }

    }
  }
}

export default component_verification