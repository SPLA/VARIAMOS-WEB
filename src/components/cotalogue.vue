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
						<i v-if="item.data.nodeType!==2 && item.data.level === 1"
							class="fa"
							aria-hidden="true"
							:class="[item.data.open?'fa-angle-double-down':'fa-angle-double-right']"
							@click="expand_menu($index)"
							:style="{position: 'absolute',left: (20 * item.data.level - 17) + 'px',top: '6px'}"
							data-test="projectFolder">
						</i>
						<i v-if="item.data.nodeType!==2 && item.data.level !== 1"
							class="fa"
							aria-hidden="true"
							:class="[item.data.open?'fa-angle-down':'fa-angle-right']"
							@click="expand_menu($index)"
							:style="{position: 'absolute',left: (20 * item.data.level - 17) + 'px',top: '6px'}"
							data-test="modelFolder">
						</i>
						<i v-if="item.data.nodeType===2"
							aria-hidden="true"
							class="fa fa-circle"
							:title="['Feature','Relation','Bundle'][item.data.status]"
							:style="{position: 'absolute',
									left: (20 * item.data.level - 14) + 'px',
									top: '9px',
									color: ['#0f0','#ddd','#f00'][item.data.status],
									fontSize: '10px'}">
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
								:class="item.data.open?'far fa-image':'fas fa-image'" aria-hidden="true"
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
				<subcotalogue v-if="item.data.nodeType === 3 && item.data.open" :style="{paddingLeft: (20 * item.data.level) + 'px'}" :layername="item.data.nodeName" :layertype="item.data.modeltype"></subcotalogue>
				</div>
			</ul>
		</div>
	</div>
</template>
<script>
import { Spin,Icon } from 'iview'
import contextMenu from './contextMenu.vue'
import subcotalogue from './sub_cotalogue.vue'
import Bus from '../assets/js/common/bus.js'
export default {
	name: 'cotalogue',
	components: {
		Spin,
		Icon,
		contextMenu,
		subcotalogue
	},
	data () {
		return {
			clickNum: null,
			className: '',
			contextMenuData: {
				menuName: 'menu',
				axios: {
					x: null,
					y: null
				},
				menulists:[[],[{
					fnHandler: 'newname',
					icoName: 'fa fa-pencil-alt',
					btnName: 'Rename'
				},{
					fnHandler: 'deletedire',
					icoName: 'fa fa-times',
					btnName: 'delete'
				}],[{
					fnHandler: 'newname',
					icoName: 'fa fa-pencil-alt',
					btnName: 'Rename'
				},{
					fnHandler: 'deletedire',
					icoName: 'fa fa-times',
					btnName: 'delete'
				}],[{
					fnHandler: 'deleteproject',
					icoName: 'fa fa-times',
					btnName: 'delete project'
				}],[{
					fnHandler: 'deletedire',
					icoName: 'fa fa-times',
					btnName: 'delete'
				}],[{
					fnHandler: 'createadaption',
					icoName: 'fa fa-folder',
					btnName: 'New Adatption'
				},{
					fnHandler: 'newname',
					icoName: 'fa fa-pencil-alt',
					btnName: 'Rename'
				},{
					fnHandler: 'deletedire',
					icoName: 'fa fa-times',
					btnName: 'delete'
				}],[]]
			}
		}
	},
	mounted: function(){
		Bus.$on('manageelement', xml=>{
			this.xml = xml;
		});
	},
	computed: {
        getdata (){
            return this.$store.getters.getdata;
        }
    },
	methods: {
		checkchildnode(index) {
			let data = this.getdata;
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
				for(let i = 0; i < data.length; i++)
				{
					if(data[i].data.nodeType === 1 && data[i].data.level !== 1 && data[i].data.open && i !== index)
						return false;
				}
				for(let i = 0; i < data.length; i++)
				{
					if(data[i].data.nodeId === data[index].data.projectId && data[i].data.open)
						return true;
				}
			}
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
		expand_menu(index) {
			let data = this.getdata;
			let projectname = '';
			let foldername = '';
			for(let i = 0; i < data.length; i++)
			{
				if(data[i].data.nodeId === data[index].data.projectId)
					projectname = data[i].data.nodeName;
				if(data[i].data.nodeId === data[index].data.parentId)
					foldername = data[i].data.nodeName.replace(/\s+/g,"");
            }
			clearTimeout(this.clickNum);
			this.clickNum = setTimeout(()=>{
				if(data[index].data.nodeType === 1 && !data[index].data.open && data[index].data.level !== 1)
				{
					for(let i = 0; i < data.length; i++)
					{
						if(data[i].data.nodeType === 1 && data[i].data.level !== 1 && i !== index)
							data[i].data.open = false;
					}
				    this.$router.push("/models/"+projectname+"/"+foldername+"/feature");
					this.$store.dispatch('updatemodelcomponent', index);
				}
				else if(data[index].data.nodeType === 1 && data[index].data.open)
				{
					Bus.$emit('setfalsegraph',false);
					this.$store.dispatch('updatemodelcomponent', -1);
					this.$router.push("/models/"+projectname+"/default/default");
				}
				this.$store.dispatch('setopen', index);
			}, 250);
		},
		clickme(index){
			let data = this.getdata;
			let projectname = '';
			let foldername = '';
			this.$store.dispatch('setselect', index);
			for(let i = 0; i < data.length; i++)
			{
				if(data[i].data.nodeId === data[index].data.projectId)
					projectname = data[i].data.nodeName;
				if(data[i].data.nodeId === data[index].data.parentId)
					foldername = data[i].data.nodeName.replace(/\s+/g,"");
			}		
			let checkpoint = true;
			for(let i = 0; i < data.length; i++)
			{
				if(data[i].data.level !== 1 && data[i].data.open)
					checkpoint = false;
			}
			if(checkpoint && data[index].data.level === 1)
				this.$router.push("/models/"+data[index].data.nodeName+"/default/default");
			else if(checkpoint && data[index].data.level !== 1)
				this.$router.push("/models/"+data[index].data.nodeName.split('-')[1].replace(/\s+/g,"")+"/default/default");
			
			if(data[index].data.modeltype == 1 && data[index].data.nodeType === 3)
				this.$router.push("/models/"+projectname+"/"+foldername+"/feature");
			else if(data[index].data.modeltype == 2 && data[index].data.nodeType === 3) 
                this.$router.push("/models/"+projectname+"/"+foldername+"/component");
            else if(data[index].data.modeltype == 3 && data[index].data.nodeType === 3)
				this.$router.push("/models/"+projectname+"/"+foldername+"/binding_feature_component");
			if(data[index].data.nodeType === 3)
			{
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
			else if(data[index].data.level === 1 && data[index].data.open)
			{
				this.contextMenuData.menulists.splice(3,1,[{
					fnHandler: 'createapplication',
					icoName: 'fa fa-folder',
					btnName: 'New Application'
				}]);
			}
			else if(data[index].data.level === 1 && !data[index].data.open)
			{
				this.contextMenuData.menulists.splice(3,1,[{
					fnHandler: 'deleteproject',
					icoName: 'fa fa-times',
					btnName: 'delete project'
				}]);
			}
			else if(data[index].data.contextmenuIndex === 5 && data[index].data.open)
			{
				this.contextMenuData.menulists.splice(5,1,[{
					fnHandler: 'newname',
					icoName: 'fa fa-pencil-alt',
					btnName: 'Rename'
				},{
					fnHandler: 'deletedire',
					icoName: 'fa fa-times',
					btnName: 'delete'
				}]);
			}
			else if(data[index].data.contextmenuIndex === 5 && !data[index].data.open)
			{
				this.contextMenuData.menulists.splice(5,1,[{
					fnHandler: 'createadaption',
					icoName: 'fa fa-folder',
					btnName: 'New Adatption'
				},{
					fnHandler: 'newname',
					icoName: 'fa fa-pencil-alt',
					btnName: 'Rename'
				},{
					fnHandler: 'deletedire',
					icoName: 'fa fa-times',
					btnName: 'delete'
				}]);
			}
		},
		dblClick(index){
			let data = this.getdata;
			if(data[index].data.nodeType === 1)
				this.expand_menu(index);
		},
		showMenu(index,event){
			var _this = this;
			_this.clickme(index);
			event.preventDefault();
			_this.className = event.target.closest('.name-container').classList[1];
			var x = event.clientX;
			var y = event.clientY;
			// Get the current location
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
		min-width: 175px;
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
</style>


