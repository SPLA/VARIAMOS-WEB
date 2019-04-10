<template>
    <div id="tabs" class="container">
        <div class="tabs">
			<div v-for="(item, $index) in ['feature','component','binding_feature_component']" :key="item" >
				<a id="atabs" v-if="checktabs(item,$index)" @click="clickactivetab($index)" v-bind:class="[ getactivetab === item ? 'active' : '' ]">
					{{item}}
				</a>
			</div>
        </div>

        <div>
			<div v-if="getactivetab !== ''" class="tabcontent">
				<keep-alive>
					<model :key='getmodel_component'></model>
				</keep-alive>
			</div>
        </div>
        <div v-if="getactivetab === '' && $route.params.project !== 'default'">
            <div class="border-bottom text-left" style="padding-bottom: 10px"><h1 class="h2">Project: {{ $route.params.project }}</h1></div>
            <div class="div-text-area" style="padding-up: 10px">Please select one folder
                <br /><br />
            </div>
        </div>
        <div v-if="getactivetab === '' && $route.params.project === 'default'">
            <div class="border-bottom text-left" style="padding-bottom: 10px"><h1 class="h2">Please select one project</h1></div>
        </div>
    </div>
</template>

<script>
import model from './Models.vue'
import Bus from '../assets/js/common/bus.js'
import Vue from 'vue'

export default{
    components:{
        model
    },
    methods:{
        checktabs: function(item,index){ //set the first one diagram to activetab  
            let data = this.getdata;
            if(this.getmodel_component_index !== -1) 
            {
                if(this.getmodel_component.includes('Application') && index !== 0)
                    return false;
                if(this.getmodel_component.includes('Adaptation') && index !== 0)
                    return false;
                this.mxgraphreset = true;
                return true;
            }
            this.mxgraphreset = false;
            return false;
        },
        clickactivetab (index) {
            let data = this.getdata;
            let projectname = '';
			let foldername = data[this.getmodel_component_index].data.nodeName.replace(/\s+/g,"");
			for(let i = 0; i < data.length; i++)
			{
				if(data[i].data.nodeId === data[this.getmodel_component_index].data.projectId)
					projectname = data[i].data.nodeName;
			}
            if(index == 0)
            {
                this.$router.push("/models/"+projectname+"/"+foldername+"/feature");
                this.$store.dispatch('updateactivetab', 'feature');
            }
            else if(index == 1) 
            {
                this.$router.push("/models/"+projectname+"/"+foldername+"/component");
                this.$store.dispatch('updateactivetab', 'component');
            }
            else if(index == 2)
            {
                this.$router.push("/models/"+projectname+"/"+foldername+"/binding_feature_component");
                this.$store.dispatch('updateactivetab', 'binding_feature_component');
            }
        }
    },
    computed: {
        getactivetab (){
            return this.$store.getters.getactivetab;
        },
        getdata (){
            return this.$store.getters.getdata;
        },
        getmodel_component (){
            return this.$store.getters.getmodelcomponent;
        },
        getmodel_component_index (){
            return this.$store.getters.getmodelcomponentindex;
        }
    },
    mounted () {
        Bus.$on('resetall', data => { //reset the mxgraph component
            Bus.$emit('disablegraph',false);
            this.mxgraphreset = false;
            Vue.nextTick(()=>{
                this.mxgraphreset = true;
                this.model_component = data;
                localStorage.clear();
            },100);
        });
    }
}
</script>

<style scoped>
/* RESET */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.container {  
    min-width: 1100px;
    margin: 10px auto;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 0.9em;
    /* color: #888; */
}

/* Style the tabs */
.tabs {
    overflow: hidden;
    margin-left: 20px;
    margin-bottom: -2px; 
}

.tabs ul {
    list-style-type: none;
    margin-left: 20px;
}

.tabs a{
    float: left;
    cursor: pointer;
    padding: 12px 24px;
    transition: background-color 0.2s;
    border: 1px solid #ccc;
    border-right: none;
    background-color: #f1f1f1;
    border-radius: 10px 10px 0 0;
    font-weight: bold;
}
.tabs a:last-child { 
    border-right: 1px solid #ccc;
}

/* Change background color of tabs on hover */
.tabs a:hover {
    background-color: #aaa;
    color: #fff;
}

/* Styling for active tab */
.tabs a.active {
    background-color: #fff;
    color: #484848;
    border-bottom: 2px solid #fff;
    cursor: default;
}

/* Style the tab content */
.tabcontent {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 10px;
  box-shadow: 3px 3px 6px #e1e1e1;
  visibility: visible;
}


</style>