<template>
  <div>

    <div class="card mb-3">
            <div class="card-header">
              <font-awesome-icon icon="chart-area" />
              {{ $t("models_area") }}</div>
            <div class="card-body">

                <div class="left-side">
                  <div onload="main(this)" id="graphContainer" class="model-area"></div>
                  <div class="properties-area"><b>{{ $t("models_element_properties") }}</b><br />
                    <div id="properties"></div>
                  </div>
                </div>

                <div class="right-side">
                
                  <div id="tbContainer" class="pallete-area">
                  <b>{{ $t("models_palette") }}</b><br /><br />
                  </div>
                  <div class="other-area"><b>{{ $t("models_other_features") }}</b><br /><br />
                    <div class="button-area">
                    <div id="buttonXML"></div>&nbsp;<div id="buttonRESET"></div>&nbsp;
                    <div id="buttonSAVE"></div>
                    </div>
                  </div>

                </div>

                <div><input type="hidden" id="model_code" @change="persist()" v-model="model_code"></div>
              
              </div>

            <div class="card-footer small text-muted"></div>
        </div>
  </div>

</template>

<script>
import main from '@/assets/js/models/model_main.js'
import feature_main from '@/assets/js/models/feature.js'

export default{
  data: function(){
    return {
      model_code: ""
    }
  },
  mounted:  function(){
    var m_code="";
    if (localStorage.model_code) {
      this.model_code = localStorage.model_code;
      if(this.model_code!=""){
        m_code=this.model_code;
      }
    }

    main(document.getElementById('graphContainer'), 'feature', feature_main, m_code);
    
  },
  methods: {
    persist() {
      var newCode=document.getElementById('model_code').value;
      localStorage.model_code = newCode;
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
