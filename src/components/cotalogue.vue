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
							:style="{position: 'absolute',left: (20 * item.data.level - 17) + 'px',top: '6px'}">
						</i>
						<i v-if="item.data.nodeType!==2 && item.data.level !== 1"
							class="fa"
							aria-hidden="true"
							:class="[item.data.open?'fa-angle-down':'fa-angle-right']"
							@click="expand_menu($index)"
							:style="{position: 'absolute',left: (20 * item.data.level - 17) + 'px',top: '6px'}">
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
								:class="item.data.open?'fas fa-image':'fas fa-file-image'" aria-hidden="true"
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
import { Spin,Icon } from 'iview'
import contextMenu from './contextMenu.vue'
import Bus from '../assets/js/common/bus.js'
export default {
	name: 'cotalogue',
	components: {
		Spin,
		Icon,
		contextMenu
	},
	props: {
		data: {
			type: Array,
			default: []
		},
	},
	data () {
		return {
			clickNum: null,
			isloading: false,
			className: '',
			contextMenuData: {
				menuName: 'menu',
				axios: {
					x: null,
					y: null
				},
				menulists:[[],[{
					fnHandler: 'createdire',
					icoName: 'fa fa-image',
					btnName: 'New Diagram'
				},{
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
					fnHandler: 'createdire',
					icoName: 'fa fa-image',
					btnName: 'New Diagram'
				},{
					fnHandler: 'newname',
					icoName: 'fa fa-pencil-alt',
					btnName: 'Rename'
				},{
					fnHandler: 'deletedire',
					icoName: 'fa fa-times',
					btnName: 'delete'
				}],[{
					fnHandler: 'createdire',
					icoName: 'fa fa-image',
					btnName: 'New Diagram'
				}]]
			}
		}
	},
	methods: {
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
			clearTimeout(_this.clickNum);
			_this.clickNum = setTimeout(()=>{
				Bus.$emit('updatedata',_this.data);
				_this.data[index].data.open = !_this.data[index].data.open;
			}, 250);
		},
		clickme(index){
			var _this = this;
			_this.data.forEach((item)=>{
				item.data.isSelected = false;
			});
			_this.data[index].data.isSelected = true;
			//if(_this.data[index].data.modeltype == 1)
				_this.$router.push("/models/feature");
			// else if(_this.data[index].data.modeltype == 2) 
            //     _this.$router.push("/models/component");
            // else if(_this.data[index].data.modeltype == 3)
            //     _this.$router.push("/models/binding_feature_component");
			if(_this.data[index].data.nodeType === 3)
				Bus.$emit('clickactivetab',_this.data[index].data.nodeName);
			else if(_this.data[index].data.level === 1 && _this.data[index].data.open)
			{
					this.contextMenuData.menulists.splice(3,1,[{
					fnHandler: 'createapplication',
					icoName: 'fa fa-folder',
					btnName: 'New Application'
				}]);
			}
			else if(_this.data[index].data.level === 1 && !_this.data[index].data.open)
			{
				this.contextMenuData.menulists.splice(3,1,[{
					fnHandler: 'deleteproject',
					icoName: 'fa fa-times',
					btnName: 'delete project'
				}]);
			}
		},
		dblClick(index){
			var _this = this;
			if(_this.data[index].data.nodeType === 1){
				_this.expand_menu(index);
			}
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
</style>


