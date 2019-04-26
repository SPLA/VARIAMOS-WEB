<template>
	<div class="naza-tree-warp">
		<div class="naza-tree-inner show-wrap">
			<ul class="naza-tree">
				<div v-for="(item, $index) in data" :key="$index">
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
		// if the cache of selected elements changes, change the element tree of binding type
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
			// construct element tree for feature type
			if(this.layertype === 1 && this.getxml !== '')
			{
				xmlobject = xmlobject.mxGraphModel.root;
				// put top elements in level one
				let element_list = ['root', 'abstract', 'concrete'];
				for(let x = 0; x < element_list.length; x++)
				{
					if(xmlobject[element_list[x]] !== undefined)
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

				// construct hierarchical structure based on relations
				let rel_list = ['rel_abstract_abstract', 'rel_abstract_root', 'rel_concrete_abstract', 'rel_concrete_concrete', 'rel_concrete_root'];
				for(let x = 0; x < rel_list.length; x++)
				{
					if(xmlobject[rel_list[x]] !== undefined)
					{
						if(Array.isArray(xmlobject[rel_list[x]]))
						{
							for(let i = 0; i < xmlobject[rel_list[x]].length; i++)
							{
								if(xmlobject[rel_list[x]][i].mxCell['@parent'] === modeltype && xmlobject[rel_list[x]][i]['@relType'] !== 'requires' &&
								xmlobject[rel_list[x]][i]['@relType'] !== 'excludes')
									this.movearray(xmlobject[rel_list[x]][i].mxCell['@target'], xmlobject[rel_list[x]][i].mxCell['@source']);
							}
						}
						else
						{
							if(xmlobject[rel_list[x]].mxCell['@parent'] === modeltype && xmlobject[rel_list[x]]['@relType'] !== 'requires' &&
							xmlobject[rel_list[x]]['@relType'] !== 'excludes')
								this.movearray(xmlobject[rel_list[x]].mxCell['@target'], xmlobject[rel_list[x]].mxCell['@source']);
						}
					}
				}
				// construct hierarchical structure based on bundles
				let rel_bundle_list1 = ['rel_bundle_root', 'rel_bundle_abstract'];
				let rel_bundle_list2 = ['rel_abstract_bundle', 'rel_concrete_bundle'];
				for(let x = 0; x < rel_bundle_list1.length; x++)
				{
					for(let y = 0; y < rel_bundle_list2.length; y++)
					{
						if(xmlobject[rel_bundle_list1[x]] !== undefined && xmlobject[rel_bundle_list2[y]] !== undefined)
						{
							if(Array.isArray(xmlobject[rel_bundle_list1[x]]))
							{
								for(let i = 0; i < xmlobject[rel_bundle_list1[x]].length; i++)
								{
									if(Array.isArray(xmlobject[rel_bundle_list2[y]]))
									{
										for(let j = 0; j < xmlobject[rel_bundle_list2[y]].length; j++)
										{
											if(xmlobject[rel_bundle_list1[x]][i].mxCell['@parent'] === modeltype &&
											xmlobject[rel_bundle_list2[y]][j].mxCell['@parent'] === modeltype &&
											xmlobject[rel_bundle_list1[x]][i].mxCell['@source'] === xmlobject[rel_bundle_list2[y]][j].mxCell['@target'])
												this.movearray(xmlobject[rel_bundle_list1[x]][i].mxCell['@target'],xmlobject[rel_bundle_list2[y]][j].mxCell['@source']);
										}
									}
									else
									{
										if(xmlobject[rel_bundle_list1[x]][i].mxCell['@parent'] === modeltype &&
										xmlobject[rel_bundle_list2[y]].mxCell['@parent'] === modeltype &&
										xmlobject[rel_bundle_list1[x]][i].mxCell['@source'] === xmlobject[rel_bundle_list2[y]].mxCell['@target'])
											this.movearray(xmlobject[rel_bundle_list1[x]][i].mxCell['@target'],xmlobject[rel_bundle_list2[y]].mxCell['@source']);
									}
								}
							}
							else
							{
								if(Array.isArray(xmlobject[rel_bundle_list2[y]]))
								{
									for(let j = 0; j < xmlobject[rel_bundle_list2[y]].length; j++)
									{
										if(xmlobject[rel_bundle_list1[x]].mxCell['@parent'] === modeltype &&
										xmlobject[rel_bundle_list2[y]][j].mxCell['@parent'] === modeltype &&
										xmlobject[rel_bundle_list1[x]].mxCell['@source'] === xmlobject[rel_bundle_list2[y]][j].mxCell['@target'])
											this.movearray(xmlobject[rel_bundle_list1[x]].mxCell['@target'],xmlobject[rel_bundle_list2[y]][j].mxCell['@source']);
									}
								}
								else
								{
									if(xmlobject[rel_bundle_list1[x]].mxCell['@parent'] === modeltype &&
									xmlobject[rel_bundle_list2[y]].mxCell['@parent'] === modeltype &&
									xmlobject[rel_bundle_list1[x]].mxCell['@source'] === xmlobject[rel_bundle_list2[y]].mxCell['@target'])
										this.movearray(xmlobject[rel_bundle_list1[x]].mxCell['@target'],xmlobject[rel_bundle_list2[y]].mxCell['@source']);
								}
							}
						}
					}
				}
			}
			// construct element tree for component type
			else if(this.layertype === 2 && this.getxml !== '')
			{
				xmlobject = xmlobject.mxGraphModel.root;
				// put top elements in level one
				let element_list = getModelInfo()[modeltype].topElements;
				for(let x = 0; x < element_list.length; x++)
				{
					if(xmlobject[element_list[x]] !== undefined)
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
				// construct hierarchical tree based on relations
				if(xmlobject.rel_file_component !== undefined)
				{
					if(Array.isArray(xmlobject.rel_file_component))
					{
						for(let i = 0; i < xmlobject.rel_file_component.length; i++)
						{
							if(xmlobject.rel_file_component[i].mxCell['@parent'] === modeltype)
							{
								if(Array.isArray(xmlobject.file))
								{
									for(let j = 0; j < xmlobject.file.length; j++)
									{
										if(xmlobject.rel_file_component[i].mxCell['@source'] === xmlobject.file[j]['@id'])
										{
											for(let x = 0; x < this.data.length; x++)
											{
												if(this.data[x].id === xmlobject.rel_file_component[i].mxCell['@target'])
													this.insertdata(xmlobject.file[j]['@label'], xmlobject.file[j]['@id'], 2, x, this.data[x].id, false);
											}
										}
									}
								}
								else
								{
									if(xmlobject.rel_file_component[i].mxCell['@source'] === xmlobject.file['@id'])
									{
										for(let x = 0; x < this.data.length; x++)
										{
											if(this.data[x].id === xmlobject.rel_file_component[i].mxCell['@target'])
												this.insertdata(xmlobject.file['@label'], xmlobject.file['@id'], 2, x, this.data[x].id, false);
										}
									}
								}
							}
						}
					}
					else
					{
						if(xmlobject.rel_file_component.mxCell['@parent'] === modeltype)
						{
							if(Array.isArray(xmlobject.file))
							{
								for(let j = 0; j < xmlobject.file.length; j++)
								{
									if(xmlobject.rel_file_component.mxCell['@source'] === xmlobject.file[j]['@id'])
									{
										for(let x = 0; x < this.data.length; x++)
										{
											if(this.data[x].id === xmlobject.rel_file_component.mxCell['@target'])
												this.insertdata(xmlobject.file[j]['@label'], xmlobject.file[j]['@id'], 2, x, this.data[x].id, false);
										}
									}
								}
							}
							else
							{
								if(xmlobject.rel_file_component.mxCell['@source'] === xmlobject.file['@id'])
								{
									for(let x = 0; x < this.data.length; x++)
									{
										if(this.data[x].id === xmlobject.rel_file_component.mxCell['@target'])
											this.insertdata(xmlobject.file['@label'], xmlobject.file['@id'], 2, x, this.data[x].id, false);
									}
								}
							}
						}
					}
				}
			}
			// construct element tree for binding type
			else if(this.layertype === 3 && this.getxml !== '')
			{
				this.constructbindingmodel(xmlobject.mxGraphModel.root, modeltype);
			}
		},
		/**
		 * construct element tree for binding type
		 * @param {object} xmlobject the object of xml
		 * @param {string} modeltype the type of the model
		 */
		constructbindingmodel(xmlobject, modeltype) {
			// put top elements in level one
			let element_list = getModelInfo()[modeltype].topElements;
			for(let x = 0; x < element_list.length; x++)
			{
				if(xmlobject[element_list[x]] !== undefined)
				{
					if(Array.isArray(xmlobject[element_list[x]]))
					{
						for(let i = 0; i < xmlobject[element_list[x]].length; i++)
						{
							if(xmlobject[element_list[x]][i].mxCell['@parent'] === modeltype)
							{
								// if concrete is selected in feature model or if component is selected in component model
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
							// if concrete is selected in feature model or if component is selected in component model
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
			}

			// construct hierarchical tree based on bundles
			let cache = this.data;
			this.data = [];
			// the list of selected elements
			let id_list = [];
			for(let i = 0; i < cache.length; i++)
			{
				id_list.push(cache[i].id);
			}
			if(xmlobject.rel_concrete_component !== undefined)
			{
				if(Array.isArray(xmlobject.rel_concrete_component))
				{
					for(let i = 0; i < xmlobject.rel_concrete_component.length; i++)
					{
						if(xmlobject.rel_concrete_component[i].mxCell['@parent'] === modeltype)
						{
							for(let x = 0; x < cache.length; x++)
							{
								if(cache[x].id === xmlobject.rel_concrete_component[i].mxCell['@target'])
									this.insertdata(cache[x].name, cache[x].id, 1, -1, -1, cache[x].tick);
								if(cache[x].id === xmlobject.rel_concrete_component[i].mxCell['@source'])
									this.insertdata(cache[x].name, cache[x].id, 2, 0, xmlobject.rel_concrete_component[i].mxCell['@target'], cache[x].tick);
							}
						}
					}
				}
				else
				{
					if(xmlobject.rel_concrete_component.mxCell['@parent'] === modeltype)
					{
						for(let x = 0; x < cache.length; x++)
						{
							if(cache[x].id === xmlobject.rel_concrete_component.mxCell['@target'])
								this.insertdata(cache[x].name, cache[x].id, 1, -1, -1, cache[x].tick);
							if(cache[x].id === xmlobject.rel_concrete_component.mxCell['@source'])
								this.insertdata(cache[x].name, cache[x].id, 2, 0, xmlobject.rel_concrete_component.mxCell['@target'], cache[x].tick);
						}
					}
				}
			}
			if(xmlobject.rel_bundle_component !== undefined && xmlobject.rel_concrete_bundle !== undefined)
			{
				if(Array.isArray(xmlobject.rel_bundle_component))
				{
					for(let i = 0; i < xmlobject.rel_bundle_component.length; i++)
					{
						// only one component element is constructed
						let onetime = true;
						if(Array.isArray(xmlobject.rel_concrete_bundle))
						{
							for(let j = 0; j < xmlobject.rel_concrete_bundle.length; j++)
							{
								// if we find the component and concrete are linked with bundle and they are all in the selected list
								if(xmlobject.rel_bundle_component[i].mxCell['@parent'] === modeltype &&
								xmlobject.rel_concrete_bundle[j].mxCell['@parent'] === modeltype &&
								xmlobject.rel_bundle_component[i].mxCell['@source'] === xmlobject.rel_concrete_bundle[j].mxCell['@target'] &&
								id_list.includes(xmlobject.rel_bundle_component[i].mxCell['@target']) &&
								id_list.includes(xmlobject.rel_concrete_bundle[j].mxCell['@source']))
								{
									for(let x = 0; x < cache.length; x++)
									{
										if(cache[x].id === xmlobject.rel_bundle_component[i].mxCell['@target'] && onetime)
										{
											this.insertdata(cache[x].name, cache[x].id, 1, -1, -1, cache[x].tick);
											onetime = false;
										}
										if(cache[x].id === xmlobject.rel_concrete_bundle[j].mxCell['@source'])
											this.insertdata(cache[x].name, cache[x].id, 2, 0, xmlobject.rel_bundle_component[i].mxCell['@target'], cache[x].tick);
									}
								}
							}
						}
						else
						{
							if(xmlobject.rel_bundle_component[i].mxCell['@parent'] === modeltype &&
								xmlobject.rel_concrete_bundle.mxCell['@parent'] === modeltype &&
								xmlobject.rel_bundle_component[i].mxCell['@source'] === xmlobject.rel_concrete_bundle.mxCell['@target'] &&
								id_list.includes(xmlobject.rel_bundle_component[i].mxCell['@target']) &&
								id_list.includes(xmlobject.rel_concrete_bundle.mxCell['@source']))
								{
									for(let x = 0; x < cache.length; x++)
									{
										if(cache[x].id === xmlobject.rel_bundle_component[i].mxCell['@target'] && onetime)
										{
											this.insertdata(cache[x].name, cache[x].id, 1, -1, -1, cache[x].tick);
											onetime = false;
										}
										if(cache[x].id === xmlobject.rel_concrete_bundle.mxCell['@source'])
											this.insertdata(cache[x].name, cache[x].id, 2, 0, xmlobject.rel_bundle_component[i].mxCell['@target'], cache[x].tick);
									}
								}
						}
					}
				}
				else
				{
					// only one component element is constructed
					let onetime = true;
					if(Array.isArray(xmlobject.rel_concrete_bundle))
					{
						for(let j = 0; j < xmlobject.rel_concrete_bundle.length; j++)
						{
							if(xmlobject.rel_bundle_component.mxCell['@parent'] === modeltype &&
							xmlobject.rel_concrete_bundle[j].mxCell['@parent'] === modeltype &&
							xmlobject.rel_bundle_component.mxCell['@source'] === xmlobject.rel_concrete_bundle[j].mxCell['@target'] &&
							id_list.includes(xmlobject.rel_bundle_component.mxCell['@target']) &&
							id_list.includes(xmlobject.rel_concrete_bundle[j].mxCell['@source']))
							{
								for(let x = 0; x < cache.length; x++)
								{
									if(cache[x].id === xmlobject.rel_bundle_component.mxCell['@target'] && onetime)
									{
										this.insertdata(cache[x].name, cache[x].id, 1, -1, -1, cache[x].tick);
										onetime = false;
									}
									if(cache[x].id === xmlobject.rel_concrete_bundle[j].mxCell['@source'])
										this.insertdata(cache[x].name, cache[x].id, 2, 0, xmlobject.rel_bundle_component.mxCell['@target'], cache[x].tick);
								}
							}
						}
					}
					else
					{
						if(xmlobject.rel_bundle_component.mxCell['@parent'] === modeltype &&
							xmlobject.rel_concrete_bundle.mxCell['@parent'] === modeltype &&
							xmlobject.rel_bundle_component.mxCell['@source'] === xmlobject.rel_concrete_bundle.mxCell['@target'] &&
							id_list.includes(xmlobject.rel_bundle_component.mxCell['@target']) &&
							id_list.includes(xmlobject.rel_concrete_bundle.mxCell['@source']))
							{
								for(let x = 0; x < cache.length; x++)
								{
								if(cache[x].id === xmlobject.rel_bundle_component.mxCell['@target'] && onetime)
									{
										this.insertdata(cache[x].name, cache[x].id, 1, -1, -1, cache[x].tick);
										onetime = false;
									}
									if(cache[x].id === xmlobject.rel_concrete_bundle.mxCell['@source'])
										this.insertdata(cache[x].name, cache[x].id, 2, 0, xmlobject.rel_bundle_component.mxCell['@target'], cache[x].tick);
								}
							}
					}
				}
			}
			// check again the whole tree
			for(let i = 0; i < this.data.length; i++)
			{
				for(let j = 0; j < cache.length; j++)
				{
					if(this.data[i].id === cache[j].id)
					{
						cache.splice(j,1);
						j--;
					}
				}
			}
			if(cache.length !== 0)
			{
				for(let i = 0; i < cache.length; i++)
				{
					this.insertdata(cache[i].name, cache[i].id, 1, -1, -1, cache[i].tick);
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
				if(this.data[j].id === i1)
					new_index = j;
				if(this.data[j].id === i2)
					old_index = j;
			}
			// find the old elements and push them to temp
			let counter = 1;
			let temp = [];
			let level_difference = this.data[new_index].level - this.data[old_index].level;
			this.data[old_index].level += level_difference + 1;
			this.data[old_index].parentId = i1;
			temp.unshift(this.data[old_index]);
			for(let j = old_index + 1; j < this.data.length; j++)
			{
				if(this.data[j].level === this.data[old_index].level-level_difference-1 || this.data[j].level < this.data[old_index].level-level_difference-1)
					break;
				this.data[j].level += level_difference + 1;
				temp.unshift(this.data[j]);
				counter++;
			}
			// delete the old elements
			this.data.splice(old_index,counter);
			for(let j = 0; j < this.data.length; j++)
			{
				if(this.data[j].id === i1)
					new_index = j;
			}
			// add the new elements
			for(let j = 0; j < counter; j++)
			{
				this.data.splice(new_index + 1, 0, temp[j]);
			}
		},
		/**
		 * insert the element into the element tree data
		 * @param {string} name the name of the element
		 * @param {string} newid the id of the element
		 * @param {number} level the level of the element
		 * @param {number} parentindex the index of parent in the element tree
		 * @param {number} parentid the parent id in the element tree
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
					if(this.data[index-i].open === false)
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
			_this.data[index].open = !_this.data[index].open;	
		},
		/**
		 * once checkbox changed, update the cache in the vuex
		 */
		itemclick(index) {
			if(this.data[index].tick)
				this.$store.dispatch('addcacheselected', this.data[index].id);
			else if(!this.data[index].tick)
				this.$store.dispatch('removecacheselected', this.data[index].id);
			// check all the elements who have same id for binding model
			if(this.layertype === 3)
			{
				for(let i = 0; i < this.data.length; i++)
				{
					if(this.data[i].id === this.data[index].id)
						this.data[i].tick = this.data[index].tick;
				}
			}
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


