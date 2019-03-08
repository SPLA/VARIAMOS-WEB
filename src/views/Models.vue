<template>
  <div>

    <div class="card mb-3">
            <div class="card-body">

              <div class="button-header">
                 <nav class="navbar navbar-expand-lg navbar-light bg-light nav_domain">
                  <div id="navbarSupportedContent">
                    <ul class="navbar-nav navbar-nav2 mr-auto">
                     <li class="nav-item"><a class="nav-link nav-text"><i class="fas fa-chart-area"></i>
                      {{ $t("models_area") }} - {{ $route.params.type }} {{ $t("models_model") }}</a></li>
                      <!-- model actions -->
                      <BackEnd /> 
                      <DomainImplementation :current_graph="graph" /> 
                      <Verification :current_graph="graph" /> 
                    </ul>
                  </div>
                </nav>
              </div>

              <div class="button-area">
                    <div class="button-unique" id="buttonSAVE"></div>
                    <div class="button-unique" id="buttonUNDO"></div>
                    <div class="button-unique" id="buttonREDO"></div>
                    <div class="button-unique" id="buttonSHOW"></div>
                    <div class="button-unique" id="buttonDELETE"></div>
                    <div class="button-unique" id="buttonRESET"></div>
                    <div class="button-unique" id="buttonRESETALL"></div>
                    <div class="button-unique" id="buttonEXPORT"></div>
                    <div class="button-unique" id="buttonIMPORT" type="file"></div>
                    <div class="button-unique" id="buttonXML"></div>
              </div>

              <div class="row main_area">

                <div class="col-sm-9 left-area">
                  <div id="graphContainer" class="model-area"></div>
                  <div class="properties-area"><b>{{ $t("models_element_properties") }}</b><br />
                    <div id="properties"></div>
                  </div>
                </div>

                <div class="col-sm-3 right-area">
                  <div class="pallete-area">
                  <b>{{ $t("models_palette") }}</b><br /><br />
                  <div id="tbContainer"></div>
                  </div>
                  <div class="other-area"><b>{{ $t("models_navigator") }}</b>
                  <div id="navigator" class="navigator"></div>
                  </div>
                </div>

              </div>
              </div>

            <div class="card-footer small text-muted"></div>
        </div>

        <div>
          <input type="hidden" id="model_code" @change="persist()" v-model="modelCode" />
          <input type="hidden" id="current_type" v-bind:value="$route.params.type" />
          <input id="file" type="file" class="button_hidden" />
        </div>
  </div>

</template>

<script>
import setup_relations from '@/assets/js/models/setup_relations.js'
import setup_elements from '@/assets/js/models/setup_elements.js'
import setup_buttons from '@/assets/js/models/setup_buttons.js'
import setup_keys from '@/assets/js/models/setup_keys.js'
import setup_properties from '@/assets/js/models/setup_properties.js'
import main from '@/assets/js/models/model_main.js'
import model_load from '@/assets/js/models/model_load.js'
import feature_main from '@/assets/js/models/custom/feature.js'
import component_main from '@/assets/js/models/custom/component.js'
import binding_feature_component_main from '@/assets/js/models/custom/binding_feature_component.js'

/* import actions */
import DomainImplementation from '../components/model_actions/DomainImplementation'
import Verification from '../components/model_actions/Verification'
import BackEnd from '../components/model_actions/BackEnd'
import Bus from '../assets/js/common/bus.js'

export default{
  props:[
    'activetab','model_component','model_component_index','data','layer_type'
  ],
  data: function(){
    return {
      mxgraphsetEnable: false,
      modelCode: "", //stores the model code when saved
      graph: new Object(), //mxGraph object
      toolbar: new Object(), //mxToolbar
      keyHandler: new Object(), //mxKeyHandler
      undoManager: new Object(), //mxUndoManager
      layers:{}, //model layers
      modelFunctions:{},
      setupFunctions:{},
      models:[], //available models
      currentFunction:"",
      mxModel: new Object(), //mxGraphModel
      modelType:"" 
    }
  },
  components: {
    BackEnd,
    DomainImplementation,
    Verification
  },
  mounted: function(){
    //this.models = ["feature","component","binding_feature_component"]; //represent the available models
    this.modelFunctions = {
      "feature":feature_main,
      "component":component_main,
      "binding_feature_component":binding_feature_component_main
    }
    this.setupFunctions = {
      "setup_relations":setup_relations,
      "setup_buttons":setup_buttons,
      "setup_keys":setup_keys,
      "setup_properties":setup_properties,
      "setup_elements":setup_elements
    }
    this.modelType=this.$route.params.type; //based on URL Route
    //preload the saved model if exists
    if (localStorage[this.model_component]) {
        this.modelCode = localStorage[this.model_component];
    }
    this.models = this.listoftabs(this.model_component_index);
    this.graph = new mxGraph(document.getElementById('graphContainer'));
    //load saved model into the graph if exists, and return layers
    this.layers=model_load(this.graph,this.models,this.modelCode,this.layer_type,this.data,this.model_component_index);
    if(this.layer_type === 2)
      Bus.$emit('importxml2',{t1:this.layers, t2:this.model_component_index});
    this.currentFunction=this.modelFunctions[this.modelType];
    this.toolbar = new mxToolbar(document.getElementById('tbContainer'));
    this.keyHandler = new mxKeyHandler(this.graph);
    console.log(this.keyHandler);
    this.undoManager = new mxUndoManager();
    this.mxModel = this.graph.getModel();

    this.initialize_mx(1);
    //clear undo redo history
    this.undoManager.clear();
    Bus.$on('updatelayer', data =>{
      if(this.graph.isEnabled())
      {
        var root = this.graph.getModel().getRoot();
        var m_cell =new mxCell();
        m_cell.setId(data);
        this.layers[data]=root.insert(m_cell);
        Bus.$emit('addlayer',this.model_component);
      }
    });
    Bus.$on('updatemodel_component2', index =>{ 
      if(this.data[index].data.nodeName === this.model_component)
      {
        this.mxgraphsetEnable = true;
          if (localStorage[this.data[index].data.nodeName])
          {
            this.models = this.listoftabs(this.model_component_index);
            this.modelCode = localStorage[this.data[index].data.nodeName];
            this.layers=model_load(this.graph,this.models,this.modelCode,this.layer_type,this.data,this.model_component_index);
          }
      }
      else  
        this.mxgraphsetEnable = false;
    });
  },
  methods: {
    persist() {
      //save model in localstorage
      if(this.model_component === document.getElementById('model_code').tab)
      {
        localStorage[this.model_component] = document.getElementById('model_code').value;
        if(document.getElementById('model_code').value!=""){
          // var c_header = modalH3(this.$t("modal_success"),"success");
          // var c_body = modalSimpleText(this.$t("models_save_model"));
          // setupModal(c_header,c_body);
          this.$Message.warning('Success!');
        }
      }
    },
    initialize_mx(counter){
      //counter equals 1 load the entire mxGraph
      var graphContainer = document.getElementById('graphContainer');
      main(this.graph,this.layers,this.mxModel,this.toolbar,this.keyHandler,graphContainer,this.modelType,this.currentFunction,counter,this.setupFunctions,this.undoManager,this.activetab,this.model_component,this.data);
    },
    listoftabs(index){
      let activetabs = [];
      for(let i = 0; i < this.data.length; i++)
      {
        if(this.data[i].data.parentId === this.data[index].data.nodeId && this.data[i].data.nodeType === 3)
          activetabs.push(this.data[i].data.nodeName);
      }
      return activetabs;
    }
  },
  beforeRouteLeave(to, from, next){
    //destroy the window key events before leaving
    this.keyHandler.destroy();
    next();
  },
  watch:{
    // $route (to, from){
      //remove the palette content when there is a change in the component route
      // document.getElementById('tbContainer').innerHTML="";
      // this.modelType=this.$route.params.type;
      // this.currentFunction=this.modelFunctions[this.modelType];
      // this.undoManager = new mxUndoManager();
      // this.initialize_mx(2);
      //clear undo redo history
      // this.undoManager.clear();
    activetab: function(val){
      if(this.graph.isEnabled())
      {
        document.getElementById('tbContainer').innerHTML="";
        this.modelType=this.$route.params.type;
        this.currentFunction=this.modelFunctions[this.modelType];
        this.undoManager = new mxUndoManager();
        this.initialize_mx(2);
        this.undoManager.clear();
        Bus.$emit('manageelement',this.graph.getChildCells(this.graph.getDefaultParent(), true, true));
      }
    },
    mxModel:{
      handler(val) {
          Bus.$emit('manageelement',this.graph.getChildCells(this.graph.getDefaultParent(), true, true));
          
          // var encoder = new mxCodec();
          // var result = encoder.encode(this.graph.getModel());
          // var xml = mxUtils.getPrettyXml(result);
          // localStorage[this.model_component] = xml;
      },
      deep:true
    },
    mxgraphsetEnable: function(val){
      this.graph.setEnabled(val);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media (max-width: 992px){
  .right-area, .left-area{
    flex: 100%;
    max-width: 100%;
  }
  .right-area{
    border-left: 0px !important;
  }
}

.button-header{
  border-radius: calc(.25rem - 1px) calc(.25rem - 1px) 0 0;
  border-bottom: 2px solid rgba(0,0,0,.125);
}

.nav_domain{
  padding: 2px;
}

.nav-text{
  color: rgba(0,0,0,.7)!important;
}

.button-unique{
  display: -webkit-box;
  float: left;
}

.button_hidden{
  visibility:hidden;
}

.main_area{
  margin-right: 0px;
  margin-left: 0px;
  margin-top: -6px;
}

.left-area{
  padding-right: 0px;
  padding-left: 0px;
}

.right-area{
  padding-right: 0px;
  padding-left: 0px;
  border-top: 1px solid rgba(0,0,0,.125);
  border-left: 1px solid rgba(0,0,0,.125);
}

.navigator{
  border: 2px solid rgba(0,0,0,.125);
  margin-top: 10px;
}

.button-area{
  display: inline-block;
  border-bottom: 1px solid rgba(0,0,0,.125);
  width: 100%;
}

.card-header {
  text-align: left;
}

.card-body {
  padding: 0px;
  background-color: white;
}

.properties-area, .other-area{
  border-top: 1px solid rgba(0,0,0,.125);
	padding: 15px;
}

.model-area{
  overflow-block: scroll;
  overflow-x: auto;
  overflow-y: auto;
  height:350px;
  background:url("../assets/images/grid.gif");
  cursor:default;
  padding-right: 0px; 
  padding-left: 0px;
}

.pallete-area{
  padding: 15px;
}

.pad20{
	padding-top:20px;
}

table{
	font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size: 14px;
}

.properties-table td{
	padding: 5px;
}
</style>
