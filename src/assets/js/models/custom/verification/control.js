let control_verification = function control_verification()
{
  //custom verification menu options and functions
  let data=[];
  data[0]={
      "label":"Check unique  target system",
      "func":check_unique_ids
  }
  data[1]={
    "label":"test",
    "func":collap
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
        if (childs[i].getAttribute("type") == "target_system") {
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
          }
     

      if(result!=""){
        alert(result);
      }else{
        alert("No errors found");
      }
  }


  function collap(graph)
  {
  var binding_root = graph.getModel().getCell("control");    
        var control_relations = graph.getModel().getChildEdges(binding_root);

        var customizations = [];

        for (var i = 0; i < control_relations.length; i++) {
            var source = control_relations[i].source;
            var target = control_relations[i].target;
            if(source.getAttribute("type")=="target_system"  || source.getAttribute("type")=="summing_point" || source.getAttribute("type")=="branchpoint"  )
            { //only selected concrete features are analyzed
                var label = target.getAttribute("label");
                alert("destinos:  "+label)
                var id = target.getId();
                /*var origin = source.getAttribute("label")*/
               /* alert("destino"+label+"origen"+origin);*/
               

                graph.cellsToggled(target,true);
                var inco_egdes = graph.getModel().getIncomingEdges(graph.getModel().getCell(label))

                for (var j = 0; j < inco_egdes.length; j++) {
                  var file_source = inco_egdes[j].source;
                  
                }
            }

           
        }

          
        
        return customizations;

  }




}

export default control_verification