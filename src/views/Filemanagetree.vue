<template>
	<div>
                    <div v-if="data.length !== 0" style="margin-right:10px; margin-bottom:10px;">
                        <cotalogue ref="cotalogue" :data="data"></cotalogue>
                    </div>
					<Modal
						v-model="newName.isshow"
						:loading="newName.loading"
						title="Rename"
						class-name="vertical-center-modal"
						width="600"
						ok-text="OK"
        				cancel-text="Cancel"
						@on-ok="rename"
						@on-cancel="newName.isshow=false,newName.formval.changedName='',newName.formval.id=null">
						<div class="form-horizontal">
							<div class="form-group">
								<label class="col-md-3 control-label"><em>*</em> New name:</label>
								<div class="col-md-9">
									<input type="text" class="form-control" maxlength="70" v-model="newName.formval.changedName" :placeholder="'Please enter a new name'" />
								</div>
							</div>
						</div>
					</Modal>
					<Modal
						v-model="newDiagram.isshow"
						:loading="newDiagram.loading"
						title="New diagram"
						class-name="vertical-center-modal"
						width="600"
						ok-text="OK"
        				cancel-text="Cancel"
						@on-ok="createDire"
						@on-cancel="newDiagram.isshow=false,newDiagram.formval.diagramName='',newDiagram.formval.id=null">
						<div class="form-horizontal">
							<div class="form-group">
								<label class="col-md-2 control-label">Father:</label>
								<div class="col-md-9">
									<input type="text" class="form-control" disabled v-model="newDiagram.formval.parentFolder" />
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><em>*</em> Diagram name:</label>
								<div class="col-md-9">
									<input type="text" class="form-control" maxlength="70" v-model="newDiagram.formval.diagramName" :placeholder="'Please enter a new diagram name'" />
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-6 control-label"><em>*</em> Please select the type of model:</label>
								<div class="col-md-9">
									<Select placeholder="" v-model="newDiagram.formval.modeltype" style="width:200px">
        								<Option v-for="item in modellist" :value="item.value" :key="item.value">{{ item.label }}</Option>
    								</Select>
								</div>
							</div>
						</div>
					</Modal>
					<Modal
						v-model="newApplication.isshow"
						:loading="newApplication.loading"
						title="New Application"
						class-name="vertical-center-modal"
						width="600"
						ok-text="OK"
        				cancel-text="Cancel"
						@on-ok="createApplication"
						@on-cancel="newApplication.isshow=false,newApplication.applicationName='',newApplication.id=null">
						<div class="form-horizontal">
							<div class="form-group">
								<label class="col-md-2 control-label">Father:</label>
								<div class="col-md-9">
									<input type="text" class="form-control" disabled v-model="newApplication.parentFolder" />
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><em>*</em> Application name:</label>
								<div class="col-md-9">
									<input type="text" class="form-control" maxlength="70" v-model="newApplication.applicationName" :placeholder="'Please enter a new application name'" />
								</div>
							</div>
						</div>
					</Modal>
					<Modal
						v-model="newAdaptation.isshow"
						:loading="newAdaptation.loading"
						title="New Adaptation"
						class-name="vertical-center-modal"
						width="600"
						ok-text="OK"
        				cancel-text="Cancel"
						@on-ok="createAdaptation"
						@on-cancel="newAdaptation.isshow=false,newAdaptation.adapatationName='',newAdaptation.id=null">
						<div class="form-horizontal">
							<div class="form-group">
								<label class="col-md-2 control-label">Father:</label>
								<div class="col-md-9">
									<input type="text" class="form-control" disabled v-model="newAdaptation.parentFolder" />
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><em>*</em> Adaptation name:</label>
								<div class="col-md-9">
									<input type="text" class="form-control" maxlength="70" v-model="newAdaptation.adapatationName" :placeholder="'Please enter a new adaptation name'" />
								</div>
							</div>
						</div>
					</Modal>
					
                    <div v-if="activetab === ''" class="button_tree_element">
                        <div class="button-unique" >
                            <button class="btn-model-area btn btn-sm btn-outline-secondary" type="primary" @click="newProject.isshow=!newProject.isshow">
                                <div style="padding:1px; font-size:1px;">
                                    <i class="fas fa-plus"></i>
                                    Add a new project
                                </div>
                            </button>
							<Modal
								v-model="newProject.isshow"
								:loading="newProject.loading"
								title="New project"
								class-name="vertical-center-modal"
								width="600"
								ok-text="OK"
        						cancel-text="Cancel"
								@on-ok="createproject"
								@on-cancel="newProject.isshow=false,newProject.formval.projectName='',newProject.formval.id=null">
								<div class="form-horizontal">
									<div class="form-group">
										<label class="col-md-3 control-label"><em>*</em> New project name:</label>
										<div class="col-md-9">
											<input type="text" class="form-control" maxlength="70" v-model="newProject.formval.projectName" :placeholder="'Please enter a new project name'" />
										</div>
									</div>
								</div>
							</Modal>
                        </div>
                    </div>
    </div>
</template>

<script>
import Bus from '../assets/js/common/bus.js'
import cotalogue from '../components/cotalogue'

export default{
    components:{
		cotalogue
    },
    data: function() {
        return{
			model_component_index: -1,
			activetab:'',
		modellist:[{
			value: 1,
			label: 'Feature'
		},
		{
			value: 2,
			label: 'Component'
		}],
        data: [],
			newName: {
				isshow: false,
				loading: true,
				index: null,
				formval: {
					changedName: '',
					id: null
				}
			},
			newProject: {
				isshow: false,
				loading: true,
				index: null,
				formval: {
					projectName: '',
					id: null,
					parentId: -1,
					parentFolder: '',
					numberofmember: 0
				}
			},
			newDiagram: {
				isshow: false,
				loading: true,
				index: null,
				formval: {
					diagramName: '',
					id: null,
					parentId: null,
					parentFolder: '',
					projectId: -1,
					numberofmember: 0,
					modeltype: 0
				}
			},
			newApplication: {
				isshow: false,
				loading: true,
				index: null,
				id:null,
				parentId: null,
				applicationName: '',
				parentFolder: ''
			},
			newAdaptation: {
				isshow: false,
				loading: true,
				index: null,
				id:null,
				parentId: null,
				adapatationName:'',
				parentFolder: ''
			}
        }
    },
	mounted () {
		//new diagram
        Bus.$on('createdire', data => {
			this.newDiagram.isshow = true;
			this.newDiagram.index = this.getIndexById(data.data.nodeId);
			this.newDiagram.formval.diagramName = '';
			this.newDiagram.formval.parentId = data.data.nodeId;
			this.newDiagram.formval.parentFolder = data.data.nodeName;
			this.newDiagram.formval.numberofmember = data.numberOfChildren;
			this.newDiagram.formval.projectId = data.data.projectId;
		});

		Bus.$on('createapplication', data => {
			this.newApplication.isshow = true;
			this.newApplication.index = this.getIndexById(data.data.nodeId);
			this.newApplication.applicationName = '';
			this.newApplication.parentFolder = data.data.nodeName;
			this.newApplication.parentId = data.data.nodeId;
		});

		Bus.$on('createadaption', data => {
			this.newAdaptation.isshow = true;
			this.newAdaptation.index = this.getIndexById(data.data.nodeId);
			this.newAdaptation.adapatationName = '';
			this.newAdaptation.parentFolder = data.data.nodeName;
			this.newAdaptation.parentId = data.data.nodeId;
		});
		//delete diagram
		Bus.$on('deletedire', data => {
			let index = this.getIndexById(data.data.nodeId);
			if(this.data[index].data.nodeType === 3)
			{
				this.data.splice(index, 1+this.data[index].numberOfChildren);
				Bus.$emit('deletelayer', this.data);
			}
			else
			{
				for(let i = index + 1; i < this.data.length; i++)
				{
					if(this.data[i].data.level < this.data[index].data.level || this.data[i].data.level === this.data[index].data.level || i === this.data.length-1)
					{
						this.data.splice(index, i - index);
						//localStorage.removeItem(data.data.nodeName);
						break;
					}	
				}
				Bus.$emit('updatemodel_component3',-1);
			}
            Bus.$emit('updatedata',this.data);
		});
		Bus.$on('deleteproject', data => {
			let index = this.getIndexById(data.data.nodeId);
			for(let i = index + 1; i < this.data.length; i++)
			{
				if(this.data[i].data.projectId !== data.data.nodeId)
				{
					this.data.splice(index, i - index);
					break;
				}
				if(i === this.data.length - 1)
					this.data.splice(index, i - index + 1);
			}
		});
		Bus.$on('updateactivetab', tab =>{
			this.activetab = tab;
		});
		Bus.$on('updatemodel_component1', index =>{
			this.model_component_index = index;
        });
		//add update or delete element
		Bus.$on('manageelement', cells => {
			let projectid = this.data[this.model_component_index].data.projectId;
			let parentid = 0;
			let parentindex = 0;
            for(var i = 0; i < this.data.length; i++)
            {
                if(this.data[i].data.nodeName == this.activetab && this.data[i].data.parentId === this.data[this.model_component_index].data.nodeId)
                {
                    parentid = this.data[i].data.nodeId;
                    parentindex = i;
                }
			}
			this.data.splice(parentindex+1, this.data[parentindex].numberOfChildren);
			this.data[parentindex].numberOfChildren = 0;
			for(let j = 0; j < cells.length; j++)
			{
				this.createelemnt(cells[j], parentid, parentindex, projectid);
			}	
		});
		//delete element
		Bus.$on('deletetask', data => {
			this.deleteTask(data);
		});
		//rename
		Bus.$on('newname', data => {
			this.newName.isshow = true;
			this.newName.index = this.getIndexById(data.data.nodeId);
			this.newName.formval.changedName = data.data.nodeName;
		});
		 Bus.$on('resetall', data => {
            for(let i = 0; i < this.data.length; i++)
			{
				this.data[i].data.open = false;
			}
			Bus.$emit('updatemodel_component1',-1);
		});
		Bus.$on('updatedata_back', data => {
            this.data = data;
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
	},
    methods:{
		getnewnodeid(){ //get a new nodeID
			let temp = 0;
			for(let i = 0; i < this.data.length; i++)
				temp = this.data[i].data.nodeId > temp ? this.data[i].data.nodeId : temp;
			return temp + 1;
		},
		getIndexById(nodeId){
			for(let i = 0;i<this.data.length;i++){
				if(this.data[i].data.nodeId === nodeId){
					return i
				}
			}
		},
		getChildrenLength(index){
			var _this = this;
				length = 0;
			if(_this.data.length < 2){
				return 0
			}else{
				for(let i = index + 1;i < _this.data.length;i++){
					if(_this.data[i].data.level > _this.data[index].data.level){
						length += 1
					}else if(_this.data[i].data.level === _this.data[index].data.level){
						return length
					}
				}
			}
		},
		createproject(){
			var _this = this;
			setTimeout(()=>{
				if(typeof (_this.data.find(function(data_diagram){
					return data_diagram.data.nodeName === _this.newProject.formval.projectName && data_diagram.data.parentId == -1;
				}))!=='undefined')
				{
					_this.newProject.loading = false;
					_this.$nextTick(() => {
						_this.newProject.loading = true;
						_this.$Message.warning('Duplicated name!');
					});
                }
                else if(_this.newProject.formval.projectName.length === 0){
						_this.newProject.loading = false;
						_this.$nextTick(() => {
						_this.newProject.loading = true;
						_this.$Message.warning('Empty is not allowed!');
					});
				}
				else {
					let temp = this.getnewnodeid();
					_this.data.unshift({
						children: [],
							data: {
								open: false,
								isSelected: false,
								level:  1,
								nodeId:  temp,
								nodeName: _this.newProject.formval.projectName,
								nodeType: 1,
								parentId: -1,
								projectId: temp,
								modeltype: 1,
								contextmenuIndex: 3
							},
							numberOfChildren: 2
					},{
						children: [],
						data: {
							open: false,
							isSelected: false,
							level: 2,
							nodeId: temp+1,
							nodeName: "Domain - " + _this.newProject.formval.projectName,
							nodeType: 1,
							parentId: temp,
							projectId: temp,
							modeltype: 1,
							contextmenuIndex: 6
						},
						numberOfChildren: 1
					},{
						children: [],
						data: {
							open: false,
							isSelected: false,
							level: 3,
							nodeId: temp+2,
							nodeName: "binding_feature_component",
							nodeType: 3,
							parentId: temp+1,
							projectId: temp,
							modeltype: 3,
							contextmenuIndex: 0
						},
						numberOfChildren: 0
					},{
						children: [],
						data: {
							open: false,
							isSelected: false,
							level: 2,
							nodeId: temp+3,
							nodeName: "Application - default",
							nodeType: 1,
							parentId: temp,
							projectId: temp,
							modeltype: 1,
							contextmenuIndex: 5
						},
						numberOfChildren: 2
					},{
						children: [],
						data: {
							open: false,
							isSelected: false,
							level: 3,
							nodeId: temp+4,
							nodeName: "binding_feature_component",
							nodeType: 3,
							parentId: temp+3,
							projectId: temp,
							modeltype: 3,
							contextmenuIndex: 0
						},
						numberOfChildren: 0
					},{
						children: [],
						data: {
							open: false,
							isSelected: false,
							level: 3,
							nodeId: temp+5,
							nodeName: "Adaptation - default",
							nodeType: 1,
							parentId: temp+3,
							projectId: temp,
							modeltype: 1,
							contextmenuIndex: 1
						},
						numberOfChildren: 1
					},{
						children: [],
						data: {
							open: false,
							isSelected: false,
							level: 4,
							nodeId: temp+6,
							nodeName: "binding_feature_component",
							nodeType: 3,
							parentId: temp+5,
							projectId: temp,
							modeltype: 3,
							contextmenuIndex: 0
						},
						numberOfChildren: 0
					});
					_this.newProject.loading = false;
					_this.newProject.isshow = false;
				}
				Bus.$emit('updatedata',this.data);
            }, 300);
		},
		createDire(){
			var _this = this;
			if(typeof(_this.newDiagram.index) === 'undefined'){
				return
			}
			if(!_this.data[_this.newDiagram.index].data.open){
				_this.$refs.cotalogue.expand_menu(_this.newDiagram.index);
			}
			setTimeout(()=>{
				if(typeof (_this.data.find(function(data_diagram){
					return data_diagram.data.nodeName === _this.newDiagram.formval.diagramName && data_diagram.data.projectId == _this.newDiagram.formval.projectId
					&& data_diagram.data.nodeType === 3;
				}))!=='undefined')
				{
					_this.newDiagram.loading = false;
					_this.$nextTick(() => {
						_this.newDiagram.loading = true;
						_this.$Message.warning('Duplicated name!');
					});
				}
				else if(_this.newDiagram.formval.modeltype === 0){
						_this.newDiagram.loading = false;
						_this.$nextTick(() => {
						_this.newDiagram.loading = true;
						_this.$Message.warning('Please select a model type!');
                    });
                }
				else {
					if(_this.newDiagram.formval.diagramName.length){
						_this.data.splice(_this.newDiagram.index + 1, 0 , {
							children: [],
							data: {
								open: false,
								isSelected: false,
								level:  _this.data[_this.newDiagram.index].data.level + 1,
								nodeId:  this.getnewnodeid(),
								nodeName: _this.newDiagram.formval.diagramName,
								nodeType: 3,
								parentId: _this.data[_this.newDiagram.index].data.nodeId,
								projectId: _this.data[_this.newDiagram.index].data.projectId,
								modeltype: _this.newDiagram.formval.modeltype,
								contextmenuIndex: 2
							},
							numberOfChildren: 0
						});
						_this.data[_this.newDiagram.index].numberOfChildren++;
						_this.newDiagram.loading = false;
						_this.newDiagram.isshow = false;
					}
					else{
						_this.newDiagram.loading = false;
						_this.$nextTick(() => {
							_this.newDiagram.loading = true;
							_this.$Message.warning('Empty is not allowed!');
						});
					}
                }
				Bus.$emit('updatedata',this.data);
				Bus.$emit('updatelayer',_this.newDiagram.formval.diagramName);
            }, 300);
            
		},
		createApplication(){
			var _this = this;
			if(typeof(_this.newApplication.index) === 'undefined'){
				return
			}
			if(!_this.data[_this.newApplication.index].data.open){
				_this.$refs.cotalogue.expand_menu(_this.newApplication.index);
			}
			setTimeout(()=>{
				if(typeof (_this.data.find(function(data_diagram){
					return data_diagram.data.nodeName === _this.newApplication.applicationName && data_diagram.data.parentId == _this.newApplication.parentId;
				}))!=='undefined')
				{
					_this.newApplication.loading = false;
					_this.$nextTick(() => {
						_this.newApplication.loading = true;
						_this.$Message.warning('Duplicated name!');
					});
				}
				else {
					if(_this.newApplication.applicationName.length){
						let temp = this.getnewnodeid();
						let tempindex = 0;
						for(let i = 0; i < _this.data.length; i ++)
						{
							if(_this.data[i].data.projectId === _this.data[_this.newApplication.index].data.nodeId)
								tempindex++;
						}
						_this.data.splice(_this.newApplication.index + tempindex, 0 , {
							children: [],
							data: {
								open: false,
								isSelected: false,
								level:  _this.data[_this.newApplication.index].data.level + 1,
								nodeId:  temp,
								nodeName: "Application - " + _this.newApplication.applicationName,
								nodeType: 1,
								parentId: _this.data[_this.newApplication.index].data.nodeId,
								projectId: _this.data[_this.newApplication.index].data.nodeId,
								modeltype: _this.data[_this.newApplication.index].data.modeltype,
								contextmenuIndex: 5
							},
							numberOfChildren: 2
						},{
						children: [],
						data: {
							open: false,
							isSelected: false,
							level: _this.data[_this.newApplication.index].data.level + 2,
							nodeId: temp+1,
							nodeName: "binding_feature_component",
							nodeType: 3,
							parentId: temp,
							projectId: _this.data[_this.newApplication.index].data.nodeId,
							modeltype: 3,
							contextmenuIndex: 0
						},
						numberOfChildren: 0
					});
						_this.data.splice(_this.newApplication.index + tempindex + 1, 0 , {
							children: [],
							data: {
								open: false,
								isSelected: false,
								level:  _this.data[_this.newApplication.index].data.level + 2,
								nodeId:  temp+2,
								nodeName: "Adaptation - " + _this.newApplication.applicationName,
								nodeType: 1,
								parentId: temp,
								projectId: _this.data[_this.newApplication.index].data.nodeId,
								modeltype: _this.data[_this.newApplication.index].data.modeltype,
								contextmenuIndex: 1
							},
							numberOfChildren: 1
						},{
						children: [],
						data: {
							open: false,
							isSelected: false,
							level: _this.data[_this.newApplication.index].data.level + 3,
							nodeId: temp+3,
							nodeName: "binding_feature_component",
							nodeType: 3,
							parentId: temp+2,
							projectId: _this.data[_this.newApplication.index].data.nodeId,
							modeltype: 3,
							contextmenuIndex: 0
						},
						numberOfChildren: 0
					});
						_this.data[_this.newApplication.index].numberOfChildren++;
						_this.newApplication.loading = false;
						_this.newApplication.isshow = false;
					}
					else{
						_this.newApplication.loading = false;
						_this.$nextTick(() => {
							_this.newApplication.loading = true;
							_this.$Message.warning('Empty is not allowed!');
						});
					}
                }
                Bus.$emit('updatedata',this.data);
            }, 300);
            
		},
		createAdaptation(){
			var _this = this;
			if(typeof(_this.newAdaptation.index) === 'undefined'){
				return
			}
			if(!_this.data[_this.newAdaptation.index].data.open){
				_this.$refs.cotalogue.expand_menu(_this.newAdaptation.index);
			}
			setTimeout(()=>{
				if(typeof (_this.data.find(function(data_diagram){
					return data_diagram.data.nodeName === _this.newAdaptation.adapatationName && data_diagram.data.parentId == _this.newAdaptation.parentId;
				}))!=='undefined')
				{
					_this.newAdaptation.loading = false;
					_this.$nextTick(() => {
						_this.newAdaptation.loading = true;
						_this.$Message.warning('Duplicated name!');
					});
				}
				else {
					if(_this.newAdaptation.adapatationName.length){
						let temp = this.getnewnodeid();
						_this.data.splice(_this.newAdaptation.index + 1, 0 , {
							children: [],
							data: {
								open: false,
								isSelected: false,
								level:  _this.data[_this.newAdaptation.index].data.level + 1,
								nodeId:  temp,
								nodeName: "Adaptation - " + _this.newAdaptation.adapatationName,
								nodeType: 1,
								parentId: _this.data[_this.newAdaptation.index].data.nodeId,
								projectId: _this.data[_this.newAdaptation.index].data.projectId,
								modeltype: _this.data[_this.newAdaptation.index].data.modeltype,
								contextmenuIndex: 1
							},
							numberOfChildren: 1
						},{
						children: [],
						data: {
							open: false,
							isSelected: false,
							level: _this.data[_this.newAdaptation.index].data.level + 2,
							nodeId: temp+1,
							nodeName: "binding_feature_component",
							nodeType: 3,
							parentId: temp,
							projectId: _this.data[_this.newAdaptation.index].data.projectId,
							modeltype: 3,
							contextmenuIndex: 0
						},
						numberOfChildren: 0
					});
						_this.data[_this.newAdaptation.index].numberOfChildren++;
						_this.newAdaptation.loading = false;
						_this.newAdaptation.isshow = false;
					}
					else{
						_this.newAdaptation.loading = false;
						_this.$nextTick(() => {
							_this.newAdaptation.loading = true;
							_this.$Message.warning('Empty is not allowed!');
						});
					}
                }
                Bus.$emit('updatedata',this.data);
            }, 300);
            
		},
		createelemnt(cells, parentid, parentindex, projectid)
		{
			if(cells.getAttribute('type') == 'relation')
			{
				this.data.splice(parentindex + 1, 0 , {
				children: [],
				data: {
					open: false,
					isSelected: false,
					level: this.data[parentindex].data.level + 1,
					nodeId: this.getnewnodeid(),
					nodeName: 'Relation - ' + cells.getAttribute('relType'),
					nodeType: 2,
					status: 1,
					parentId: parentid,
					projectId: projectid,
					contextmenuIndex: 4
				},
					numberOfChildren: 0
				});
				this.data[parentindex].numberOfChildren++;
			}
			else if(cells.getAttribute('type') == 'bundle')
			{
				this.data.splice(parentindex + 1, 0 , {
				children: [],
				data: {
					open: false,
					isSelected: false,
					level: this.data[parentindex].data.level + 1,
					nodeId: this.getnewnodeid(),
					nodeName: 'Bundle - ' + cells.getAttribute('bundleType'),
					nodeType: 2,
					status: 1,
					parentId: parentid,
					projectId: projectid,
					contextmenuIndex: 4
				},
					numberOfChildren: 0
				});
				this.data[parentindex].numberOfChildren++;
			}
			else
			{
				this.data.splice(parentindex + 1, 0 , {
				children: [],
				data: {
					open: false,
					isSelected: false,
					level: this.data[parentindex].data.level + 1,
					nodeId: this.getnewnodeid(),
					nodeName: cells.getAttribute('label'),
					nodeType: 2,
					status: 0,
					parentId: parentid,
					projectId: projectid,
					contextmenuIndex: 4
				},
					numberOfChildren: 0
				});
				this.data[parentindex].numberOfChildren++;
			}
		},
		deleteTask(data){
			var _this = this,
				index = _this.getIndexById(data.data.nodeId);
			if(typeof(index) === 'undefined'){
				return
			}
			_this.data.splice(index, 1);
		},
		rename(){
			var _this = this;
			setTimeout(()=>{
				if(_this.newName.formval.changedName.length){
					if(typeof(_this.newName.index) === 'undefined'){
						return
					}
					_this.newName.isshow = false;
					_this.newName.loading = false;
					_this.data[_this.newName.index].data.nodeName = _this.newName.formval.changedName;
				}else{
					_this.newName.loading = false;
					_this.$nextTick(() => {
						_this.newName.loading = true;
						_this.$Message.warning('Empty is not allowed！');
					});
                }
                Bus.$emit('updatedata',this.data);
            }, 250);
		}
	},
	watch:{
		$route (to, from){
			if(this.$route.name !== 'Models')
			{
				for(let i = 0; i < this.data.length; i++)
				{
					if(this.data[i].data.level === 1)
						this.data[i].data.open = false;
				}
			}
		}
	}
}
</script>

<style scoped>
.button_tree_element{
  display: inline-block;
  width: 100%;
}

.button-unique{
    float: left;
}

.btn-model-area{
    border-bottom: 0px !important;
    border-top: 0px !important;
    border-left: 0px !important;
    border-right: 0px !important;
}

.vertical-center-modal {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.vertical-center-modal .ivu-modal{
		top: 0;
	}
	em {
		color: #f00;
		font-size: 13px;
}
</style>
