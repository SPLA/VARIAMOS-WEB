<template>
	<div class="naza-tree-warp">
		<div class="naza-tree-inner show-wrap">
			<ul class="naza-tree">
				<span style="position: absolute;left: 230px;top: 42px;">
					<Spin v-if="isloading">
						<Icon type="load-c" size=16 class="demo-spin-icon-load"></Icon>
					</Spin>
				</span>
				<div v-for="(item, $index) in data" :key="item.nodeId">
				<li class="naza-tree-row"
					:class="item.data.isSelected?'selected':''"
					@click="clickme($index)" v-if="checkchildnode($index)">
					
					<a :style="{paddingLeft: (20 * item.data.level) + 'px'}">
						<i
							aria-hidden="true"
							:class="[item.data.open?'fas fa-angle-down':'fas fa-angle-right']"
							@click="expand_menu($index)"
							:style="{position: 'absolute',left: (20 * item.data.level - 17) + 'px',top: '6px'}">
						</i>
						<span class="name-container"
							:class="'vue-contextmenuName-menu' + item.data.nodeType + item.data.nodeId"
							@dblclick="dblClick($index)"
							@contextmenu="showMenu($index,$event)">
							<img v-if="item.data.type === 'or'"
							src="../assets/images/OR.png" style="color:gray;size:1px;padding-right:4px"/>
							<img v-if="item.data.type === 'alt'"
							src="../assets/images/XOR.png" style="color:gray;size:1px;padding-right:4px"/>
							<i v-if="item.data.type === 'and'"
								class="fa fa-plus" aria-hidden="true"
								style="color:gray;font-size: 16px;padding-right:4px">
							</i>
							<i v-if="item.data.type === 'feature'"
								class="far fa-square" aria-hidden="true"
								style="color:gray;font-size: 16px;padding-right:4px">
							</i>
							<span class="name"
								:title="item.data.nodeName"
								:style="{display:item.data.nodeType===2?'initial':'inline-block',
										userSelect: 'none'}">
								<Checkbox v-model="item.data.tick" @on-change="itemclick($index)">
								{{item.data.nodeName}}
								</Checkbox>
							</span>
							<i v-if="item.data.mandatory !== 'true'"
								class="far fa-circle" aria-hidden="true"
								style="color:gray;font-size: 16px;padding-left:4px">
							</i>
							<i v-if="checkmandatorycircle($index)"
								class="fas fa-circle" aria-hidden="true"
								style="color:gray;font-size: 16px;padding-left:4px">
							</i>
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
import { Spin,Icon } from 'iview'
import Bus from '../assets/js/common/bus.js'
import xml2json from '../assets/js/common/xml2json.js'
export default {
	components: {
		Spin,
		Icon
	},
	props: ['layername','layertype'],
	data () {
		return {
			clickNum: null,
			isloading: false,
			className: '',
			data: []
		}
	},
	mounted: function() {
		this.mainprocess();
	},
	watch: {
		getxml: function(val){
			this.mainprocess();			
		}
	},
	computed:{
		getxml (){
			return this.$store.getters.getxml;
		}
	},
	methods: {
		mainprocess() {
			this.data = [];
			let modeltype = this.layername;
			// if(this.layertype === 1)
			// 	modeltype = this.layername + '|feature';
			// else if(this.layertype === 2)
			// 	modeltype = this.layername + '|component';
			// else if(this.layertype === 3)
			// 	modeltype = 'binding_feature_component';
			
			var xmlDoc = (new DOMParser()).parseFromString(this.getxml,"text/xml");
			var xmlobject = JSON.parse(xml2json(xmlDoc,''));
			if(this.layertype === 1)
			{
				let rootxml = this.checkrootxml(xmlobject.mxGraphModel.root.root, modeltype);
				if(rootxml.t1 !== '' && rootxml.t2 !== '')
				{
					this.insertdata(rootxml.t1, rootxml.t2, 1, 'and', 'true', -1, -1);
					
					let checkall = true;
					let level = 1;
					while(checkall)
					{
						checkall = false;
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
											if(xmlobject.mxGraphModel.root[rel_lists[x]][i].mxCell['@parent'] === modeltype && 
											xmlobject.mxGraphModel.root[rel_lists[x]][i].mxCell['@target'] === this.data[j].data.nodeId && 
											this.data[j].data.level === level)
											{
												let newtemp = this.getfeature(xmlobject.mxGraphModel.root.general, xmlobject.mxGraphModel.root[rel_lists[x]][i].mxCell['@source'], modeltype);
												if(newtemp.t1 === '' && newtemp.t2 === '')
													newtemp = this.getfeature(xmlobject.mxGraphModel.root.leaf, xmlobject.mxGraphModel.root[rel_lists[x]][i].mxCell['@source'], modeltype);
												if(xmlobject.mxGraphModel.root[rel_lists[x]][i]['@relType'] === 'mandatory')	
													this.insertdata(newtemp.t1, newtemp.t2, level + 1, this.getbundletype(xmlobject.mxGraphModel.root, newtemp.t2, modeltype), 'true', this.data[j].data.nodeId, j);
												else if(xmlobject.mxGraphModel.root[rel_lists[x]][i]['@relType'] === 'optional')	
													this.insertdata(newtemp.t1, newtemp.t2, level + 1, this.getbundletype(xmlobject.mxGraphModel.root, newtemp.t2, modeltype), 'false', this.data[j].data.nodeId, j);
												checkall = true;
											}
										}
									}
								}
								else
								{
									for(let j = 0; j < this.data.length; j++)
									{
										if(xmlobject.mxGraphModel.root[rel_lists[x]].mxCell['@parent'] === modeltype && 
										xmlobject.mxGraphModel.root[rel_lists[x]].mxCell['@target'] === this.data[j].data.nodeId && 
										this.data[j].data.level === level)
										{
											let newtemp = this.getfeature(xmlobject.mxGraphModel.root.general, xmlobject.mxGraphModel.root[rel_lists[x]].mxCell['@source'], modeltype);
											if(newtemp.t1 === '' && newtemp.t2 === '')
												newtemp = this.getfeature(xmlobject.mxGraphModel.root.leaf, xmlobject.mxGraphModel.root[rel_lists[x]].mxCell['@source'], modeltype);
											if(xmlobject.mxGraphModel.root[rel_lists[x]]['@relType'] === 'mandatory')	
												this.insertdata(newtemp.t1, newtemp.t2, level + 1, this.getbundletype(xmlobject.mxGraphModel.root, newtemp.t2, modeltype), 'true', this.data[j].data.nodeId, j);
											else if(xmlobject.mxGraphModel.root[rel_lists[x]]['@relType'] === 'optional')
												this.insertdata(newtemp.t1, newtemp.t2, level + 1, this.getbundletype(xmlobject.mxGraphModel.root, newtemp.t2, modeltype), 'false', this.data[j].data.nodeId, j);
											checkall = true;
										}
									}
								}
							}
						}

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
											if(xmlobject.mxGraphModel.root[rel_bundle_lists[x]][i].mxCell['@parent'] === modeltype && 
											xmlobject.mxGraphModel.root[rel_bundle_lists[x]][i].mxCell['@target'] === this.data[j].data.nodeId && 
											this.data[j].data.level === level)
											{
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
										if(xmlobject.mxGraphModel.root[rel_bundle_lists[x]].mxCell['@parent'] === modeltype && 
										xmlobject.mxGraphModel.root[rel_bundle_lists[x]].mxCell['@target'] === this.data[j].data.nodeId && 
										this.data[j].data.level === level)
										{
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
				else	
					this.$Notice.info({
                    	title: 'Xml to Tree',
                    	desc: 'Please put the root feature first!'
                	});
			}
			else
				this.$Notice.info({
                    title: 'Xml to Tree',
                    desc: 'The tree is constructed based on feature model!'
                });
		},
		insertbundle(root, relbundleid, modeltype, parentid, parentindex, level) {
			let rel_leaf_lists = ['rel_general_bundle','rel_leaf_bundle'];
			for(let x = 0; x < rel_leaf_lists.length; x++)
			{
				if(relbundleid !== -1 && root[rel_leaf_lists[x]] !== undefined)
				{
					if(Array.isArray(root[rel_leaf_lists[x]]))
					{
						for(let i = 0; i < root[rel_leaf_lists[x]].length; i++)
						{
							if(root[rel_leaf_lists[x]][i].mxCell['@parent'] === modeltype && 
							root[rel_leaf_lists[x]][i].mxCell['@target'] === relbundleid)
							{
								let newtemp = this.getfeature(root.general, root[rel_leaf_lists[x]][i].mxCell['@source'], modeltype);
								if(newtemp.t1 === '' && newtemp.t2 === '')
									newtemp = this.getfeature(root.leaf, root[rel_leaf_lists[x]][i].mxCell['@source'], modeltype);
								this.insertdata(newtemp.t1, newtemp.t2, level + 1, this.getbundletype(root, newtemp.t2, modeltype), 'true', parentid, parentindex);
							}		
						}
					}
					else if(root[rel_leaf_lists[x]].mxCell['@parent'] === modeltype && 
					root[rel_leaf_lists[x]].mxCell['@target'] === relbundleid)
					{
						let newtemp = this.getfeature(root.general, root[rel_leaf_lists[x]].mxCell['@source'], modeltype);
						if(newtemp.t1 === '' && newtemp.t2 === '')
							newtemp = this.getfeature(root.leaf, root[rel_leaf_lists[x]].mxCell['@source'], modeltype);
						this.insertdata(newtemp.t1, newtemp.t2, level + 1, this.getbundletype(root, newtemp.t2, modeltype), 'true', parentid, parentindex);
					}
				}
			}
		},
		getbundletype(root, id, modeltype) {
			let temp = 'feature';
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
			if(root.rel_general_general !== undefined)
			{
				if(Array.isArray(root.rel_general_general))
				{
					for(let i = 0; i < root.rel_general_general.length; i++)
					{
						if(root.rel_general_general[i].mxCell['@parent'] === modeltype && root.rel_general_general[i].mxCell['@target'] === id)
							temp = 'and';
					}
				}
				else if(root.rel_general_general.mxCell['@parent'] === modeltype && root.rel_general_general.mxCell['@target'] === id)
					temp = 'and';
			}
			return temp;
		},
		
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
		checkchildnode(index) {
			if(this.data[index].data.level === 1)
			{
				for(let i = 0; i < this.data.length; i++)
				{
					if(this.data[i].data.level === 1 & this.data[i].data.open && i !== index)
						return false;
				}
			}
			for(let i = 1; i < index+1; i++)
			{
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
		expand_menu(index) {
			var _this = this;
			_this.data[index].data.open = !_this.data[index].data.open;	
		},
		clickme(index){
			var _this = this;
			_this.data.forEach((item)=>{
				item.data.isSelected = false;
			});
			//_this.data[index].data.isSelected = true;
		},
		dblClick(index){
			var _this = this;
			if(_this.data[index].data.nodeType === 1){
				_this.expand_menu(index);
			}
		},
		itemclick(index){
			let counter = 0;
			for(let i = index + 1; i < this.data.length; i++) // check children
			{
				if(this.data[index].data.level > this.data[i].data.level || this.data[index].data.level === this.data[i].data.level)
					break;
				if(this.data[index].data.tick === false)
				{
					this.data[i].data.tick = false;
					continue;
				}
				if(this.data[index].data.type === 'alt' && this.data[index].data.tick === true)
					counter = 1 + this.data[index].numberOfChildren;
				for(let j = 0; j < this. data.length; j++)
				{
					if(this.data[j].data.nodeId === this.data[i].data.parentId && this.data[j].data.type === 'alt')
						counter = 1;
				}
				if(this.data[i].data.mandatory === 'true' && counter === 0)
				{
					this.data[i].data.tick = this.data[index].data.tick;
				}
				if(counter !== 0)
					counter--;
			}
			for(let i = 0; i < this.data.length; i++)
			{
				if(this.data[i].data.nodeId === this.data[index].data.parentId)
				{
					if(this.data[i].data.type === 'alt' && this.data[index].data.tick === true)
					{
						for(let j = 0; j < this.data.length; j++)
						{
							if(this.data[j].data.parentId === this.data[index].data.parentId && j !== index)
								this.data[j].data.tick = false;
						}
					}
					// if(this.data[i].data.type === 'and')
					// {
					// 	for(let j = 0; j < this.data.length; j++)
					// 	{
					// 		if(this.data[j].data.parentId === this.data[index].data.parentId && this.data[j].data.mandatory === 'true')
					// 			this.data[j].data.tick = this.data[index].data.tick;
					// 	}
					// }
				}
			}
			if(this.data[index].data.tick === true)
			{
				let temp_parentid = this.data[index].data.parentId;
				while(temp_parentid !== -1)
				{
					for(let i = 0; i < index; i++)
					{
						if(this.data[i].data.nodeId === temp_parentid)
						{
							this.data[i].data.tick = true;
							temp_parentid = this.data[i].data.parentId;
						}
					}
				}
			}
			else
			{
				let temp_parentid = this.data[index].data.parentId;
				while(temp_parentid !== -1)
				{
					let temp_selected = false;
					for(let i = 0; i < this.data.length; i++)
					{
						if(this.data[i].data.parentId === temp_parentid && this.data[i].data.tick)
							temp_selected = true;
					}
					if(temp_selected)
						break;
					else
					{
						for(let i = 0; i < this.data.length; i++)
						{
							if(this.data[i].data.nodeId === temp_parentid)
							{
								this.data[i].data.tick = false;
								temp_parentid = this.data[i].data.parentId;
							}
						}
					}
				}
			}
		},
		checkmandatorycircle(index) {
			for(let i = 0; i < this.data.length; i++)
			{
				if(this.data[i].data.nodeId === this.data[index].data.parentId && this.data[i].data.type === 'and' && this.data[index].data.mandatory === 'true')
					return true;
			}
			return false;
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
		max-height: 500px;
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
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
	img {
  	width: 15px;
	}
</style>


