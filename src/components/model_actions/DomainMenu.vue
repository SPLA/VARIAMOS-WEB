<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {{ $t("domain_menu") }}
    </a>
    <div id="domain-menu" class="dropdown-menu" aria-labelledby="navbarDropdown">
      <a data-menudisplay="['feature','component','binding_feature_component']" @click="set_parameters()" class="dropdown-item">{{ $t("domain_menu_set_comp") }}</a>
      <a data-menudisplay="['component']" @click="show_file_code()" class="dropdown-item">{{ $t("domain_menu_show_file_code") }}</a>
      <a data-menudisplay="['component']" @click="create_component_model()" class="dropdown-item">{{ $t("domain_menu_create_component_model") }}</a>
    </div>

  </li>
</template>

<script>
import { setupModal, modalH3, modalInputTexts, modalButton, modalSimpleText } from '../../assets/js/common/util'
import axios from "axios";

export default {
  data: function(){
    return {
      model_data:"",
      errors:[] //errors
    }
  },
  props: {
   current_graph: {
    type: Object,
    required: true
   }
  },
  methods: {
    //Start set parameters
    set_parameters(){
      let c_header = modalH3(this.$t("domain_menu_set_comp"));
      let default_vals = "";
      let texts = [this.$t("domain_implementation_pool_path")];
      let inputs = ["server_component_path"];
      if (localStorage["domain_implementation_pool_path"]) {
        default_vals = [localStorage["domain_implementation_pool_path"]];
      }else{
        default_vals = ["uploads/component_pool/"];
      }
      let c_body = modalInputTexts(texts,inputs,default_vals);
      let c_footer = modalButton(this.$t("modal_save"),this.save_parameters);
      setupModal(c_header,c_body,c_footer);
    },
    //Start save parameters
    save_parameters(){
      localStorage["domain_implementation_pool_path"] =  document.getElementById('server_component_path').value;
      document.getElementById('main_modal').style.display="none";
    },
    //create_component_model
    create_component_model(){
      if (localStorage["domain_implementation_main_path"] && localStorage["domain_implementation_pool_path"]) {
        this.errors=[];
        //execute VariaMos service to get file content
        axios.post(localStorage["domain_implementation_main_path"]+'ComponentImplementation/getDirectoryInfo', {
          p_pool: localStorage["domain_implementation_pool_path"]
        })
        .then(response => {
          if(response.data){
            let t_tree = response.data;
            let initial_x=100;
            let initial_y=20;
            for (let t_folder in t_tree){
              //folder will be a component
              let tt_folder = t_tree[t_folder];
              let t_files = tt_folder.split('/');

              //Start cell creation process
              //1) Component
              let doc = mxUtils.createXmlDocument();
              let type = "component";
              let node = doc.createElement(type);
              node.setAttribute('label', t_folder);
              node.setAttribute('type', type);
              let vertex = new mxCell(node, new mxGeometry(0, 0, 100, 40), "shape=component");
              vertex.setConnectable(true);
              vertex.setVertex(true);
              this.current_graph.stopEditing(false);
              let f_cell = this.current_graph.getModel().getCell("component");
              let cf_cell = this.current_graph.getModel().getCell("binding_feature_component");
              vertex.geometry.x = initial_x;
              vertex.geometry.y = initial_y;
              let new_cells = this.current_graph.importCells([vertex], 0, 0, f_cell);
              //2) Clon component
              this.current_graph.getModel().prefix="clon"; 
              this.current_graph.getModel().nextId=this.current_graph.getModel().nextId-1;
              let vertex2 = this.current_graph.getModel().cloneCell(new_cells[0]);
              this.current_graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#DCDCDC", [vertex2]);
              this.current_graph.importCells([vertex2], 0, 0, cf_cell);
              this.current_graph.getModel().prefix=""; 
              let initial_x_f = initial_x;
              let initial_y_f = initial_y + 70;
              for(let i=0; i < t_files.length; i++){
                //file
                let t_file = t_files[i];
                if(t_file=="customization.json"){
                  //2.a) Custom file
                  let doc = mxUtils.createXmlDocument();
                  let type = "custom";
                  let node = doc.createElement(type);
                  node.setAttribute('label', t_folder+"-Custom");
                  node.setAttribute('type', type);
                  let vertex = new mxCell(node, new mxGeometry(0, 0, 100, 40), "shape=custom");
                  vertex.setConnectable(true);
                  vertex.setVertex(true);
                  this.current_graph.stopEditing(false);
                  vertex.geometry.x = initial_x_f;
                  vertex.geometry.y = initial_y_f;
                  initial_x_f = initial_x_f + 150;
                  let new_cells2 = this.current_graph.importCells([vertex], 0, 0, f_cell);
                  //2.a.1) rel
                  let doc2 = mxUtils.createXmlDocument();
                  let node2 = doc2.createElement('rel_custom_component');
                  node2.setAttribute('type', "relation");
                  this.current_graph.insertEdge(f_cell, null, node2, new_cells2[0], new_cells[0], "");
                }else if(t_file.includes(".frag")){
                  //2.b) fragment
                  let doc = mxUtils.createXmlDocument();
                  let type = "fragment";
                  let node = doc.createElement(type);
                  node.setAttribute('label', t_folder+"-"+t_file.substring(0, t_file.length - 5));
                  node.setAttribute('type', type);
                  node.setAttribute('filename', t_file);
                  let vertex = new mxCell(node, new mxGeometry(0, 0, 100, 40), "shape=fragment");
                  vertex.setConnectable(true);
                  vertex.setVertex(true);
                  this.current_graph.stopEditing(false);
                  vertex.geometry.x = initial_x_f;
                  vertex.geometry.y = initial_y_f;
                  initial_x_f = initial_x_f + 150;
                  let new_cells2 = this.current_graph.importCells([vertex], 0, 0, f_cell);
                  //2.b.1) rel fragment
                  let doc2 = mxUtils.createXmlDocument();
                  let node2 = doc2.createElement('rel_fragment_component');
                  node2.setAttribute('type', "relation");
                  this.current_graph.insertEdge(f_cell, null, node2, new_cells2[0], new_cells[0], "");
                }else{
                  //2.c) file
                  let doc = mxUtils.createXmlDocument();
                  let type = "file";
                  let node = doc.createElement(type);
                  node.setAttribute('label', t_folder+"-"+t_file.split('.').slice(0, -1).join('.'));
                  node.setAttribute('type', type);
                  node.setAttribute('filename', t_file);
                  node.setAttribute('destination', "");
                  let vertex = new mxCell(node, new mxGeometry(0, 0, 100, 40), "shape=file");
                  vertex.setConnectable(true);
                  vertex.setVertex(true);
                  this.current_graph.stopEditing(false);
                  vertex.geometry.x = initial_x_f;
                  vertex.geometry.y = initial_y_f;
                  initial_x_f = initial_x_f + 150;
                  let new_cells2 = this.current_graph.importCells([vertex], 0, 0, f_cell);
                  //2.c.1) rel file
                  let doc2 = mxUtils.createXmlDocument();
                  let node2 = doc2.createElement('rel_file_component');
                  node2.setAttribute('type', "relation");
                  this.current_graph.insertEdge(f_cell, null, node2, new_cells2[0], new_cells[0], "");
                }
              }
              initial_y = initial_y + 150;
            }
          }
        })
        .catch(e => {
          this.errors.push(e); 
          let c_header = modalH3(this.$t("modal_error"),"error");
          let c_body = modalSimpleText(e + this.$t("model_actions_backend_problem"));
          setupModal(c_header,c_body);
        });
      }else{
        let c_header = modalH3(this.$t("modal_error"),"error");
        let c_body = modalSimpleText(this.$t("domain_implementation_path_problem"));
        setupModal(c_header,c_body);
      }
    },
    show_file_code(){
      //get selected cell
      let cell = this.current_graph.getSelectionCell(); 
      if(cell==null){
        let c_header = modalH3(this.$t("modal_error"),"error");
        let c_body = modalSimpleText(this.$t("domain_menu_sfc_invalid"));
        setupModal(c_header,c_body);
      }else if(cell.getAttribute("type")=="file" || cell.getAttribute("type")=="fragment" || cell.getAttribute("type")=="custom"){
        let data={};
        let custom_file=false;
        if(cell.getAttribute("type")=="custom"){
          data["filename"]="customization.json";
          custom_file=true;
        }else{
          data["filename"]=cell.getAttribute("filename");
        }
        data["component"]=cell.getEdgeAt(0).target.getAttribute("label");
        if (localStorage["domain_implementation_main_path"] && localStorage["domain_implementation_pool_path"]) {
          this.errors=[];
          this.model_data=JSON.stringify(data);
          //execute VariaMos service to get file content
          axios.post(localStorage["domain_implementation_main_path"]+'ComponentImplementation/getFile', {
            data: this.model_data,
            p_pool: localStorage["domain_implementation_pool_path"]
          })
          .then(response => {
            if(response.data=="File not found"){
              let c_header = modalH3(this.$t("modal_error"),"error");
              let c_body = modalSimpleText(this.$t("domain_menu_sfc_not_found"));
              setupModal(c_header,c_body);
            }else{
              //append code to the properties area
              let properties_table = document.getElementById("properties");
              let tr = document.createElement('div');
              let td = document.createElement('div');
              let input = document.createElement('textarea');
              input.style.width = '100%';
              input.setAttribute('rows', 10);
              input.disabled = true;

              if(custom_file){
                input.value = JSON.stringify(response.data, undefined, 2);
              }else{
                input.value = response.data;
              }

              td.appendChild(input);
              tr.appendChild(td); properties_table.appendChild(tr);
            }
          })
          .catch(e => {
            this.errors.push(e); 
            let c_header = modalH3(this.$t("modal_error"),"error");
            let c_body = modalSimpleText(e + this.$t("model_actions_backend_problem"));
            setupModal(c_header,c_body);
          });
        }else{
          let c_header = modalH3(this.$t("modal_error"),"error");
          let c_body = modalSimpleText(this.$t("domain_implementation_path_problem"));
          setupModal(c_header,c_body);
        }
      }else{
        let c_header = modalH3(this.$t("modal_error"),"error");
        let c_body = modalSimpleText(this.$t("domain_menu_sfc_invalid"));
        setupModal(c_header,c_body);
      }                   
    }
  }
}
</script>


<style scoped>
</style>
