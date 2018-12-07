<template>
  <div>

    <div class="card mb-3">
            <div class="card-header">
              <font-awesome-icon icon="chart-area" />
              {{ $t("models_area") }} - {{ $route.params.type }} {{ $t("models_model") }}</div>
            <div class="card-body">

                <div class="left-side">
                  <div id="graphContainer" class="model-area"></div>
                  <div class="properties-area"><b>{{ $t("models_element_properties") }}</b><br />
                    <div id="properties"></div>
                  </div>
                </div>

                <div class="right-side">
                
                  <div class="pallete-area">
                  <b>{{ $t("models_palette") }}</b><br /><br />
                  <div id="tbContainer"></div>
                  </div>
                  <div class="other-area"><b>{{ $t("models_other_features") }}</b><br /><br />
                    <div class="button-area">
                    <div id="buttonXML"></div>&nbsp;<div id="buttonRESET"></div>&nbsp;
                    <div id="buttonSAVE"></div>
                    </div>
                  </div>

                </div>

                <div><input type="hidden" id="model_code" @change="persist()" v-model="model_code" />
                <input type="hidden" id="current_type" v-bind:value="$route.params.type" />
                </div>
              
              </div>

            <div class="card-footer small text-muted"></div>
        </div>
  </div>

</template>

<script>
import main from '@/assets/js/models/model_main.js'
import feature_main from '@/assets/js/models/feature.js'
import component_main from '@/assets/js/models/component.js'

export default{
  data: function(){
    return {
      model_code: "",
      graph:"",
      toolbar:"",
      keyHandler:""
    }
  },
  mounted: function(){
    //initialize graph main variables
    this.graph = new mxGraph(document.getElementById('graphContainer'));
    this.toolbar = new mxToolbar(document.getElementById('tbContainer'));
    this.keyHandler = new mxKeyHandler(this.graph);
    this.initialize_mx(1);
  },
  methods: {
    persist() {
      //save model in localstorage
      var type=this.$route.params.type;
      var newCode=document.getElementById('model_code').value;
      localStorage[type] = newCode;
    },
    initialize_mx(counter){
      //counter equals 1 load the entire mxGraph 
      //counter equals 2 setup the elements and buttons
      var m_code="";
      var type=this.$route.params.type;
      //preload the saved model if exists
      if (localStorage[type]) {
        this.model_code = localStorage[type];
        if(this.model_code!=""){
          m_code=this.model_code;
        }
      }
      if(type=="feature"){
        main(this.graph,this.toolbar,this.keyHandler,document.getElementById('graphContainer'), 'feature', feature_main, m_code, counter);
      }else if (type=="component"){
        main(this.graph,this.toolbar,this.keyHandler,document.getElementById('graphContainer'), 'component', component_main, m_code, counter);
      }
    }
  },
  beforeRouteLeave(to, from, next){
    //destroy the window key events before leaving
    this.keyHandler.destroy();
    next();
  },
  watch:{
    $route (to, from){
      //remove the buttons and palette content when there is a change in the component route
      document.getElementById('tbContainer').innerHTML="";
      document.getElementById('buttonXML').innerHTML="";
      document.getElementById('buttonRESET').innerHTML="";
      document.getElementById('buttonSAVE').innerHTML="";
      this.initialize_mx(2);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button-area{
  display:inline-flex;
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
  overflow:hidden;
  height:250px;
  background:url("/static/images/MX/editors/grid.gif");
  cursor:default;
  padding-right: 0px; 
  padding-left: 0px;
}

.left-side{
	float: left;
  width:70%;
  border-right: 1px solid rgba(0,0,0,.125);
}

.right-side{
	width: 30%;
  float: left;
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
