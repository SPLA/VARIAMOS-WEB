import axios from "axios";
import { setupModal, modalH3, modalSimpleText } from '../../../../common/util';

let featureVerification = function featureVerification()
{
  //custom verification menu options and functions
  let data = [];
  data[0] = {
      "label":"Check unique feature IDs",
      "func":checkUniqueIds
  };
  data[1] = {
      "label":"Check void product line",
      "func":checkVoid
  };
  data[2] = {
    "label":"Check false product line",
    "func":checkFalse
  };
  data[3] = {
      "label":"Check dead feature",
      "func":checkDead
  };
  data[4] = {
    "label":"Check false optional feature",
    "func":checkOptional
  };
  data[5] = {
    "label":"Check multiplicity conflicts",
    "func":checkMultiConflicts
  };
  data[6] = {
    "label":"Show HLVL",
    "func":checkHLVL
  };

  return data;

  //check that all the features (root, abstract and concrete) contain unique IDs
  function checkUniqueIds(graph, cErrors, cOverlays, modelComponent){
    let featureRoot = graph.getModel().getCell("feature");    
    let childs = graph.getModel().getChildVertices(featureRoot);
    let names = [];
    let result = "";

    //navigates through the feature model childs
    for (let i = 0; i < childs.length; i++) {
      let label = childs[i].getAttribute("label");
      if (names.indexOf(label) > -1) {
          result+="Duplicated feature ID - " + label + "\n";
          let overlay = new mxCellOverlay(new mxImage('images/MX/error.gif', 16, 16), 'Overlay tooltip', 'right', 'top');
          graph.addCellOverlay(childs[i], overlay);
          cErrors.push(childs[i]);
          cOverlays.push(overlay);
        }else{
          names.push(label);
        }
      }

      if(result!=""){
        alert(result);
      }else{
        alert("No errors found");
      }
      return result;
  }
  function checkInputMinizinc(graph, cErrors, cOverlays, modelComponent){
    let featureRoot = graph.getModel().getCell("feature");    
    let childs = graph.getModel().getChildVertices(featureRoot);
    let names = [];
    let result = "";

    //navigates through the feature model childs
    for (let i = 0; i < childs.length; i++) {
      let label = childs[i].getAttribute("label");
      // check duplicated name
      if (names.indexOf(label) > -1) {
          result += "Duplicated feature ID - " + label + "\n";
          let overlay = new mxCellOverlay(new mxImage('images/MX/error.gif', 16, 16), 'Overlay tooltip', 'right', 'top');
          graph.addCellOverlay(childs[i], overlay);
          cErrors.push(childs[i]);
          cOverlays.push(overlay);
        }
        else{
          if(childs[i].getAttribute("type") !== "bundle")
            names.push(label);
        }
        // check space in the name
        if(childs[i].getAttribute("label").indexOf(' ') > -1)
        {
          result += "Label \"" + childs[i].getAttribute("label") + "\" should not have space " + "\n";
          let overlay = new mxCellOverlay(new mxImage('images/MX/error.gif', 16, 16), 'Overlay tooltip', 'right', 'top');
          graph.addCellOverlay(childs[i], overlay);
          cErrors.push(childs[i]);
          cOverlays.push(overlay);
        }
      }

      /* TO FIX -> Annoying popup */
      /*
      if(result!=""){
        alert(result);
      }else{
        alert("No errors found");
      }
      */
      return result;
  }
  
  // check the void product line
  function checkVoid(graph, cErrors, cOverlays, modelComponent){
    // check duplicated name and space in name
    if(checkInputMinizinc(graph, cErrors, cOverlays, modelComponent)){
      return;
    }
    if (localStorage["domain_implementation_main_path"]) {
      let errors=[];
      let encoder = new mxCodec();
      let result = encoder.encode(graph.getModel());
      let xml = mxUtils.getPrettyXml(result);
      let featureRoot = graph.getModel().getCell("feature");
      let childs = graph.getModel().getChildVertices(featureRoot);
      let selectionParameter = {};
      /**
       * @todo keep for the selections of features
       */
      for(let i = 0; i < childs.length; i++)
      {
        if(childs[i].getAttribute("type") !== "bundle")
        {
          selectionParameter[childs[i].getAttribute("label")] = false;
        }
      }

      axios.post(localStorage["domain_implementation_main_path"] + 'Verification/check_void', {
        data: xml, name: modelComponent, param: selectionParameter
      })
      .then(response => {
        let cHeader = modalH3("Verification result");
        let cBody = modalSimpleText("Void product line:\n " + JSON.stringify(response.data));
        setupModal(cHeader,cBody);
      })
      .catch(e => {
        errors.push(e); 
        let cHeader = modalH3(global.messages["modal_error"], "error");
        let cBody = modalSimpleText(e + global.messages["model_actions_backend_problem"]);
        setupModal(cHeader, cBody);
      });
    }else{
      let cHeader = modalH3(global.messages["modal_error"], "error");
      let cBody = modalSimpleText(global.messages["verification_path_problem"]);
      setupModal(cHeader, cBody);
    }
  }

  // check false product line
  function checkFalse(graph, cErrors, cOverlays, modelComponent){
    if(checkInputMinizinc(graph, cErrors, cOverlays, modelComponent))
      return;
    if (localStorage["domain_implementation_main_path"]) {
      let errors=[];

      let encoder = new mxCodec();
      let result = encoder.encode(graph.getModel());
      let xml = mxUtils.getPrettyXml(result);
      let featureRoot = graph.getModel().getCell("feature");
      let childs = graph.getModel().getChildVertices(featureRoot);
      let selectionParameter = {};
      /**
       * @todo keep for the selections of features
       */
      for(let i = 0; i < childs.length; i++)
      {
        if(childs[i].getAttribute("type") !== "bundle")
        {
          selectionParameter[childs[i].getAttribute("label")] = false;
        }
      }

      axios.post(localStorage["domain_implementation_main_path"] + 'Verification/check_false', {
        data: xml, name: modelComponent, param: selectionParameter
      })
      .then(response => {
        let cHeader = modalH3("Verification result");
        let cBody = modalSimpleText("False product line:\n " + JSON.stringify(response.data));
        setupModal(cHeader, cBody);
      })
      .catch(e => {
        errors.push(e); 
        let cHeader = modalH3(global.messages["modal_error"], "error");
        let cBody = modalSimpleText(e + global.messages["model_actions_backend_problem"]);
        setupModal(cHeader, cBody);
      });
    }else{
      let cHeader = modalH3(global.messages["modal_error"], "error");
      let cBody = modalSimpleText(global.messages["verification_path_problem"]);
      setupModal(cHeader, cBody);
    }
  }

  // Check dead feature
  function checkDead(graph, cErrors, cOverlays, modelComponent){
    if(checkInputMinizinc(graph,cErrors, cOverlays, modelComponent))
      return;
    if (localStorage["domain_implementation_main_path"]) {
      let errors = [];

      let encoder = new mxCodec();
      let result = encoder.encode(graph.getModel());
      let xml = mxUtils.getPrettyXml(result);
      let featureRoot = graph.getModel().getCell("feature");
      let childs = graph.getModel().getChildVertices(featureRoot);
      let selectionParameter = {};
      /**
       * @todo keep for the selections of features
       */
      for(let i = 0; i < childs.length; i++)
      {
        if(childs[i].getAttribute("type") !== "bundle")
        {
          selectionParameter[childs[i].getAttribute("label")] = false;
        }
      }

      axios.post(localStorage["domain_implementation_main_path"] + 'Verification/check_dead', {
        data: xml, name: modelComponent, param: selectionParameter
      })
      .then(response => {
        if(Object.keys(response.data).length === 0)
        {
          let cHeader = modalH3("Verification result");
          let cBody = modalSimpleText("There is no dead feature.");
          setupModal(cHeader, cBody);
        }
        else
        {
          let response_data = [];
          let num = 0;
          for (let key in response.data)
          {
            response_data[num] = response.data[key];
            num++;
          }
          let cHeader = modalH3("Verification result");
          let cBody = modalSimpleText("There are dead features.");
          setupModal(cHeader, cBody);

          // set overlay on the dead features
          let featureRoot = graph.getModel().getCell("feature");    
          let childs = graph.getModel().getChildVertices(featureRoot);
          for (let i = 0; i < childs.length; i++) {
            if(response_data.includes(childs[i].getAttribute("label")))
            {
              let overlay = new mxCellOverlay(new mxImage('images/MX/error.gif', 16, 16), 'Overlay tooltip', 'right', 'top');
              graph.addCellOverlay(childs[i], overlay);
              cErrors.push(childs[i]);
              cOverlays.push(overlay);
            }
          }
        }
      })
      .catch(e => {
        errors.push(e); 
        let cHeader = modalH3(global.messages["modal_error"], "error");
        let cBody = modalSimpleText(e + global.messages["model_actions_backend_problem"]);
        setupModal(cHeader, cBody);
      });
    }else{
      let cHeader = modalH3(global.messages["modal_error"], "error");
      let cBody = modalSimpleText(global.messages["verification_path_problem"]);
      setupModal(cHeader, cBody);
    }
  }

  // Check false optional
  function checkOptional(graph, cErrors, cOverlays, modelComponent){
    if(checkInputMinizinc(graph, cErrors, cOverlays, modelComponent))
      return;
    if (localStorage["domain_implementation_main_path"]) {
      let errors = [];

      let encoder = new mxCodec();
      let result = encoder.encode(graph.getModel());
      let xml = mxUtils.getPrettyXml(result);
      let featureRoot = graph.getModel().getCell("feature");
      let childs = graph.getModel().getChildVertices(featureRoot);
      let selectionParameter = {};
      let optionals = {};
      /**
       * @todo keep for the selections of features
       */
      for(let i = 0; i < childs.length; i++)
      {
        if(childs[i].getAttribute("type") !== "bundle")
        {
          selectionParameter[childs[i].getAttribute("label")] = false;
        }
      }
      // get all the optional features
      for(let i = 0; i < featureRoot.children.length; i++)
      {
        // add the optional feature into groups
        if(featureRoot.children[i].getAttribute("type") === "relation" && featureRoot.children[i].getAttribute("relType") === "optional")
        {
          optionals[featureRoot.children[i].source.getAttribute("label")] = false;
        }
        /**
         * add the children of bundle in the optional feature groups
         * @todo it looks not complete according to false optional feature verification
         */
        if(featureRoot.children[i].value.nodeName === 'rel_concrete_bundle' || featureRoot.children[i].value.nodeName === 'rel_abstract_bundle')
        {
          optionals[featureRoot.children[i].source.getAttribute("label")] = false;
        }
      }

      axios.post(localStorage["domain_implementation_main_path"]+'Verification/check_optional', {
        data: xml, name: modelComponent, param: selectionParameter, optional: optionals
      })
      .then(response => {
        if(Object.keys(response.data).length === 0)
        {
          let cHeader = modalH3("Verification result");
          let cBody = modalSimpleText("There is no false optional feature.");
          setupModal(cHeader, cBody);
        }
        else
        {
          let response_data = [];
          let num = 0;
          for (let key in response.data)
          {
            response_data[num] = response.data[key];
            num++;
          }
          let cHeader = modalH3("Verification result");
          let cBody = modalSimpleText("There are false optional features.");
          setupModal(cHeader, cBody);

          // set overlay to the false optional features
          let featureRoot = graph.getModel().getCell("feature");    
          let childs = graph.getModel().getChildVertices(featureRoot);
          for (let i = 0; i < childs.length; i++) {
            if(response_data.includes(childs[i].getAttribute("label")))
            {
              let overlay = new mxCellOverlay(new mxImage('images/MX/error.gif', 16, 16), 'Overlay tooltip', 'right', 'top');
              graph.addCellOverlay(childs[i], overlay);
              cErrors.push(childs[i]);
              cOverlays.push(overlay);
            }
          }
        }
      })
      .catch(e => {
        errors.push(e); 
        let cHeader = modalH3(global.messages["modal_error"],"error");
        let cBody = modalSimpleText(e + global.messages["model_actions_backend_problem"]);
        setupModal(cHeader,cBody);
      });
    }else{
      let cHeader = modalH3(global.messages["modal_error"],"error");
      let cBody = modalSimpleText(global.messages["verification_path_problem"]);
      setupModal(cHeader,cBody);
    }
  }

  // check cardinality in multiplicity conflicts
  function checkMultiConflicts(graph, cErrors, cOverlays, modelComponent){
    if(checkInputMinizinc(graph, cErrors, cOverlays, modelComponent))
      return;
    if (localStorage["domain_implementation_main_path"]) {
      let errors=[];

      let encoder = new mxCodec();
      let result = encoder.encode(graph.getModel());
      let xml = mxUtils.getPrettyXml(result);
      let featureRoot = graph.getModel().getCell("feature");
      let childs = graph.getModel().getChildVertices(featureRoot);
      let selectionParameter = {};
      /**
       * @todo keep for the selections of features
       */
      for(let i = 0; i < childs.length; i++)
      {
        if(childs[i].getAttribute("type") !== "bundle")
        {
          selectionParameter[childs[i].getAttribute("label")] = false;
        }
      }

      // check if feature model has solutions without cardinality
      let checkXml = xml.split("bundleType=\"RANGE\"").join("bundleType=\"AND\"");
      axios.post(localStorage["domain_implementation_main_path"]+'Verification/check_multi_conflict', {
        data: xml, name: modelComponent, param: selectionParameter, check_xml: checkXml
      })
      .then(response => { 
        let cHeader = modalH3("Verification result");
        let cBody = modalSimpleText(JSON.stringify(response.data));
        setupModal(cHeader, cBody);
        // set overlay on all the range bundle
        if(JSON.stringify(response.data).includes('There are some multiplicity conflicts.'))
        {
          let featureRoot = graph.getModel().getCell("feature");    
          let childs = graph.getModel().getChildVertices(featureRoot);
          for (let i = 0; i < childs.length; i++) {
            if(childs[i].getAttribute("type") === "bundle")
            {
              let encoder = new mxCodec();
              let result = encoder.encode(childs[i]);
              if(mxUtils.getPrettyXml(result).includes("bundleType=\"RANGE\""))
              {
                let overlay = new mxCellOverlay(new mxImage('images/MX/error.gif', 16, 16), 'Overlay tooltip', 'right', 'top');
                graph.addCellOverlay(childs[i], overlay);
                cErrors.push(childs[i]);
                cOverlays.push(overlay);
              }
            }
          }
        }
      })
      .catch(e => {
        errors.push(e); 
        let cHeader = modalH3(global.messages["modal_error"],"error");
        let cBody = modalSimpleText(e + global.messages["model_actions_backend_problem"]);
        setupModal(cHeader, cBody);
      });
    }else{
      let cHeader = modalH3(global.messages["modal_error"],"error");
      let cBody = modalSimpleText(global.messages["verification_path_problem"]);
      setupModal(cHeader, cBody);
    }
  }

  // show the HLVL code
  function checkHLVL(graph, cErrors, cOverlays, modelComponent){
    if(checkInputMinizinc(graph, cErrors, cOverlays, modelComponent))
      return;
    if (localStorage["domain_implementation_main_path"]) {
      let errors=[];

      let encoder = new mxCodec();
      let result = encoder.encode(graph.getModel());
      let xml = mxUtils.getPrettyXml(result);
      let featureRoot = graph.getModel().getCell("feature");
      let childs = graph.getModel().getChildVertices(featureRoot);
      let selectionParameter = {};
      /**
       * @todo keep for the selections of features
       */
      for(let i = 0; i < childs.length; i++)
      {
        if(childs[i].getAttribute("type") !== "bundle")
        {
          selectionParameter[childs[i].getAttribute("label")] = false;
        }
      }

      axios.post(localStorage["domain_implementation_main_path"]+'Verification/checkHLVL', {
        data: xml, name: modelComponent, param: selectionParameter
      })
      .then(response => {
        mxUtils.popup(response.data, true);
      })
      .catch(e => {
        errors.push(e); 
        let cHeader = modalH3(global.messages["modal_error"], "error");
        let cBody = modalSimpleText(e + global.messages["model_actions_backend_problem"]);
        setupModal(cHeader, cBody);
      });
    }else{
      let cHeader = modalH3(global.messages["modal_error"], "error");
      let cBody = modalSimpleText(global.messages["verification_path_problem"]);
      setupModal(cHeader, cBody);
    }
  }
}

export default featureVerification