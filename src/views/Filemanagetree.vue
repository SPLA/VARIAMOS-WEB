<template>
	<div>
					<div class="button_tree_element">
                        <div class="button-unique" >
                            <button class="btn-model-area btn btn-sm btn-outline-secondary" type="primary" @click="newProject.isshow=!newProject.isshow" data-test="newprojectbutton">
                                <div style="padding:1px; font-size:12px;">
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
								@on-cancel="newProject.isshow=false,newProject.formval.projectName=''"
								data-test="newprojectmodal">
								<div class="form-horizontal">
									<div class="form-group">
										<label class="col-md-3 control-label"><em>*</em> New project name:</label>
										<div class="col-md-9">
											<input type="text" class="form-control" maxlength="70" v-model="newProject.formval.projectName" :placeholder="'Please enter a new project name'" data-test="newprojectmodalinput"/>
										</div>
									</div>
								</div>
							</Modal>
                        </div>
                    </div>
                    <div v-if="getdata" style="margin-right:10px; margin-bottom:10px;">
                        <cotalogue ref="cotalogue"></cotalogue>
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
			newName: {
				isshow: false,
				loading: true,
				index: null,
				formval: {
					changedName: '',
					id: null,
					projectId: -1,
					type: ''
				}
			},
			newProject: {
				isshow: false,
				loading: true,
				formval: {
					projectName: '',
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
		if(localStorage['Filetree|User1'])
		{
			 let data = JSON.parse(localStorage.getItem('Filetree|User1'));
			 this.$store.dispatch('loadtreedata', data);
		}
		if(localStorage['Filetree|activetab'])
		{
			 let data = JSON.parse(localStorage.getItem('Filetree|activetab'));
			 this.$store.dispatch('updateactivetab', data);
		}
		if(localStorage['Filetree|model_component_index'])
		{
			 let data = JSON.parse(localStorage.getItem('Filetree|model_component_index'));
			 this.$store.dispatch('updatemodelcomponent', data);
		}
		this.$Message.config({
    		top: 100,
    		duration: 2
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
		Bus.$on('deletedire', data => {
			let index = this.getIndexById(data.data.nodeId);
			if(data.data.open)
			{
				Bus.$emit('setfalsegraph',false);
				this.$store.dispatch('updatemodelcomponent', -1);
				this.$store.dispatch('setopen', index);
			}
			this.$store.dispatch('deletefolder', index);
			localStorage.removeItem(data.data.nodeName);
		});
		Bus.$on('deleteproject', data => {
			let index = this.getIndexById(data.data.nodeId);
			this.$store.dispatch('deleteproject', index);
			this.$router.push("/models/default/default/default");
		});
		//rename
		Bus.$on('newname', data => {
			this.newName.isshow = true;
			this.newName.index = this.getIndexById(data.data.nodeId);
			this.newName.formval.changedName = '';
			this.newName.formval.type = data.data.nodeName.split('-')[0];
			this.newName.formval.projectId = data.data.projectId;
		});
	},
    methods:{
		getIndexById(nodeId){
			let data = this.getdata;
			for(let i = 0; i < data.length; i++){
				if(data[i].data.nodeId === nodeId){
					return i;
				}
			}
		},
		checkopenproject(){
			let data = this.getdata;
			for(let i = 0; i < data.length; i++)
			{
				if(data[i].data.open && data[i].data.level === 1)
					return true;
			}
			return false;
		},
		createproject(){
			let data = this.getdata;
			setTimeout(()=>{
				let pro = this.newProject;
				if(typeof (data.find(function(data_diagram){
					return data_diagram.data.nodeName === pro.formval.projectName && data_diagram.data.parentId == -1;
				}))!=='undefined')
				{
					this.newProject.loading = false;
					this.$nextTick(() => {
						this.newProject.loading = true;
						this.$Message.warning('Duplicated name!');
					});
                }
                else if(this.newProject.formval.projectName.length === 0){
					this.newProject.loading = false;
					this.$nextTick(() => {
						this.newProject.loading = true;
						this.$Message.warning('Empty is not allowed!');
					});
				}
				else if(this.checkopenproject()){
					this.newProject.loading = false;
					this.newProject.isshow = false;
					this.$Message.warning('Please close the opened project!');
				}
				else {
					this.$store.dispatch('createproject', this.newProject.formval.projectName);
					this.newProject.loading = false;
					this.newProject.isshow = false;
				}
            }, 300);
		},
		createApplication(){
			let data = this.getdata;
			if(typeof(this.newApplication.index) === 'undefined'){
				return
			}
			if(!data[this.newApplication.index].data.open){
				this.$refs.cotalogue.expand_menu(this.newApplication.index);
			}
			setTimeout(()=>{
				let app = this.newApplication;
				if(typeof (data.find(function(data_diagram){
					return data_diagram.data.nodeName === app.applicationName && data_diagram.data.parentId === app.parentId;
				}))!=='undefined')
				{
					this.newApplication.loading = false;
					this.$nextTick(() => {
						this.newApplication.loading = true;
						this.$Message.warning('Duplicated name!');
					});
				}
				else if(this.newApplication.applicationName.length === 0){
					this.newApplication.loading = false;
					this.$nextTick(() => {
						this.newApplication.loading = true;
						this.$Message.warning('Empty is not allowed!');
					});
				}
				else {
					let index = 0;
					for(let i = 0; i < data.length; i++)
					{
						if(data[i].data.parentId === app.parentId && data[i].data.nodeName.includes('Application'))
							index++;
					}
					this.newApplication.appindex = index + 1;
					this.$store.dispatch('createapplication', this.newApplication);
					this.newApplication.loading = false;
					this.newApplication.isshow = false;
                }
            }, 300);
            
		},
		createAdaptation(){
			let data = this.getdata;
			if(typeof(this.newAdaptation.index) === 'undefined'){
				return
			}
			// if(!data[this.newAdaptation.index].data.open){
			// 	this.$refs.cotalogue.expand_menu(this.newAdaptation.index);
			// }
			setTimeout(()=>{
				let adp = this.newAdaptation;
				if(typeof (data.find(function(data_diagram){
					return data_diagram.data.nodeName === adp.adapatationName && data_diagram.data.parentId == adp.parentId;
				}))!=='undefined')
				{
					this.newAdaptation.loading = false;
					this.$nextTick(() => {
						this.newAdaptation.loading = true;
						this.$Message.warning('Duplicated name!');
					});
				}
				else if(this.newAdaptation.adapatationName.length === 0)
				{
					this.newAdaptation.loading = false;
					this.$nextTick(() => {
						this.newAdaptation.loading = true;
						this.$Message.warning('Empty is not allowed!');
					});
				}
				else {
					let index = 0;
					for(let i = 0; i < data.length; i++)
					{
						if(data[i].data.parentId === adp.parentId && data[i].data.nodeName.includes('Adaptation'))
							index++;
					}
					this.newApplication.adpindex = index + 1;
					this.$store.dispatch('createadaptation', this.newAdaptation);
					this.newAdaptation.loading = false;
					this.newAdaptation.isshow = false;
                }
            }, 300);
            
		},
		rename(){
			let data = this.getdata;
			if(typeof(this.newName.index) === 'undefined')
				return
			setTimeout(()=>{
				let nn = this.newName;
				if(nn.formval.type === 'Application ')
					nn.formval.changedName = data[nn.index].data.nodeName.split('-')[0] + '-' + data[nn.index].data.nodeName.split('-')[1] + '- ' + nn.formval.changedName;
				else if(nn.formval.type === 'Adaptation ')
					nn.formval.changedName = data[nn.index].data.nodeName.split('-')[0] + '-' + data[nn.index].data.nodeName.split('-')[1] + '-' + data[nn.index].data.nodeName.split('-')[2] + '- ' + nn.formval.changedName;
				if(typeof (data.find(function(data_diagram){
					return data_diagram.data.nodeName === nn.formval.changedName && data_diagram.data.projectId == nn.formval.projectId
					&& data_diagram.data.nodeType === 3;
				}))!=='undefined')
				{
					this.newName.loading = false;
					this.$nextTick(() => {
						this.newName.loading = true;
						this.$Message.warning('Duplicated name!');
					});
				}
				else if(this.newName.formval.changedName.length === 0){
					this.newName.loading = false;
					this.$nextTick(() => {
						this.newName.loading = true;
						this.$Message.warning('Empty is not allowed！');
					});
				}
				else{
					if(localStorage[data[nn.index].data.nodeName])
					{
						localStorage[nn.formval.changedName] = localStorage[data[nn.index].data.nodeName];
						localStorage.removeItem(data[nn.index].data.nodeName);
						if(nn.formval.type === 'Application ')
						{
							for(let i = nn.index + 1; i < data.length; i++)
							{
								if(data[i].data.parentId === data[nn.index].data.nodeId && data[i].data.nodeName.includes('Adaptation') && localStorage[data[i].data.nodeName])
								{
									localStorage[nn.formval.changedName + ' -' + state.data[i].data.nodeName.split('-')[3]] = localStorage[data[i].data.nodeName];
									localStorage.removeItem(data[i].data.nodeName);
								}
							}
						}
					}
					this.$store.dispatch('changename', this.newName);
					this.newName.isshow = false;
					this.newName.loading = false;
                }
            }, 250);
		}
	},
	computed: {
        getactivetab (){
            return this.$store.getters.getactivetab;
        },
        getdata (){
            return this.$store.getters.getdata;
        },
        getmodel_component_index (){
            return this.$store.getters.getmodelcomponentindex;
        }
    },
	watch:{
		$route (to, from){

		},
		getactivetab:{
			handler(val) {
				localStorage.setItem('Filetree|activetab', JSON.stringify(val));
     	 	},
      		deep:true
		},
		getdata:{
			handler(val) {
				localStorage.setItem('Filetree|User1', JSON.stringify(val));
     	 	},
      		deep:true
		},
		getmodel_component_index:{
			handler(val) {
				localStorage.setItem('Filetree|model_component_index', JSON.stringify(val));
     	 	},
      		deep:true
		}
	}
}
</script>

<style scoped>
.button_tree_element{
  display: inline-block;
  width: 100%;
  border-bottom: 1px solid #ccc;
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
