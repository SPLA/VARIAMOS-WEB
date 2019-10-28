<template>
	<div class="naza-tree-warp">
		<div class="naza-tree-inner show-wrap">
			<ul class="naza-tree">
				<div v-for="(item, $index) in getdata" :key="item.nodeId">
					<li class="naza-tree-row"
						:class="item.data.isSelected?'selected':''"
						@click="clickme($index)" v-if="checkchildnode($index)">
						<context-menu
							:context-menu-data="contextMenuData"
							:target-class="className"
							:data="item">
						</context-menu>
						<a :style="{paddingLeft: (20 * item.data.level) + 'px'}">
							<i v-if="item.data.nodeType!==3 && item.data.level === 1"
								class="fa"
								aria-hidden="true"
								:class="[item.data.open?'fa-angle-double-down':'fa-angle-double-right']"
								@click="expand_menu($index)"
								:style="{position: 'absolute',left: (20 * item.data.level - 17) + 'px',top: '6px'}"
								data-test="projectFolder">
							</i>
							<i v-if="item.data.nodeType!==3 && item.data.level !== 1"
								class="fa"
								aria-hidden="true"
								:class="[item.data.open?'fa-angle-down':'fa-angle-right']"
								@click="expand_menu($index)"
								:style="{position: 'absolute',left: (20 * item.data.level - 17) + 'px',top: '6px'}"
								data-test="modelFolder">
							</i>
							<i v-if="item.data.nodeType===3"
								class="fa"
								aria-hidden="true"
								:class="['fa-angle-right']"
								@click="expand_menu($index)"
								:style="{position: 'absolute',left: (20 * item.data.level - 17) + 'px',top: '6px'}"
								data-test="modelFolder">
							</i>
							<span class="name-container"
								:class="'vue-contextmenuName-menu' + item.data.nodeType + item.data.nodeId"
								@dblclick="dblClick($index)"
								@contextmenu="showMenu($index,$event)">
								<i v-if="item.data.nodeType===1"
									aria-hidden="true"
									:class="[item.data.open?'far fa-folder-open':'fas fa-folder']"
									style="color:gray;font-size: 16px;padding-right:4px">
								</i>
								<i v-if="item.data.nodeType === 3"
									:class="'far fa-image'" aria-hidden="true"
									style="color:gray;font-size: 16px;padding-right:4px">
								</i>
								<span class="name"
									:title="item.data.nodeName"
									:style="{display:item.data.nodeType===2?'initial':'inline-block',
											userSelect: 'none'}">
									{{item.data.nodeName}}
								</span>
							</span>
						</a>
					</li>
				</div>
			</ul>
		</div>
	</div>
</template>
<script>
import contextMenu from './contextMenu.vue'
import Bus from '../assets/js/common/bus.js'
import { getcontextmenulist, getModelInfo } from '../assets/js/common/global_info'

export default {
	name: 'cotalogue',
	components: {
		contextMenu
	},
	data () {
		return {
			clickNum: null,
			/**
			 * unique name for each context menu
			 */
			className: '',
			/**
			 * the data for right click context menu
			 * @property {object} axios		- the current location
			 * @property {array} menulists	- the label, icon and event of right click context menu
			 */
			contextMenuData: {
				menuName: 'menu',
				axios: {
					x: null,
					y: null
				},
				menulists:{
					'project':[getcontextmenulist()['delete_project']],
					// accepts old version of delete project
					3:[getcontextmenulist()['delete_project']],
					'empty':[],
					//'application_folder':[getcontextmenulist()['create_adp'],getcontextmenulist()['rename'],getcontextmenulist()['delete_folder']],
					'application_folder':[getcontextmenulist()['rename'],getcontextmenulist()['delete_folder']],
					'adaptation_folder':[getcontextmenulist()['rename'],getcontextmenulist()['delete_folder']]}
			}
		}
	},
	computed: {
		/**
		 * @returns {array} tree data in the store
		 */
        getdata (){
            return this.$store.getters.getdata;
        }
    },
	methods: {
		/**
		 * define a complete rule to show the tree elements
		 * @param {number} index	- the index of the tree data array
		 * @returns {boolean}
		 */
		checkchildnode(index) {
			let data = this.getdata;
			// if one project is open, the other projects are not displayed
			if(data[index].data.level === 1)
			{
				for(let i = 0; i < data.length; i++)
				{
					if(data[i].data.level === 1 & data[i].data.open && i !== index)
						return false;
				}
			}
			if(data[index].data.nodeType === 1 && data[index].data.level !== 1)
			{
				// if one folder is opened, the other folder is not displayed
				for(let i = 0; i < data.length; i++)
				{
					if(data[i].data.nodeType === 1 && data[i].data.level !== 1 && data[i].data.open && i !== index)
						return false;
				}
				// if the project is opened, all the folders are displayed
				for(let i = 0; i < data.length; i++)
				{
					if(data[i].data.nodeId === data[index].data.projectId && data[i].data.open)
						return true;
				}
			}
			// if the folder or the project is closed, set all its children closed
			for(let i = 1; i < index+1; i++)
			{
				if(data[index-i].data.level < data[index].data.level)
				{
					if(data[index-i].data.open === false)
					{
						data[index].data.open = false;
						return false;
					}
					else 
						break;
				}
			}
			return true;
		},
		checkoldfolder(index) {
			let data = this.getdata;
			let cache = [];
			let treecache = [];
			for(let i = 0; i < getModelInfo()['gmodels'].length; i++)
			{
				if(getModelInfo()[getModelInfo()['gmodels'][getModelInfo()['gmodels'].length-i-1]].projFolders.includes(data[index].data.nodeName.split(' -')[0]))
					cache.unshift(getModelInfo()['gmodels'][getModelInfo()['gmodels'].length-i-1]);
			}
			for(let i = 0 ; i < data.length; i++)
			{
				if(data[index].data.nodeId === data[i].data.parentId)
					treecache.push(data[i].data.nodeName);
			}
			if(cache.toString()!==treecache.toString())
			{
				this.$store.dispatch('updatefolder', index);
			}
		},
		/**
		 * open or close the tree elements
		 * @param {number} index	- the index of the tree data array
		 */
		expand_menu(index) {
			let data = this.getdata;
			// update the tree based when global_info is updated
			if(data[index].data.level !== 1)
			{
				this.checkoldfolder(index);
			}
			// get the opend project name and opened folder name
			let projectname = '';
			let foldername = data[index].data.nodeName.replace(/\s+/g,"");
			for(let i = 0; i < data.length; i++)
			{
				if(data[i].data.nodeId === data[index].data.projectId)
					projectname = data[i].data.nodeName;
			}
			clearTimeout(this.clickNum);
			this.clickNum = setTimeout(()=>{
				// if we are opening one folder
				if(data[index].data.nodeType === 1 && !data[index].data.open && data[index].data.level !== 1)
				{
					// all the other folders in the project are not displayed
					for(let i = 0; i < data.length; i++)
					{
						if(data[i].data.nodeType === 1 && data[i].data.level !== 1 && i !== index)
							data[i].data.open = false;
					}
					/**
					 * set the router path and update index of current folder and active tab
					 * @fires module:store~actions:updatemodelcomponent
					 * @fires module:store~actions:updateactivetab
					 */
					let parentId = data[index].data.nodeId;
					let nodeName = "";
					for(let i = 0; i < data.length; i++)
					{
						if(data[i].data.parentId === parentId && data[i].data.nodeType !== 1){
							nodeName = data[i].data.nodeName;
							break;
						}
					}
					if(nodeName == ""){
						this.$router.push("/models/"+projectname+"/default/default");
					}else{
						this.$router.push("/models/"+projectname+"/"+foldername+"/"+nodeName);
						this.$store.dispatch('updatemodelcomponent', index);
						this.$store.dispatch('updateactivetab', nodeName);
					}
				}
				// if we are closing one folder
				else if(data[index].data.nodeType === 1 && data[index].data.open)
				{
					/**
					 * set mxgraph disabled and update index of current folder to -1, set router path to default
					 * @fires module:Model~event:setfalsegraph
					 * @fires module:store~actions:updatemodelcomponent
					 */
					Bus.$emit('setfalsegraph',false);
					this.$store.dispatch('updatemodelcomponent', -1);
					this.$router.push("/models/"+projectname+"/default/default");
				}
				/**
				 * change open to close or close to open
				 * @fires module:store~actions:setopen
				 */
				this.$store.dispatch('setopen', index);
			}, 250);
		},
		/**
		 * click function
		 * @param {number} index	- the index of the tree data array
		 */
		clickme(index){
			let data = this.getdata;
			// get the opend project name and opened folder name
			let projectname = '';
			let foldername = '';
			/**
			 * change the select property in the tree data array
			 * @fires module:store~actions:setselect
			 */
			this.$store.dispatch('setselect', index);
			for(let i = 0; i < data.length; i++)
			{
				if(data[i].data.nodeId === data[index].data.projectId){
					projectname = data[i].data.nodeName;
				}
				if(data[i].data.nodeId === data[index].data.parentId){
					foldername = data[i].data.nodeName.replace(/\s+/g,"");
				}
			}		
			// check if project is open but all the folders are closed
			let checkpoint = true;
			for(let i = 0; i < data.length; i++)
			{
				if(data[i].data.level !== 1 && data[i].data.open)
					checkpoint = false;
			}
			// set default router path for the situation of all closed folders
			if(checkpoint && data[index].data.level === 1){
				this.$router.push("/models/"+data[index].data.nodeName+"/default/default");
			}else if(checkpoint && data[index].data.level !== 1){
				this.$router.push("/models/"+data[index].data.nodeName.split('-')[1].replace(/\s+/g,"")+"/default/default").catch(err => {});
			}

			// when clicking the diagram, navigate to the correponding router path
			if(data[index].data.nodeType === 3){
				this.$router.push("/models/"+projectname+"/"+foldername+"/"+data[index].data.nodeName);
            	this.$store.dispatch('updateactivetab', data[index].data.nodeName);
			}

			// if we click the diagram
			if(data[index].data.nodeType === 3)
			{
				/**
				 * update activetab and current folder
				 * @fires module:store~actions:updateactivetab
				 * @fires module:store~actions:updatemodelcomponent
				 */
				this.$store.dispatch('updateactivetab', data[index].data.nodeName);
				for(let i = 0; i < data.length; i++)
				{
					if(data[i].data.nodeId === data[index].data.parentId)
					{
						this.$store.dispatch('updatemodelcomponent', i);
						break;
					}
				}
			}
			// if project is open, change its context menu
			else if(data[index].data.level === 1 && data[index].data.open)
			{
				this.contextMenuData.menulists['project']=[getcontextmenulist()['create_app']];
			}
			// if project is not open, change its context menu
			else if(data[index].data.level === 1 && !data[index].data.open)
			{
				this.contextMenuData.menulists['project']=[getcontextmenulist()['delete_project']];
			}
			// if application folder is open, change its context menu
			else if(data[index].data.contextmenuIndex === 'application_folder' && data[index].data.open)
			{
				this.contextMenuData.menulists['application_folder'] = [getcontextmenulist()['rename'], getcontextmenulist()['delete_folder']];
			}
			// if application folder is not open, change its context menu
			else if(data[index].data.contextmenuIndex === 'application_folder' && !data[index].data.open)
			{
				//this.contextMenuData.menulists['application_folder'] = [getcontextmenulist()['create_adp'], getcontextmenulist()['rename'], getcontextmenulist()['delete_folder']];
				this.contextMenuData.menulists['application_folder'] = [getcontextmenulist()['rename'], getcontextmenulist()['delete_folder']];
			}
		},
		// double click folder and project will trigger expand menu
		dblClick(index){
			let data = this.getdata;
			if(data[index].data.nodeType === 1)
				this.expand_menu(index);
		},
		// get the right click event and the current location
		showMenu(index,event){
			let _this = this;
			// trigger clickme function
			_this.clickme(index);
			event.preventDefault();
			_this.className = event.target.closest('.name-container').classList[1];
			let x = event.clientX;
			let y = event.clientY;
			// Get the current location and change the property axios
			_this.contextMenuData.axios = {
				x, y
			};
		}
	}
}
</script>
<style scoped>
	.naza-tree-warp {
		width: 100%;
		height: 100%;
		/* min-width: 175px; */
		border-bottom: 0 none;
		border-top: 0 none;
		border-right: 0 none;
	}
	.naza-tree-warp .naza-tree-inner {
		max-height: 300px;
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
		/* min-width: 100%; */
	}
	.naza-tree-warp .naza-tree-inner .naza-tree .selected {
		background-color: #5bc0de;
	}
	.naza-tree-warp .naza-tree-inner .naza-tree .naza-tree-row {
		list-style: none;
		/* min-width: 250px; */
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
</style>


