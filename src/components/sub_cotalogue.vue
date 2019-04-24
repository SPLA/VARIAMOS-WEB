<template>
	<div class="naza-tree-warp">
		<div class="naza-tree-inner show-wrap">
			<ul class="naza-tree">
				<div v-for="(item, $index) in data" :key="item.id">
					<li class="naza-tree-row"
					v-if="checkchildnode($index)">
					<a :style="{paddingLeft: (20 * item.level) + 'px'}">
						<i
							aria-hidden="true"
							:class="[item.open?'fas fa-angle-down':'fas fa-angle-right']"
							@click="expand_menu($index)"
							:style="{position: 'absolute',left: (20 * item.level - 17) + 'px',top: '6px'}">
						</i>
						<span class="name"
							:title="item.name"
							:style="{display:'inline-block', userSelect: 'none'}">
								<Checkbox v-model="item.tick" @on-change="itemclick($index)">
									{{item.name}}
								</Checkbox>
						</span>
					</a>
				</li>
				</div>
			</ul>
		</div>
	</div>
</template>
<script>
/* eslint-disable */
import xml2json from '../assets/js/common/xml2json.js'
export default {
	// the element name and type in the tree data
	props: ['layername','layertype'],
	data () {
		return {
			// the element tree data to show
			data: []
		}
	},
	mounted: function() {
		// load the element tree
		this.mainprocess();
	},
	watch: {
		// if the xml changes, clear cache and update the element tree
		getxml: function(val){
			this.mainprocess();		
		},
		getcache_selected: function(val){
			if(this.layertype === 3 && this.getxml !== '')
			{
				this.data = [];
				let modeltype = this.layername;
				var xmlDoc = (new DOMParser()).parseFromString(this.getxml,"text/xml");
				var xmlobject = JSON.parse(xml2json(xmlDoc,''));
				this.constructbindingmodel(xmlobject.mxGraphModel.root, modeltype);
			}
		}
	},
	computed:{
		/**
		 * get the xml from the store
		 * @returns {string}
		 */
		getxml (){
			return this.$store.getters.getxml;
		},
		/**
    	 * @returns {array} the selected elements from feature and component models
    	 */
    	getcache_selected (){
    		return this.$store.getters.getcacheselected;
    	}
	},
	methods: {
		/**
		 * construct the element tree
		 */
		mainprocess() {
			this.data = [];
			// the current version only accepts three models
			let modeltype = this.layername;
			// if(this.layertype === 1)
			// 	modeltype = this.layername + '|feature';
			// else if(this.layertype === 2)
			// 	modeltype = this.layername + '|component';
			// else if(this.layertype === 3)
			// 	modeltype = 'binding_feature_component';
			
			// transform xml to JSON and then to object
			var xmlDoc = (new DOMParser()).parseFromString(this.getxml,"text/xml");
			var xmlobject = JSON.parse(xml2json(xmlDoc,''));
			// if it is feature model
			if(this.layertype === 1 && this.getxml !== '')
			{
				console.log(xmlobject.mxGraphModel.root);
				xmlobject = xmlobject.mxGraphModel.root;
				let element_list = ['root', 'abstract', 'concrete'];
				for(let x = 0; x < element_list.length; x++)
				{
					if(Array.isArray(xmlobject[element_list[x]]))
					{
						for(let i = 0; i < xmlobject[element_list[x]].length; i++)
						{
							if(xmlobject[element_list[x]][i].mxCell['@parent'] === modeltype)
							{
								if(this.getcache_selected.includes(xmlobject[element_list[x]][i]['@id']))
									this.insertdata(xmlobject[element_list[x]][i]['@label'],xmlobject[element_list[x]][i]['@id'], 1, -1, -1, true);
								else
									this.insertdata(xmlobject[element_list[x]][i]['@label'],xmlobject[element_list[x]][i]['@id'], 1, -1, -1, false);
							}
						}
					}
					else
					{
						if(xmlobject[element_list[x]].mxCell['@parent'] === modeltype)
						{
							if(this.getcache_selected.includes(xmlobject[element_list[x]]['@id']))
								this.insertdata(xmlobject[element_list[x]]['@label'],xmlobject[element_list[x]]['@id'], 1, -1, -1, true);
							else
								this.insertdata(xmlobject[element_list[x]]['@label'],xmlobject[element_list[x]]['@id'], 1, -1, -1, false);
						}
					}
				}
			}
			else if(this.layertype === 2 && this.getxml !== '')
			{
				xmlobject = xmlobject.mxGraphModel.root;
				let element_list = ['file', 'component'];
				for(let x = 0; x < element_list.length; x++)
				{
					if(Array.isArray(xmlobject[element_list[x]]))
					{
						for(let i = 0; i < xmlobject[element_list[x]].length; i++)
						{
							if(xmlobject[element_list[x]][i].mxCell['@parent'] === modeltype)
							{
								if(this.getcache_selected.includes(xmlobject[element_list[x]][i]['@id']))
									this.insertdata(xmlobject[element_list[x]][i]['@label'],xmlobject[element_list[x]][i]['@id'], 1, -1, -1, true);
								else
									this.insertdata(xmlobject[element_list[x]][i]['@label'],xmlobject[element_list[x]][i]['@id'], 1, -1, -1, false);
							}
						}
					}
					else
					{
						if(xmlobject[element_list[x]].mxCell['@parent'] === modeltype)
						{
							if(this.getcache_selected.includes(xmlobject[element_list[x]]['@id']))
								this.insertdata(xmlobject[element_list[x]]['@label'],xmlobject[element_list[x]]['@id'], 1, -1, -1, true);
							else
								this.insertdata(xmlobject[element_list[x]]['@label'],xmlobject[element_list[x]]['@id'], 1, -1, -1, false);
						}
					}
				}
			}
			else if(this.layertype === 3 && this.getxml !== '')
			{
				this.constructbindingmodel(xmlobject.mxGraphModel.root, modeltype);
			}
		},
		constructbindingmodel(xmlobject, modeltype) {
			let element_list = ['concrete', 'component'];
			for(let x = 0; x < element_list.length; x++)
			{
				if(Array.isArray(xmlobject[element_list[x]]))
				{
					for(let i = 0; i < xmlobject[element_list[x]].length; i++)
					{
						if(xmlobject[element_list[x]][i].mxCell['@parent'] === modeltype)
						{
							if(this.getcache_selected.includes(xmlobject[element_list[x]][i]['@id'].substring(4)))
							{
								if(this.getcache_selected.includes(xmlobject[element_list[x]][i]['@id']))
									this.insertdata(xmlobject[element_list[x]][i]['@label'],xmlobject[element_list[x]][i]['@id'], 1, -1, -1, true);
								else
									this.insertdata(xmlobject[element_list[x]][i]['@label'],xmlobject[element_list[x]][i]['@id'], 1, -1, -1, false);
							}
						}
					}
				}
				else
				{
					if(xmlobject[element_list[x]].mxCell['@parent'] === modeltype)
					{
						if(this.getcache_selected.includes(xmlobject[element_list[x]]['@id'].substring(4)))
						{
							if(this.getcache_selected.includes(xmlobject[element_list[x]]['@id']))
								this.insertdata(xmlobject[element_list[x]]['@label'],xmlobject[element_list[x]]['@id'], 1, -1, -1, true);
							else
								this.insertdata(xmlobject[element_list[x]]['@label'],xmlobject[element_list[x]]['@id'], 1, -1, -1, false);
						}
					}
				}
			}
		},
		/**
		 * move the element from old index to new index in the array
		 * @param {number} i1 the id of the new index of the element
		 * @param {number} i2 the id of the old index of the element
		 */
		movearray(i1,i2){
			let new_index = -1;
			let old_index = -1;
			for(let j = 0; j < this.data.length; j++)
			{
				if(this.data[j].data.nodeId === i1)
					new_index = j;
				if(this.data[j].data.nodeId === i2)
					old_index = j;
			}
			// find the old elements and push them to temp
			let counter = 1;
			let temp = [];
			let level_difference = this.data[new_index].data.level - this.data[old_index].data.level;
			this.data[old_index].data.level += level_difference + 1;
			this.data[old_index].data.parentId === i1;
			temp.unshift(this.data[old_index]);
			for(let j = old_index + 1; j < this.data.length; j++)
			{
				if(this.data[j].data.level === this.data[old_index].data.level || this.data[j].data.level < this.data[old_index].data.level)
					break;
				this.data[j].data.level += level_difference + 1;
				temp.unshift(this.data[j]);
				counter++;
			}
			// delete the old elements
			this.data.splice(old_index,counter);
			for(let j = 0; j < this.data.length; j++)
			{
				if(this.data[j].data.nodeId === i1)
					new_index = j;
			}
			// add the new elements
			for(let j = 0; j < counter; j++)
			{
				this.data.splice(new_index + 1, 0, temp[j]);
			}
			this.data[new_index].numberOfChildren++;
		},
		/**
		 * insert the element into the element tree data
		 * @param {string} name the name of the element
		 * @param {number} newid the id of the element
		 * @param {number} level the level of the element
		 * @param {number} parentid the parent id in the element tree
		 * @param {number} parentindex the index of parent in the element tree
		 * @param {boolean} tick the selection of the element
 		 */
		insertdata(name, newid, level, parentindex, parentid, tick) {
            this.data.splice(parentindex + 1, 0 ,{
				open: true,
				level: level,
				id: newid,
				name: name,
				tick: tick,
				parentId: parentid  
			});
		},
		/**
		 * the rule to show up the element of the element tree
		 * @param {number} index the index of the current element
		 */
		checkchildnode(index) {
			let temp = true;
			let current_level = this.data[index].level;
			for(let i = 1; i < index+1; i++)
			{
				// if the parent or grandparent of the element is not open, this element is not shown
				if(this.data[index-i].level < current_level)
				{
					current_level = this.data[index-i].level;
					if(this.data[index-i].data.open === false)
					{
						temp = false;
						break;
					}
				}
			}
			return temp;
		},
		/**
		 * set open and close to the element
		 * @param {number} index the index of the current element
		 */
		expand_menu(index) {
			var _this = this;
			_this.data[index].data.open = !_this.data[index].data.open;	
		},
		itemclick(index) {
			if(this.data[index].tick)
				this.$store.dispatch('addcacheselected', this.data[index].id);
			else if(!this.data[index].tick)
				this.$store.dispatch('removecacheselected', this.data[index].id);
		}
	}
}
</script>
<style scoped>
	.naza-tree-warp {
		width: 100%;
		height: 100%;
		min-width: 175px;
		border-bottom: 0 none;
		border-top: 0 none;
		border-right: 0 none;
	}
	.naza-tree-warp .naza-tree-inner {
		/* max-height: 500px; */
		height: 100%;
		width: 100%;
		box-shadow: none;
		/* overflow: auto; */
		padding: 5px 0px;
		/* padding-bottom: 30px; */
	}
	.naza-tree-warp .naza-tree-inner .naza-tree {
		padding: 0;
		margin: 0;
		cursor: pointer;
		display: inline-block;
		min-width: 100%;
	}
	.naza-tree-warp .naza-tree-inner .naza-tree .selected {
		background-color: #5bc0de;
	}
	.naza-tree-warp .naza-tree-inner .naza-tree .naza-tree-row {
		list-style: none;
		min-width: 250px;
		line-height: 30px;
		height: 30px;
		float: none;
		color: #555;
	}
	.naza-tree-warp .naza-tree-inner .naza-tree .naza-tree-row:hover {
		background-color: #e5e5e5;
	}
	.naza-tree-warp .naza-tree-inner .naza-tree .naza-tree-row a {
		display: block;
		position: relative;
		line-height: 30px;
		height: 30px;
		padding: 0px 10px;
		text-decoration: none;
		text-align: left;
		color: #555;
		font-size: 12px;
	}
	.naza-tree-warp .naza-tree-inner .naza-tree .naza-tree-row a .name-container {
		display: inline-block;
		width: 100%;
		white-space: nowrap;
		vertical-align: middle;
	}
	.naza-tree-warp .naza-tree-inner .naza-tree .naza-tree-row a i {
		display: inline-block;
		font-size: 14px;
		margin-bottom: 2px;
	}
</style>


