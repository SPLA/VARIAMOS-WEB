<template>
	<div class="naza-tree-warp">
		<div class="naza-tree-inner show-wrap">
			<ul class="naza-tree">
				<div v-for="(item, $index) in data" :key="item.nodeId">
					<li class="naza-tree-row"
					v-if="checkchildnode($index)">
					<a :style="{paddingLeft: (20 * item.data.level) + 'px'}">
						<i
							aria-hidden="true"
							:class="[item.data.open?'fas fa-angle-down':'fas fa-angle-right']"
							@click="expand_menu($index)"
							:style="{position: 'absolute',left: (20 * item.data.level - 17) + 'px',top: '6px'}">
						</i>
						<span class="name"
							:title="item.data.nodeName"
							:style="{display:item.data.nodeType===2?'initial':'inline-block',
									userSelect: 'none'}">
								<Checkbox v-model="item.data.tick">
									{{item.data.nodeName}}
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
			// the element tree data
			data: [],
			// the cache to store the hierarchical tree
			treecache: []
		}
	},
	mounted: function() {
		// load the element tree
		this.mainprocess();
	},
	watch: {
		// if the xml changes, clear cache and update the element tree
		getxml: function(val){
			this.treecache = [];
			this.mainprocess();		
		}
	},
	computed:{
		/**
		 * get the xml from the store
		 * @returns {string}
		 */
		getxml (){
			return this.$store.getters.getxml;
		}
	},
	methods: {
		/**
		 * construct the element tree
		 * @todo improve the rule of showing up elements
		 */
		mainprocess() {
			this.data = [];
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
				/**
				 * get root element and insert to element tree data
				 * @function checkrootxml
				 * @function insertdata
				 */
				let rootxml = this.checkrootxml(xmlobject.mxGraphModel.root.root, modeltype);
				if(rootxml.t1 !== '' && rootxml.t2 !== '')
				{
					this.insertdata(rootxml.t1, rootxml.t2, 1, 'and', 'true', -1, -1);
					this.treecache.push(rootxml.t2);
					
					let checkall = true;
					let level = 1;
					// construct the element tree from lower level to higher level
					while(checkall)
					{
						checkall = false;
						// check all the relations
						let rel_lists = ['rel_general_root','rel_general_general','rel_leaf_root','rel_leaf_general'];
						for(let x = 0; x < rel_lists.length; x++)
						{
							if(xmlobject.mxGraphModel.root[rel_lists[x]] !== undefined)
							{
								if(Array.isArray(xmlobject.mxGraphModel.root[rel_lists[x]]))
								{
									for(let i = 0; i < xmlobject.mxGraphModel.root[rel_lists[x]].length; i++)
									{
										for(let j = 0; j < this.data.length; j++)
										{
											// if the target of the relation is in the element tree
											if(xmlobject.mxGraphModel.root[rel_lists[x]][i].mxCell['@parent'] === modeltype && 
											xmlobject.mxGraphModel.root[rel_lists[x]][i].mxCell['@target'] === this.data[j].data.nodeId && 
											this.data[j].data.level === level)
											{
												/**
												 * get the feature based on the source of the relation
												 * @function getfeature
												 */
												let newtemp = this.getfeature(xmlobject.mxGraphModel.root.general, xmlobject.mxGraphModel.root[rel_lists[x]][i].mxCell['@source'], modeltype);
												if(newtemp.t1 === '' && newtemp.t2 === '')
													newtemp = this.getfeature(xmlobject.mxGraphModel.root.leaf, xmlobject.mxGraphModel.root[rel_lists[x]][i].mxCell['@source'], modeltype);
												// insert this feature to the element tree and set its mandatory
												if(xmlobject.mxGraphModel.root[rel_lists[x]][i]['@relType'] === 'mandatory')	
												{
													this.insertdata(newtemp.t1, newtemp.t2, level + 1, this.getbundletype(xmlobject.mxGraphModel.root, newtemp.t2, modeltype), 'true', this.data[j].data.nodeId, j);
													this.treecache.push(newtemp.t2);
												}
												else if(xmlobject.mxGraphModel.root[rel_lists[x]][i]['@relType'] === 'optional')	
												{
													this.insertdata(newtemp.t1, newtemp.t2, level + 1, this.getbundletype(xmlobject.mxGraphModel.root, newtemp.t2, modeltype), 'false', this.data[j].data.nodeId, j);
													this.treecache.push(newtemp.t2);
												}
												checkall = true;
											}
										}
									}
								}
								else
								{
									for(let j = 0; j < this.data.length; j++)
									{
										// if the target of the relation is in the element tree
										if(xmlobject.mxGraphModel.root[rel_lists[x]].mxCell['@parent'] === modeltype && 
										xmlobject.mxGraphModel.root[rel_lists[x]].mxCell['@target'] === this.data[j].data.nodeId && 
										this.data[j].data.level === level)
										{
											/**
											 * get the feature based on the source of the relation
											 * @function getfeature
											 */
											let newtemp = this.getfeature(xmlobject.mxGraphModel.root.general, xmlobject.mxGraphModel.root[rel_lists[x]].mxCell['@source'], modeltype);
											if(newtemp.t1 === '' && newtemp.t2 === '')
												newtemp = this.getfeature(xmlobject.mxGraphModel.root.leaf, xmlobject.mxGraphModel.root[rel_lists[x]].mxCell['@source'], modeltype);
											// insert this feature to the element tree and set its mandatory
											if(xmlobject.mxGraphModel.root[rel_lists[x]]['@relType'] === 'mandatory')	
											{
												this.insertdata(newtemp.t1, newtemp.t2, level + 1, this.getbundletype(xmlobject.mxGraphModel.root, newtemp.t2, modeltype), 'true', this.data[j].data.nodeId, j);
												this.treecache.push(newtemp.t2);
											}
											else if(xmlobject.mxGraphModel.root[rel_lists[x]]['@relType'] === 'optional')
											{
												this.insertdata(newtemp.t1, newtemp.t2, level + 1, this.getbundletype(xmlobject.mxGraphModel.root, newtemp.t2, modeltype), 'false', this.data[j].data.nodeId, j);
												this.treecache.push(newtemp.t2);
											}
											checkall = true;
										}
									}
								}
							}
						}
						// check all the bundles
						let rel_bundle_lists = ['rel_bundle_general','rel_bundle_root'];
						for(let x = 0; x < rel_bundle_lists.length; x++)
						{
							if(xmlobject.mxGraphModel.root[rel_bundle_lists[x]] !== undefined)
							{
								if(Array.isArray(xmlobject.mxGraphModel.root[rel_bundle_lists[x]]))
								{
									for(let i = 0; i < xmlobject.mxGraphModel.root[rel_bundle_lists[x]].length; i++)
									{
										for(let j = 0; j < this.data.length; j++)
										{
											// if the target of the bundle is in the element tree
											if(xmlobject.mxGraphModel.root[rel_bundle_lists[x]][i].mxCell['@parent'] === modeltype && 
											xmlobject.mxGraphModel.root[rel_bundle_lists[x]][i].mxCell['@target'] === this.data[j].data.nodeId && 
											this.data[j].data.level === level)
											{
												/**
												 * @function insertbundle
												 */
												this.insertbundle(xmlobject.mxGraphModel.root, xmlobject.mxGraphModel.root[rel_bundle_lists[x]][i].mxCell['@source'], modeltype, this.data[j].data.nodeId, j, level);
												checkall = true;
											}
										}
									}
								}
								else
								{
									for(let j = 0; j < this.data.length; j++)
									{
										// if the target of the bundle is in the element tree
										if(xmlobject.mxGraphModel.root[rel_bundle_lists[x]].mxCell['@parent'] === modeltype && 
										xmlobject.mxGraphModel.root[rel_bundle_lists[x]].mxCell['@target'] === this.data[j].data.nodeId && 
										this.data[j].data.level === level)
										{
											/**
											 * @function insertbundle
											 */
											this.insertbundle(xmlobject.mxGraphModel.root, xmlobject.mxGraphModel.root[rel_bundle_lists[x]].mxCell['@source'], modeltype, this.data[j].data.nodeId, j, level);
											checkall = true;
										}
									}
								}
							}
						}
						level += 1;
					}
				}
				// else	
				// 	this.$Notice.info({
                //     	title: 'Xml to Tree',
                //     	desc: 'Please put the root feature first!'
                // 	});
			}
			// else
			// 	this.$Notice.info({
            //         title: 'Xml to Tree',
            //         desc: 'The tree is constructed based on feature model!'
			//     });
			if(this.getxml !== '')
			{
				/**
				 * check all the elements which are not in the cache and insert them in the level 1 in the element tree data
				 * @function insertdata
				 */
				let list = ['root', 'general', 'leaf', 'component', 'file'];
				for(let i = 0; i < list.length; i++)
				{
					if(Array.isArray(xmlobject.mxGraphModel.root[list[i]]) && xmlobject.mxGraphModel.root[list[i]] !== undefined)
					{
						for(let j = 0; j < xmlobject.mxGraphModel.root[list[i]].length; j++)
						{
							if(xmlobject.mxGraphModel.root[list[i]][j].mxCell['@parent'] === modeltype && !this.treecache.includes(xmlobject.mxGraphModel.root[list[i]][j]['@id']))
								this.insertdata(xmlobject.mxGraphModel.root[list[i]][j]['@label'], xmlobject.mxGraphModel.root[list[i]][j]['@id'], 1, 'feature', 'true', -1, -1);
						}
					}
					else if(xmlobject.mxGraphModel.root[list[i]] !== undefined)
					{
						if(xmlobject.mxGraphModel.root[list[i]].mxCell['@parent'] === modeltype && !this.treecache.includes(xmlobject.mxGraphModel.root[list[i]]['@id']))
							this.insertdata(xmlobject.mxGraphModel.root[list[i]]['@label'], xmlobject.mxGraphModel.root[list[i]]['@id'], 1, 'feature', 'true', -1, -1);
					}
				}
				// set loop times for the review of the hierarchical tree
				let checkpoint = 0;
				if(Array.isArray(xmlobject.mxGraphModel.root.rel_general_general))
					checkpoint += xmlobject.mxGraphModel.root.rel_general_general.length;
				else
					checkpoint += 1;
				if(Array.isArray(xmlobject.mxGraphModel.root.rel_leaf_general))
					checkpoint += xmlobject.mxGraphModel.root.rel_leaf_general.length;
				else
					checkpoint += 1;
				while(checkpoint)
				{
				// if there is mandatory or optional relation, construct the hierachical structure
				let rel_lists = ['rel_general_general','rel_leaf_general'];
				for(let x = 0; x < rel_lists.length; x++)
				{
					if(xmlobject.mxGraphModel.root[rel_lists[x]] !== undefined)
					{
						if(Array.isArray(xmlobject.mxGraphModel.root[rel_lists[x]]))
						{
							for(let i = 0; i < xmlobject.mxGraphModel.root[rel_lists[x]].length; i++)
							{
								// if the target and source of the relation are not in the tree cache
								if(xmlobject.mxGraphModel.root[rel_lists[x]][i].mxCell['@parent'] === modeltype && 
								!this.treecache.includes(xmlobject.mxGraphModel.root[rel_lists[x]][i].mxCell['@target']) && 
								!this.treecache.includes(xmlobject.mxGraphModel.root[rel_lists[x]][i].mxCell['@source'])
								&& xmlobject.mxGraphModel.root[rel_lists[x]][i]['@relType'] !== 'requires' && xmlobject.mxGraphModel.root[rel_lists[x]][i]['@relType'] !== 'excludes')
								{
									this.movearray(xmlobject.mxGraphModel.root[rel_lists[x]][i].mxCell['@target'], xmlobject.mxGraphModel.root[rel_lists[x]][i].mxCell['@source']);
								}
							}
						}
						else
						{
							// if the target and source of the relation are not in the tree cache
							if(xmlobject.mxGraphModel.root[rel_lists[x]].mxCell['@parent'] === modeltype && 
							!this.treecache.includes(xmlobject.mxGraphModel.root[rel_lists[x]].mxCell['@target']) && 
							!this.treecache.includes(xmlobject.mxGraphModel.root[rel_lists[x]].mxCell['@source'])
							&& xmlobject.mxGraphModel.root[rel_lists[x]]['@relType'] !== 'requires' && xmlobject.mxGraphModel.root[rel_lists[x]]['@relType'] !== 'excludes')
							{
								this.movearray(xmlobject.mxGraphModel.root[rel_lists[x]].mxCell['@target'], xmlobject.mxGraphModel.root[rel_lists[x]].mxCell['@source']);
							}
						}
					}
				}
				// if there is bundle relation, construct the hierachical structure
				let rel_bundle_lists = ['rel_leaf_bundle', 'rel_general_bundle'];
				for(let x = 0; x < rel_bundle_lists.length; x++)
				{
					if(xmlobject.mxGraphModel.root[rel_bundle_lists[x]] !== undefined && xmlobject.mxGraphModel.root.rel_bundle_general !== undefined)
					{
						if(Array.isArray(xmlobject.mxGraphModel.root[rel_bundle_lists[x]]))
						{
							if(Array.isArray(xmlobject.mxGraphModel.root.rel_bundle_general))
							{
								for(let i = 0; i < xmlobject.mxGraphModel.root[rel_bundle_lists[x]].length; i++)
								{
									for(let j = 0; j < xmlobject.mxGraphModel.root.rel_bundle_general.length; j++)
									{
										// if the target and source of the bundle relation are not in the tree cache
										if(xmlobject.mxGraphModel.root[rel_bundle_lists[x]][i].mxCell['@parent'] === modeltype &&
										xmlobject.mxGraphModel.root.rel_bundle_general[j].mxCell['@parent'] === modeltype &&
										!this.treecache.includes(xmlobject.mxGraphModel.root[rel_bundle_lists[x]][i].mxCell['@source']) && 
										!this.treecache.includes(xmlobject.mxGraphModel.root.rel_bundle_general[j].mxCell['@target']) &&
										xmlobject.mxGraphModel.root.rel_bundle_general[j].mxCell['@source'] === xmlobject.mxGraphModel.root[rel_bundle_lists[x]][i].mxCell['@target'])
										{
											this.movearray(xmlobject.mxGraphModel.root.rel_bundle_general[j].mxCell['@target'], xmlobject.mxGraphModel.root[rel_bundle_lists[x]][i].mxCell['@source']);
										}
									}
								}
							}
							else
							{
								for(let i = 0; i < xmlobject.mxGraphModel.root[rel_bundle_lists[x]].length; i++)
								{
									// if the target and source of the bundle relation are not in the tree cache
									if(xmlobject.mxGraphModel.root[rel_bundle_lists[x]][i].mxCell['@parent'] === modeltype &&
									xmlobject.mxGraphModel.root.rel_bundle_general.mxCell['@parent'] === modeltype &&
									!this.treecache.includes(xmlobject.mxGraphModel.root[rel_bundle_lists[x]][i].mxCell['@source']) && 
									!this.treecache.includes(xmlobject.mxGraphModel.root.rel_bundle_general.mxCell['@target']) &&
									xmlobject.mxGraphModel.root.rel_bundle_general.mxCell['@source'] === xmlobject.mxGraphModel.root[rel_bundle_lists[x]][i].mxCell['@target'])
									{
										this.movearray(xmlobject.mxGraphModel.root.rel_bundle_general.mxCell['@target'], xmlobject.mxGraphModel.root[rel_bundle_lists[x]][i].mxCell['@source']);
									}
								}
							}
						}
						else
						{
							if(Array.isArray(xmlobject.mxGraphModel.root.rel_bundle_general))
							{
								for(let j = 0; j < xmlobject.mxGraphModel.root.rel_bundle_general.length; j++)
								{
									// if the target and source of the bundle relation are not in the tree cache
									if(xmlobject.mxGraphModel.root[rel_bundle_lists[x]].mxCell['@parent'] === modeltype &&
									xmlobject.mxGraphModel.root.rel_bundle_general[j].mxCell['@parent'] === modeltype &&
									!this.treecache.includes(xmlobject.mxGraphModel.root[rel_bundle_lists[x]].mxCell['@source']) && 
									!this.treecache.includes(xmlobject.mxGraphModel.root.rel_bundle_general[j].mxCell['@target']) &&
									xmlobject.mxGraphModel.root.rel_bundle_general[j].mxCell['@source'] === xmlobject.mxGraphModel.root[rel_bundle_lists[x]].mxCell['@target'])
									{
										this.movearray(xmlobject.mxGraphModel.root.rel_bundle_general[j].mxCell['@target'], xmlobject.mxGraphModel.root[rel_bundle_lists[x]].mxCell['@source']);
									}
								}
							}
							else
							{
								// if the target and source of the bundle relation are not in the tree cache
								if(xmlobject.mxGraphModel.root[rel_bundle_lists[x]].mxCell['@parent'] === modeltype &&
								xmlobject.mxGraphModel.root.rel_bundle_general.mxCell['@parent'] === modeltype &&
								!this.treecache.includes(xmlobject.mxGraphModel.root[rel_bundle_lists[x]].mxCell['@source']) && 
								!this.treecache.includes(xmlobject.mxGraphModel.root.rel_bundle_general.mxCell['@target']) &&
								xmlobject.mxGraphModel.root.rel_bundle_general.mxCell['@source'] === xmlobject.mxGraphModel.root[rel_bundle_lists[x]].mxCell['@target'])
								{
									this.movearray(xmlobject.mxGraphModel.root.rel_bundle_general.mxCell['@target'], xmlobject.mxGraphModel.root[rel_bundle_lists[x]].mxCell['@source']);
								}
							}
						}
					}
				}
				checkpoint--;
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
		 * insert the output of bundle in the element tree
		 * @param {object} root 		- xml object
		 * @param {number} relbundleid	- the id of bundle
		 * @param {string} modeltype	- the type of the diagram
		 * @param {number} parentid		- the parent id in the element tree
		 * @param {number} parentindex	- the index of parent in the element tree
		 * @param {number} level		- the current level
		 */
		insertbundle(root, relbundleid, modeltype, parentid, parentindex, level) {
			// check all the relations
			let rel_leaf_lists = ['rel_general_bundle','rel_leaf_bundle'];
			for(let x = 0; x < rel_leaf_lists.length; x++)
			{
				if(relbundleid !== -1 && root[rel_leaf_lists[x]] !== undefined)
				{
					if(Array.isArray(root[rel_leaf_lists[x]]))
					{
						for(let i = 0; i < root[rel_leaf_lists[x]].length; i++)
						{
							// if the target of relation is the id of bundle
							if(root[rel_leaf_lists[x]][i].mxCell['@parent'] === modeltype && 
							root[rel_leaf_lists[x]][i].mxCell['@target'] === relbundleid)
							{
								/**
								 * get the feature based on the source of the relation
								 * @function getfeature
								 */
								let newtemp = this.getfeature(root.general, root[rel_leaf_lists[x]][i].mxCell['@source'], modeltype);
								if(newtemp.t1 === '' && newtemp.t2 === '')
									newtemp = this.getfeature(root.leaf, root[rel_leaf_lists[x]][i].mxCell['@source'], modeltype);
								// insert this feature to the element tree
								this.insertdata(newtemp.t1, newtemp.t2, level + 1, this.getbundletype(root, newtemp.t2, modeltype), 'true', parentid, parentindex);
								this.treecache.push(newtemp.t2);
							}		
						}
					}
					// if the target of relation is the id of bundle
					else if(root[rel_leaf_lists[x]].mxCell['@parent'] === modeltype && 
					root[rel_leaf_lists[x]].mxCell['@target'] === relbundleid)
					{
						/**
						 * get the feature based on the source of the relation
						 * @function getfeature
						 */
						let newtemp = this.getfeature(root.general, root[rel_leaf_lists[x]].mxCell['@source'], modeltype);
						if(newtemp.t1 === '' && newtemp.t2 === '')
							newtemp = this.getfeature(root.leaf, root[rel_leaf_lists[x]].mxCell['@source'], modeltype);
						// insert this feature to the element tree
						this.insertdata(newtemp.t1, newtemp.t2, level + 1, this.getbundletype(root, newtemp.t2, modeltype), 'true', parentid, parentindex);
						this.treecache.push(newtemp.t2);
					}
				}
			}
		},
		/**
		 * set the type of the current element to 'feature' or 'or' or 'alt' or 'and' in the element tree
		 * @param {object} root 		- the xml object
		 * @param {number} id 			- the id of the current element
		 * @param {string} modeltype	- the type of the diagram
		 */
		getbundletype(root, id, modeltype) {
			// set default type to feature'
			let temp = 'feature';
			// get the source of the relation between bundle and general feature
			let bundleid = -1;
			if(root.rel_bundle_general !== undefined)
			{
				if(Array.isArray(root.rel_bundle_general))
				{
					for(let i = 0; i < root.rel_bundle_general.length; i++)
					{
						if(root.rel_bundle_general[i].mxCell['@parent'] === modeltype && root.rel_bundle_general[i].mxCell['@target'] === id)
							bundleid = root.rel_bundle_general[i].mxCell['@source'];
					}
				}
				else if(root.rel_bundle_general.mxCell['@parent'] === modeltype && root.rel_bundle_general.mxCell['@target'] === id)
					bundleid = root.rel_bundle_general.mxCell['@source'];
			}
			// check the type of the bundle either 'or' or 'alt'
			if(root.bundle !== undefined)
			{
				if(Array.isArray(root.bundle))
				{
					for(let i = 0; i < root.bundle.length; i++)
					{
						if(root.bundle[i].mxCell['@parent'] === modeltype && root.bundle[i]['@id'] === bundleid)
						{
							if(root.bundle[i]['@bundleType'] === 'OR')
								temp = 'or';
							else if(root.bundle[i]['@bundleType'] === 'XOR')
								temp = 'alt';
						}
					}
				}
				else if(root.bundle.mxCell['@parent'] === modeltype && root.bundle['@id'] === bundleid)
				{
					if(root.bundle['@bundleType'] === 'OR')
						temp = 'or';
					else if(root.bundle['@bundleType'] === 'XOR')
						temp = 'alt';
				}
			}
			// if there is no bundle, set the type to 'and'
			let rel_lists = ['rel_general_root','rel_general_general','rel_leaf_root','rel_leaf_general'];
			for(let x = 0; x < rel_lists.length; x++)
			{
				if(root[rel_lists[x]] !== undefined)
			{
				if(Array.isArray(root[rel_lists[x]]))
				{
					for(let i = 0; i < root[rel_lists[x]].length; i++)
					{
						if(root[rel_lists[x]][i].mxCell['@parent'] === modeltype && root[rel_lists[x]][i].mxCell['@target'] === id 
						&& root[rel_lists[x]][i]['@relType'] !== 'requires' && root[rel_lists[x]][i]['@relType'] !== 'excludes')
							temp = 'and';
					}
				}
				else if(root[rel_lists[x]].mxCell['@parent'] === modeltype && root[rel_lists[x]].mxCell['@target'] === id
				&& root[rel_lists[x]]['@relType'] !== 'requires' && root[rel_lists[x]]['@relType'] !== 'excludes')
					temp = 'and';
			}
			}
			return temp;
		},
		/**
		 * get the feature anme based on id
		 * @param {string} feature		- the xml object
		 * @param {number} id 			- the id of the current element
		 * @param {string} modeltype	- the type of the diagram
		 */
		getfeature(feature, id, modeltype) {
			let temp = {t1:'',t2:''};
			if(feature !== undefined)
			{
				if(Array.isArray(feature))
				{
					for(let i = 0; i < feature.length; i++)
					{
						if(feature[i].mxCell['@parent'] === modeltype && feature[i]['@id'] === id)
						{
							temp.t1 = feature[i]['@label'];
							temp.t2 = id;
						}
					}
				}
				else if(feature.mxCell['@parent'] === modeltype && feature['@id'] === id)
				{
					temp.t1 = feature['@label'];
					temp.t2 = id;
				}
			}
			return temp;
		},
		/**
		 * get the name and the id of root
		 * @param {string} root 		- the xml object
		 * @param {string} modeltype	- the type of the diagram
		 */
		checkrootxml(root, modeltype) {
			let temp = {t1:'',t2:''};
			if(root !== undefined)
			{
				if(Array.isArray(root))
				{
					for(let i = 0; i < root.length; i++)
					{
						if(root[i].mxCell['@parent'] === modeltype)
						{
							temp.t1 = root[i]['@label'];
							temp.t2 = root[i]['@id'];
						}
					}
				}
				else if(root.mxCell['@parent'] === modeltype)
				{
					temp.t1 = root['@label'];
					temp.t2 = root['@id'];
				}
			}
			return temp;
		},
		/**
		 * insert the element into the element tree data
		 * @param {string} name the name of the element
		 * @param {number} newid the id of the element
		 * @param {number} level the level of the element
		 * @param {string} type the type of the element
		 * @param {string} mandatory the mandatory of the element
		 * @param {number} parentid the parent id in the element tree
		 * @param {number} parentindex the index of parent in the element tree
 		 */
		insertdata(name, newid, level, type, mandatory, parentid, parentindex) {
            this.data.splice(parentindex + 1, 0 ,{
				data: {
					open: true,
					isSelected: false,
					level: level,
					nodeId: newid,
				    nodeName: name,
              		type: type,
              		tick: false,
              		mandatory: mandatory,
					parentId: parentid
				},
				numberOfChildren: 0
			});
            if(parentindex !== -1)
				this.data[parentindex].numberOfChildren++;
		},
		/**
		 * the rule to show up the element of the element tree
		 * @param {number} index the index of the current element
		 */
		checkchildnode(index) {
			for(let i = 1; i < index+1; i++)
			{
				// if the element is closed, his children is not displayed
				if(this.data[index-i].data.level < this.data[index].data.level)
				{
					if(this.data[index-i].data.open === false)
					{
						this.data[index].data.open = false;
						return false;
					}
					else 
						break;
				}
			}
			return true;
		},
		/**
		 * set open and close to the element
		 * @param {number} index the index of the current element
		 */
		expand_menu(index) {
			var _this = this;
			_this.data[index].data.open = !_this.data[index].data.open;	
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
		overflow: auto;
		padding: 5px 0px;
		padding-bottom: 30px;
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
	.show-wrap::-webkit-scrollbar {
		width: 10px;
		height: 10px;
		background-color: rgb(120, 120, 120);
		border-radius: 5px;
	}
	.show-wrap::-webkit-scrollbar-track{
		width: 10px;
		height: 10px;
		background-color: #ddd;
		border-radius: 5px;
	}
	.show-wrap::-webkit-scrollbar-thumb{
		width: 10px;
		height: 10px;
		background-color: rgb(120, 120, 120);
		border-radius: 5px;
	}
</style>


