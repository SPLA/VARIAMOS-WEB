import axios from "axios";
import { setupModal, modalH3, modalSimpleText } from '../../../../common/util'
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
      "label":"Check void product line",
      "func":Check_void
  };
  data[2]={
    "label":"Check false product line",
    "func":Check_false
  };
  data[3]={
      "label":"Check dead feature",
      "func":Check_dead
  };
  data[4]={
    "label":"Check false optional feature",
    "func":Check_optional
  };
  data[5]={
    "label":"Check multiplicity conflicts",
    "func":Check_multi_conflicts
  };
  data[6]={
    "label":"Show HLVL",
    "func":Check_HLVL
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
      // check duplicated name
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
        // check space in the name
        if(childs[i].getAttribute("label").indexOf(' ') > -1)
        {
          result+="Label \"" + childs[i].getAttribute("label") + "\" should not have space " + "\n";
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
  
  // check the void product line
  function Check_void(graph, c_errors, c_overlays, model_component, activetab){
    // check duplicated name and space in name
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
      /**
       * @todo keep for the selections of features
       */
      for(let i = 0; i < childs.length; i++)
      {
        if(childs[i].getAttribute("type") !== "bundle")
        {
          selection_parameter[childs[i].getAttribute("label")] = false;
        }
      }

      axios.post(localStorage["domain_implementation_main_path"]+'Verification/check_void', {
        data: xml, name: model_component, param: selection_parameter
      })
      .then(response => {
        var c_header = modalH3("Verification result");
        var c_body = modalSimpleText("Void product line:\n " + JSON.stringify(response.data));
        setupModal(c_header,c_body);
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

  // check false product line
  function Check_false(graph, c_errors, c_overlays, model_component, activetab){
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
      /**
       * @todo keep for the selections of features
       */
      for(let i = 0; i < childs.length; i++)
      {
        if(childs[i].getAttribute("type") !== "bundle")
        {
          selection_parameter[childs[i].getAttribute("label")] = false;
        }
      }

      axios.post(localStorage["domain_implementation_main_path"]+'Verification/check_false', {
        data: xml, name: model_component, param: selection_parameter
      })
      .then(response => {
        var c_header = modalH3("Verification result");
        var c_body = modalSimpleText("False product line:\n " + JSON.stringify(response.data));
        setupModal(c_header,c_body);
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

  // Check dead feature
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
      /**
       * @todo keep for the selections of features
       */
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

          // set overlay on the dead features
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

  // Check false optional
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
      /**
       * @todo keep for the selections of features
       */
      for(let i = 0; i < childs.length; i++)
      {
        if(childs[i].getAttribute("type") !== "bundle")
        {
          selection_parameter[childs[i].getAttribute("label")] = false;
        }
      }
      // get all the optional features
      for(let i = 0; i < model_root.children.length; i++)
      {
        if(model_root.children[i].getAttribute("type") === "relation" && model_root.children[i].getAttribute("relType") === "optional")
        {
          optionals[model_root.children[i].source.getAttribute("label")] = false;
        }
      }

      // remove cardinality
      xml = xml.split("bundleType=\"RANGE\"").join("bundleType=\"AND\"");
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

          // set overlay to the false optional features
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

  // check cardinality in multiplicity conflicts
  function Check_multi_conflicts(graph, c_errors, c_overlays, model_component, activetab){
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
      /**
       * @todo keep for the selections of features
       */
      for(let i = 0; i < childs.length; i++)
      {
        if(childs[i].getAttribute("type") !== "bundle")
        {
          selection_parameter[childs[i].getAttribute("label")] = false;
        }
      }

      // check if feature model has solutions without cardinality
      let check_xml = xml.split("bundleType=\"RANGE\"").join("bundleType=\"AND\"");
      axios.post(localStorage["domain_implementation_main_path"]+'Verification/check_multi_conflict', {
        data: xml, name: model_component, param: selection_parameter, check_xml: check_xml
      })
      .then(response => { 
        var c_header = modalH3("Verification result");
        var c_body = modalSimpleText(JSON.stringify(response.data));
        setupModal(c_header,c_body);
        // set overlay on all the range bundle
        if(JSON.stringify(response.data).includes('There are some multiplicity conflicts.'))
        {
          let feature_root = graph.getModel().getCell("feature");    
          let childs = graph.getModel().getChildVertices(feature_root);
          for (let i = 0; i < childs.length; i++) {
            if(childs[i].getAttribute("type") === "bundle")
            {
              var encoder = new mxCodec();
              var result = encoder.encode(childs[i]);
              if(mxUtils.getPrettyXml(result).includes("bundleType=\"RANGE\""))
              {
                let overlay = new mxCellOverlay(new mxImage('images/MX/error.gif', 16, 16), 'Overlay tooltip', 'right', 'top');
                graph.addCellOverlay(childs[i], overlay);
                c_errors.push(childs[i]);
                c_overlays.push(overlay);
              }
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

  // show the HLVL code
  function Check_HLVL(graph, c_errors, c_overlays, model_component, activetab){
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
      /**
       * @todo keep for the selections of features
       */
      for(let i = 0; i < childs.length; i++)
      {
        if(childs[i].getAttribute("type") !== "bundle")
        {
          selection_parameter[childs[i].getAttribute("label")] = false;
        }
      }

      axios.post(localStorage["domain_implementation_main_path"]+'Verification/check_HLVL', {
        data: xml, name: model_component, param: selection_parameter
      })
      .then(response => {
        mxUtils.popup(response.data, true);
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