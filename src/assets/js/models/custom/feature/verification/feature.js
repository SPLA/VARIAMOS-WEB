import axios from "axios";
import { setupModal, modalH3, modalSimpleText, modalButton } from '../../../../common/util'
import I18n from '../../../../../../i18n.js'
let feature_verification = function feature_verification()
{
  //custom verification menu options and functions
  let data=[];
  data[0]={
      "label":"Check unique feature IDs",
      "func":check_unique_ids
  };
  data[1]={
      "label":"Check void false model",
      "func":Check_void_false
  };
  data[2]={
      "label":"Check dead feature",
      "func":Check_dead
  };
  data[3]={
    "label":"Check false optional",
    "func":Check_optional
  };

  return data;

  //check that all the features (root, abstract and concrete) contain unique IDs
  function check_unique_ids(graph,c_errors,c_overlays, model_component, activetab){
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
      return result;
  }
  function check_input_minizinc(graph,c_errors,c_overlays, model_component, activetab){
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
        }
        else{
          if(childs[i].getAttribute("type") !== "bundle")
            names.push(label);
        }
        if(childs[i].getAttribute("type") === "root" && childs[i].getAttribute("label") !== "root")
        {
          result+="Root feature name should be 'root' " + "\n";
          let overlay = new mxCellOverlay(new mxImage('images/MX/error.gif', 16, 16), 'Overlay tooltip', 'right', 'top');
          graph.addCellOverlay(childs[i], overlay);
          c_errors.push(childs[i]);
          c_overlays.push(overlay);
        }
        if(childs[i].getAttribute("label").indexOf(' ') > -1)
        {
          result+="Label" + childs[i].getAttribute("label") + "should not have space " + "\n";
          let overlay = new mxCellOverlay(new mxImage('images/MX/error.gif', 16, 16), 'Overlay tooltip', 'right', 'top');
          graph.addCellOverlay(childs[i], overlay);
          c_errors.push(childs[i]);
          c_overlays.push(overlay);
        }
      }

      if(result!=""){
        alert(result);
      }else{
        alert("No errors found");
      }
      return result;
  }
  //Check the model has solutions or not
  function Check_void_false(graph, c_errors, c_overlays, model_component, activetab){
    if(check_input_minizinc(graph,c_errors,c_overlays, model_component, activetab))
      return;
    if (localStorage["domain_implementation_main_path"]) {
      let errors=[];

      var encoder = new mxCodec();
      var result = encoder.encode(graph.getModel());
      var xml = mxUtils.getPrettyXml(result);
      var model_root = graph.getModel().getCell(activetab);
      var childs = graph.getModel().getChildVertices(model_root);
      var selection_parameter = {};
      for(let i = 0; i < childs.length; i++)
      {
        if(childs[i].getAttribute("type") !== "bundle")
        {
          selection_parameter[childs[i].getAttribute("label")] = false;
        }
      }

      axios.post(localStorage["domain_implementation_main_path"]+'Verification/check_void_false', {
        data: xml, name: model_component, param: selection_parameter
      })
      .then(response => {
        var c_header = modalH3("Verification result");
        var c_body = modalSimpleText("Void or false model:\n " + JSON.stringify(response.data));
        setupModal(c_header,c_body);
        // mxUtils.popup(response.data["hlvl"], true);
      })
      .catch(e => {
        errors.push(e); 
        let c_header = modalH3(I18n.t("modal_error"),"error");
        let c_body = modalSimpleText(e + I18n.t("model_actions_backend_problem"));
        setupModal(c_header,c_body);
      });
    }else{
      let c_header = modalH3(I18n.t("modal_error"),"error");
      let c_body = modalSimpleText(I18n.t("verification_path_problem"));
      setupModal(c_header,c_body);
    }
  }
  //Check all the features are considered in the solutions
  function Check_dead(graph, c_errors, c_overlays, model_component, activetab){
    if(check_input_minizinc(graph,c_errors,c_overlays, model_component, activetab))
      return;
    if (localStorage["domain_implementation_main_path"]) {
      let errors=[];

      var encoder = new mxCodec();
      var result = encoder.encode(graph.getModel());
      var xml = mxUtils.getPrettyXml(result);
      var model_root = graph.getModel().getCell(activetab);
      var childs = graph.getModel().getChildVertices(model_root);
      var selection_parameter = {};
      for(let i = 0; i < childs.length; i++)
      {
        if(childs[i].getAttribute("type") !== "bundle")
        {
          selection_parameter[childs[i].getAttribute("label")] = false;
        }
      }

      axios.post(localStorage["domain_implementation_main_path"]+'Verification/check_dead', {
        data: xml, name: model_component, param: selection_parameter
      })
      .then(response => {
        if(Object.keys(response.data).length === 0)
        {
          var c_header = modalH3("Verification result");
          var c_body = modalSimpleText("There is no dead feature.");
          setupModal(c_header,c_body);
        }
        else
        {
          let response_data = [];
          let num = 0;
          for (var key in response.data)
          {
            response_data[num] = response.data[key];
            num++;
          }
          var c_header = modalH3("Verification result");
          var c_body = modalSimpleText("There are dead features.");
          setupModal(c_header,c_body);

          let feature_root = graph.getModel().getCell("feature");    
          let childs = graph.getModel().getChildVertices(feature_root);
          for (let i = 0; i < childs.length; i++) {
            console.log(childs[i].getAttribute("label"));
            if(response_data.includes(childs[i].getAttribute("label")))
            {
              let overlay = new mxCellOverlay(new mxImage('images/MX/error.gif', 16, 16), 'Overlay tooltip', 'right', 'top');
              graph.addCellOverlay(childs[i], overlay);
              c_errors.push(childs[i]);
              c_overlays.push(overlay);
            }
          }
        }
      })
      .catch(e => {
        errors.push(e); 
        let c_header = modalH3(I18n.t("modal_error"),"error");
        let c_body = modalSimpleText(e + I18n.t("model_actions_backend_problem"));
        setupModal(c_header,c_body);
      });
    }else{
      let c_header = modalH3(I18n.t("modal_error"),"error");
      let c_body = modalSimpleText(I18n.t("verification_path_problem"));
      setupModal(c_header,c_body);
    }
  }

  function Check_optional(graph, c_errors, c_overlays, model_component, activetab){
    if(check_input_minizinc(graph,c_errors,c_overlays, model_component, activetab))
      return;
    if (localStorage["domain_implementation_main_path"]) {
      let errors=[];

      var encoder = new mxCodec();
      var result = encoder.encode(graph.getModel());
      var xml = mxUtils.getPrettyXml(result);
      var model_root = graph.getModel().getCell(activetab);
      var childs = graph.getModel().getChildVertices(model_root);
      var selection_parameter = {};
      var optionals= {};
      for(let i = 0; i < childs.length; i++)
      {
        if(childs[i].getAttribute("type") !== "bundle")
        {
          selection_parameter[childs[i].getAttribute("label")] = false;
        }
      }
      for(let i = 0; i < model_root.children.length; i++)
      {
        if(model_root.children[i].getAttribute("type") === "relation" && model_root.children[i].getAttribute("relType") === "optional")
        {
          optionals[model_root.children[i].source.getAttribute("label")] = false;
        }
      }

      axios.post(localStorage["domain_implementation_main_path"]+'Verification/check_optional', {
        data: xml, name: model_component, param: selection_parameter, optional: optionals
      })
      .then(response => {
        if(Object.keys(response.data).length === 0)
        {
          var c_header = modalH3("Verification result");
          var c_body = modalSimpleText("There is no false optional feature.");
          setupModal(c_header,c_body);
        }
        else
        {
          let response_data = [];
          let num = 0;
          for (var key in response.data)
          {
            response_data[num] = response.data[key];
            num++;
          }
          var c_header = modalH3("Verification result");
          var c_body = modalSimpleText("There are false optional features.");
          setupModal(c_header,c_body);

          let feature_root = graph.getModel().getCell("feature");    
          let childs = graph.getModel().getChildVertices(feature_root);
          for (let i = 0; i < childs.length; i++) {
            if(response_data.includes(childs[i].getAttribute("label")))
            {
              let overlay = new mxCellOverlay(new mxImage('images/MX/error.gif', 16, 16), 'Overlay tooltip', 'right', 'top');
              graph.addCellOverlay(childs[i], overlay);
              c_errors.push(childs[i]);
              c_overlays.push(overlay);
            }
          }
        }
      })
      .catch(e => {
        errors.push(e); 
        let c_header = modalH3(I18n.t("modal_error"),"error");
        let c_body = modalSimpleText(e + I18n.t("model_actions_backend_problem"));
        setupModal(c_header,c_body);
      });
    }else{
      let c_header = modalH3(I18n.t("modal_error"),"error");
      let c_body = modalSimpleText(I18n.t("verification_path_problem"));
      setupModal(c_header,c_body);
    }
  }
}

export default feature_verification