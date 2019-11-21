let control_verification = function control_verification()
{
  //custom verification menu options and functions
  let data=[];
  data[0]={
      "label":"Check unique  control action",
      "func":check_unique_ids
  }

  return data;

  //check that all the features (root, abstract and concrete) contain unique IDs
  function check_unique_ids(graph,c_errors,c_overlays){
    let control_root = graph.getModel().getCell("control");    
    let childs = graph.getModel().getChildVertices(control_root);
    let names = [];
    let result = "";

    //navigates through the feature model childs
    for (let i = 0; i < childs.length; i++) {
        if (childs[i].getAttribute("type") == "controlAction") {
            let label = childs[i].getAttribute("label");
            if (names.indexOf(label) > -1) {
                result+="Duplicated control action ID - " + label + "\n";
                let overlay = new mxCellOverlay(new mxImage('images/MX/error.gif', 16, 16), 'Overlay tooltip', 'right', 'top');
                graph.addCellOverlay(childs[i], overlay);
                c_errors.push(childs[i]);
                c_overlays.push(overlay);
              }else{
                names.push(label);
              }
            }
          }
     

      if(result!=""){
        alert(result);
      }else{
        alert("No errors found");
      }
    } 
}

export default control_verification