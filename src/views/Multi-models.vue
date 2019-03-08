<template>
            <div id="tabs" class="container">
              	<div class="tabs">
					<div v-for="(item, $index) in data" :key="item.data.nodeId" >
						<a id="atabs" v-if="checktabs(item)" @click="clickactivetab($index)" v-bind:class="[ activetab === item.data.nodeName ? 'active' : '' ]">
							{{item.data.nodeName}}
						</a>
					</div>
            	</div>

            <div>
				<div v-if="activetab !== ''" class="tabcontent">
					<keep-alive v-if="mxgraphreset">
						<model :key='model_component' :layer_type="layer_type" :data="data" :model_component="model_component" :activetab="activetab" :model_component_index="model_component_index" :mxgraphsetEnable="mxgraphisEdited" ></model>
					</keep-alive>
				</div>
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
    data: function() {
        return{
            activetab: '',
            onetab: true,
            data:[],
            mxgraphisEdited: false,
            mxgraphreset: true,
            model_component: '',
            model_component_index: -1,
            layer_type:1
		}
    },
    methods:{
        checktabs: function(item){ //set the first one diagram to activetab  
            if(this.model_component_index !== -1 && item.data.parentId === this.data[this.model_component_index].data.nodeId && item.data.nodeType === 3) 
            {
                if(this.onetab)
                {
                    this.onetab =! this.onetab;
                    this.activetab = item.data.nodeName;
                    if(item.data.modeltype == 1)
				        this.$router.push("/models/feature");
			        else if(item.data.modeltype == 2) 
                        this.$router.push("/models/component");
                    else if(item.data.modeltype == 3)
                        this.$router.push("/models/binding_feature_component");
                    Bus.$emit('updateactivetab',this.activetab);
                }
                return true;
            }
            if(this.model_component_index === -1)
            {
                this.onetab = true;
                this.activetab = '';
                this.model_component = '';
                Bus.$emit('updateactivetab',this.activetab);
            }
            return false;
        },
        getnewnodeid(){ //get a new nodeID
			let temp = 0;
			for(let i = 0; i < this.data.length; i++)
				temp = this.data[i].data.nodeId > temp ? this.data[i].data.nodeId : temp;
			return temp + 1;
		},
        clickactivetab (index) {
            this.activetab = this.data[index].data.nodeName;
			if(this.data[index].data.modeltype == 1)
				this.$router.push("/models/feature");
			else if(this.data[index].data.modeltype == 2) 
                this.$router.push("/models/component");
            else if(this.data[index].data.modeltype == 3)
                this.$router.push("/models/binding_feature_component");
            Bus.$emit('updateactivetab',this.activetab);
            Bus.$emit('updatemodel_component2',index);
        }
    },
    mounted () {
        Bus.$on('updatemodel_component3', index =>{
            this.model_component_index = index;
            if(index === -1)
                this.model_component = '';
            else
                this.model_component = this.data[index].data.nodeName;
        });
        Bus.$on('updatemodel_component1', index =>{
            this.model_component_index = index;
            if(index === -1)
                this.model_component = '';
            else
                this.model_component = this.data[index].data.nodeName;
        });
        Bus.$on('clickactivetab', data =>{
            this.activetab = data;
        });
        Bus.$on('updatedata', data => {
            this.data = data;
        });
        Bus.$on('updatelayertype', data => {
            this.layer_type = data;
        });
        Bus.$on('resetall', data => { //reset the mxgraph component
            this.mxgraphreset = false;
            Vue.nextTick(()=>{
                this.mxgraphreset = true;
                this.model_component = data;
                localStorage.clear();
            },100);
        });
        Bus.$on('importxml', data => { //reset the mxgraph component
            this.layer_type = 2;
            this.mxgraphreset = false;
            Vue.nextTick(()=>{
                this.mxgraphreset = true;
                this.model_component = data;
            },100);
        });
        Bus.$on('importxml2', layer =>{
            if(layer.t2 === this.model_component_index)
            {
            for(let i = this.model_component_index + 1; i < this.data.length; i++)
			{
                if(this.data[i].data.level < this.data[this.model_component_index].data.level || this.data[i].data.level === this.data[this.model_component_index].data.level
                || this.data[i].data.nodeType === 1 || i == this.data.length-1)
				{
					this.data.splice(this.model_component_index + 1, i - this.model_component_index - 1);
					break;
				}	
            }
            for(let key in layer.t1)
            {
                let temp = [];
                if(key === 'binding_feature_component')
                {
                    temp[0] = key;
                    temp[1] = 3;
                }
                else
				{
					temp = key.split('|');
					if(temp[1] === 'feature')
						temp[1] = 1;
					else if(temp[1] === 'component')
						temp[1] = 2;
				}
                this.data.splice(this.model_component_index + 1, 0 , {
					children: [],
					data: {
						open: false,
						isSelected: false,
						level:  this.data[this.model_component_index].data.level + 1,
						nodeId:  this.getnewnodeid(),
						nodeName: temp[0],
						nodeType: 3,
						parentId: this.data[this.model_component_index].data.nodeId,
					    projectId: this.data[this.model_component_index].data.projectId,
						modeltype: temp[1],
						contextmenuIndex: 2
					},
					numberOfChildren: 0
				});
				this.data[this.model_component_index].numberOfChildren++;
            }
            }
        });
        Bus.$on('addlayer', data => { 
            this.layer_type = 1;
            this.mxgraphreset = false;
            Vue.nextTick(()=>{
                this.mxgraphreset = true;
                this.model_component = data;
            },100);
        });
        Bus.$on('deletelayer', data =>{
            this.data = data;
            this.layer_type = 1;
            this.mxgraphreset = false;
            Vue.nextTick(()=>{
                this.mxgraphreset = true;
                this.activetab = "binding_feature_component";
                this.$router.push("/models/binding_feature_component");
                Bus.$emit('updateactivetab',this.activetab);
            },100);
        });
    },
    watch:{
        // activetab:function(val){
        //     if(val === '')
        //     {
        //         this.mxgraphreset = false;
        //         Vue.nextTick(()=>{
        //             this.mxgraphreset = true;
        //         },100);
        //     }
        // }
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