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
					<keep-alive>
						<model :key='activetab' :activetab="activetab"></model>
					</keep-alive>
				</div>
            </div>
        </div>
</template>

<script>
import model from './Models.vue'
import Bus from '../assets/js/common/bus.js'

export default{
    components:{
        model
    },
    data: function() {
        return{
            activetab: '',
            onetab: true,
            data:[]
		}
    },
    methods:{
        checktabs: function(item){ //set the first one diagram to activetab
            var projectid = -1;
            for(let i = 0; i < this.data.length; i++)
            {
                if(this.data[i].data.level == 1 && this.data[i].data.open)
                    projectid = this.data[i].data.nodeId;
            }
            if(item.data.projectId === projectid && item.data.nodeType === 3) 
            {
                if(this.onetab)
                {
                    this.onetab =! this.onetab;
                    this.activetab = item.data.nodeName;
                }
                return true;
            }
            if(projectid === -1)
            {
                this.onetab = true;
                this.activetab = '';
            }
            return false;
        },
        clickactivetab (index) {
            this.activetab = this.data[index].data.nodeName;
            // if(this.data[index].data.modeltype == 1)
				this.$router.push("/models/feature");
			// else if(this.data[index].data.modeltype == 2) 
            //     this.$router.push("/models/component");
            // else if(this.data[index].data.modeltype == 3)
            //     this.$router.push("/models/binding_feature_component");
        }
    },
    mounted () {
        Bus.$on('deletediagram', diagram => { // check the deleted diagram is same as activetab
            if(diagram.data.nodeName === this.activetab)
            {
                this.onetab = true;
                for(let i = 0; i < this.data.length; i++)
                {
                    if(this.data[i].data.parentId == diagram.data.parentId) 
                    {
                        if(this.onetab)
                        {
                            this.onetab =! this.onetab;
                            this.activetab = this.data[i].data.nodeName;
                        }
                    }
                }
                if(this.onetab)
                {
                    this.activetab = '';
                }
            }
        });
        Bus.$on('clickactivetab', data =>{
            this.activetab = data;
        });
        Bus.$on('updatedata', data => {
            this.data = data;
		});
    },
    watch:{
        activetab: function(val) {
            Bus.$emit('updateactivetab',val);
        }
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