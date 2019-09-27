let feature_verification = function feature_verification()
{
  //custom verification menu options and functions
  let data=[];
  data[0]={
      "label":"Check unique feature IDs",
      "func":check_unique_ids
  }

  return data;

  //check that all the features (root, abstract and concrete) contain unique IDs
  function check_unique_ids(graph,c_errors,c_overlays){
    let feature_root = graph.getModel().getCell("feature");    
    let childs = graph.getModel().getChildVertices(feature_root);
    let names = [];
    let result = "";

    //navigates through the feature model childs
    for (let i = 0; i < childs.length; i++) {
      let label = childs[i].getAttribute("label");
      if (names.indexOf(label) > -1) {
          result+="Duplicated feature ID - " + label + "\n";
          let overlay = new mxCellOverlay(new mxImage('images/MX/error.gif', 16, 16), 'Overlay tooltip', 'right', 'top');
          graph.addCellOverlay(childs[i], overlay);
          c_errors.push(childs[i]);
          c_overlays.push(overlay);
        }else{
          names.push(label);
        }
      }

      if(result!=""){
        alert(result);
      }else{
        alert("No errors found");
      }
  }
}

export default feature_verification