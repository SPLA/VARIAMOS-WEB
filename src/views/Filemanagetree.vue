<template>
	<div>
					<div class="button_tree_element">
                        <div class="button-unique" >
                            <button class="btn-model-area btn btn-sm btn-outline-secondary" type="primary" @click="newProject.isshow=!newProject.isshow" data-test="newprojectbutton">
                                <div style="padding:1px; font-size:12px;">
                                    <i class="fas fa-plus"></i>
                                    {{$t("filemanagement_addproject_button")}}
                                </div>
                            </button>
							<Modal
								v-model="newProject.isshow"
								:loading="newProject.loading"
								:title="$t('filemanagement_addproject_title')"
								class-name="vertical-center-modal"
								width="600"
								ok-text="OK"
        						cancel-text="Cancel"
								@on-ok="createproject"
								@on-cancel="newProject.isshow=false,newProject.formval.projectName=''"
								data-test="newprojectmodal">
								<div class="form-horizontal">
									<div class="form-group">
										<label class="col-md-3 control-label"><em>*</em> {{$t("filemanagement_addproject_label")}}</label>
										<div class="col-md-9">
											<input type="text" class="form-control" maxlength="70" v-model="newProject.formval.projectName" :placeholder="$t('filemanagement_addproject_context')" data-test="newprojectmodalinput"/>
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
						:title="$t('filemanagement_changename_title')"
						class-name="vertical-center-modal"
						width="600"
						ok-text="OK"
        				cancel-text="Cancel"
						@on-ok="rename"
						@on-cancel="newName.isshow=false,newName.formval.changedName='',newName.formval.id=null">
						<div class="form-horizontal">
							<div class="form-group">
								<label class="col-md-3 control-label"><em>*</em>{{$t("filemanagement_changename_label")}}</label>
								<div class="col-md-9">
									<input type="text" class="form-control" maxlength="70" v-model="newName.formval.changedName" :placeholder="$t('filemanagement_changename_context')" />
								</div>
							</div>
						</div>
					</Modal>
					<Modal
						v-model="newApplication.isshow"
						:loading="newApplication.loading"
						:title="$t('filemanagement_newapplication_title')"
						class-name="vertical-center-modal"
						width="600"
						ok-text="OK"
        				cancel-text="Cancel"
						@on-ok="createApplication"
						@on-cancel="newApplication.isshow=false,newApplication.applicationName='',newApplication.id=null">
						<div class="form-horizontal">
							<div class="form-group">
								<label class="col-md-2 control-label">{{$t("filemanagement_newapplication_father")}}</label>
								<div class="col-md-9">
									<input type="text" class="form-control" disabled v-model="newApplication.parentFolder" />
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><em>*</em>{{$t("filemanagement_newapplication_label")}}</label>
								<div class="col-md-9">
									<input type="text" class="form-control" maxlength="70" v-model="newApplication.applicationName" :placeholder="$t('filemanagement_newapplication_context')" />
								</div>
							</div>
						</div>
					</Modal>
					<Modal
						v-model="newAdaptation.isshow"
						:loading="newAdaptation.loading"
						:title="$t('filemanagement_newadaptation_title')"
						class-name="vertical-center-modal"
						width="600"
						ok-text="OK"
        				cancel-text="Cancel"
						@on-ok="createAdaptation"
						@on-cancel="newAdaptation.isshow=false,newAdaptation.adapatationName='',newAdaptation.id=null">
						<div class="form-horizontal">
							<div class="form-group">
								<label class="col-md-2 control-label">{{$t('filemanagement_newadaptation_father')}}</label>
								<div class="col-md-9">
									<input type="text" class="form-control" disabled v-model="newAdaptation.parentFolder" />
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><em>*</em>{{$t('filemanagement_newadaptation_label')}}</label>
								<div class="col-md-9">
									<input type="text" class="form-control" maxlength="70" v-model="newAdaptation.adapatationName" :placeholder="$t('filemanagement_newadaptation_context')" />
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
			/**
			 * temporary object to store new name for rename function
			 * @property	{string} changedName	- the new name which will replace the old name
			 * @property	{string} type			- check between application and adaptation
			*/
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
			/**
			 * temporary object to store new name for a new project
			 * @property	{string} projectName	- the name of the new project
			 */
			newProject: {
				isshow: false,
				loading: true,
				formval: {
					projectName: '',
				}
			},
			/**
			 * temporary object to store information for a new application folder
			 * @property	{string} applicationName	- the name of the new application folder
			 * @property	{string} parentFolder		- the name of the parent folder
			 */
			newApplication: {
				isshow: false,
				loading: true,
				index: null,
				id:null,
				parentId: null,
				applicationName: '',
				parentFolder: ''
			},
			/**
			 * temporary object to store information for a new adaptation folder
			 * @property	{string} adapatationName	- the name of the new adaptation folder
			 * @property	{string} parentFolder	- the name of the parent folder
			 */
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
		/**
		 * get the tree data from local storage
		 * @fires module:store~actions:loadtreedata
		 */
		if(localStorage['Filetree|User1'])
		{
			 let data = JSON.parse(localStorage.getItem('Filetree|User1'));
			 this.$store.dispatch('loadtreedata', data);
		}
		/**
		 * get the activetab from local storage
		 * @fires module:store~actions:updateactivetab
		 */
		if(localStorage['Filetree|activetab'])
		{
			 let data = JSON.parse(localStorage.getItem('Filetree|activetab'));
			 this.$store.dispatch('updateactivetab', data);
		}
		/**
		 * get the model_component_index from local storage
		 * @fires module:store~actions:updatemodelcomponent
		 */
		if(localStorage['Filetree|model_component_index'])
		{
			 let data = JSON.parse(localStorage.getItem('Filetree|model_component_index'));
			 this.$store.dispatch('updatemodelcomponent', data);
		}
		this.$Message.config({
    		top: 100,
    		duration: 2
		});
		/**
		 * open a modal to create a new application folder
		 * @listens module:contextMenu~event:createapplication
		 */
		Bus.$on('createapplication', data => {
			this.newApplication.isshow = true;
			this.newApplication.index = this.getIndexById(data.data.nodeId);
			this.newApplication.applicationName = '';
			this.newApplication.parentFolder = data.data.nodeName;
			this.newApplication.parentId = data.data.nodeId;
		});
		/**
		 * open a modal to create a new adaptation folder
		 * @listens module:contextMenu~event:createadaption
		 */
		Bus.$on('createadaption', data => {
			this.newAdaptation.isshow = true;
			this.newAdaptation.index = this.getIndexById(data.data.nodeId);
			this.newAdaptation.adapatationName = '';
			this.newAdaptation.parentFolder = data.data.nodeName;
			this.newAdaptation.parentId = data.data.nodeId;
		});
		/**
		 * delete the folder and its children, remove this folder from localstorage
		 * @listens module:contextMenu~event:deletedire
		 */
		Bus.$on('deletedire', data => {
			let index = this.getIndexById(data.data.nodeId);
			/**
			 * if the folder is open, close the model component
			 * @fires module:Models~event:setfalsegraph
			 * @fires module:store~actions:updatemodelcomponent
			 */
			if(data.data.open)
			{
				Bus.$emit('setfalsegraph',false);
				this.$store.dispatch('updatemodelcomponent', -1);
				this.$store.dispatch('setopen', index);
			}
			this.$store.dispatch('deletefolder', index);
			localStorage.removeItem(data.data.nodeName);
		});
		/**
		 * delete the project and its children, set the page to 'please select a project'
		 * @listens module:contextMenu~event:deleteproject
		 * @fires	module:store~actions:deleteproject
		 */
		Bus.$on('deleteproject', data => {
			let index = this.getIndexById(data.data.nodeId);
			this.$store.dispatch('deleteproject', index);
			this.$router.push("/models/default/default/default");
		});
		/**
		 * open a modal to change the name
		 * @listens module:contextMenu~event:newname
		 */
		Bus.$on('newname', data => {
			this.newName.isshow = true;
			this.newName.index = this.getIndexById(data.data.nodeId);
			this.newName.formval.changedName = '';
			this.newName.formval.type = data.data.nodeName.split('-')[0];
			this.newName.formval.projectId = data.data.projectId;
		});
	},
    methods:{
		/**
		 * get the index in the tree data array
		 * @param	{number} nodeId	- the id of the current node
		 * @returns	{number} i		- the index of the current node
		 */
		getIndexById(nodeId){
			let data = this.getdata;
			for(let i = 0; i < data.length; i++){
				if(data[i].data.nodeId === nodeId){
					return i;
				}
			}
		},
		/**
		 * when you add a new project, check if there is another opened project
		 * @returns	{boolean} 
		 */
		checkopenproject(){
			let data = this.getdata;
			for(let i = 0; i < data.length; i++)
			{
				if(data[i].data.open && data[i].data.level === 1)
					return true;
			}
			return false;
		},
		/**
		 * create a new project
		 */
		createproject(){
			let data = this.getdata;
			let pro = this.newProject;
			// check the duplicated project name
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
			// check the empty project name
			else if(this.newProject.formval.projectName.length === 0){
				this.newProject.loading = false;
				this.$nextTick(() => {
					this.newProject.loading = true;
					this.$Message.warning('Empty is not allowed!');
				});
			}
			// check the other opened project
			else if(this.checkopenproject()){
				this.newProject.loading = false;
				this.newProject.isshow = false;
				this.$Message.warning('Please close the opened project!');
			}
			/**
			 * create the new project in the tree data
			 * @fires module:store~actions:createproject
			 */
			else {
				this.$store.dispatch('createproject', this.newProject.formval.projectName);
				this.newProject.loading = false;
				this.newProject.isshow = false;
			}
		},
		/**
		 * create a new application folder
		 */
		createApplication(){
			let data = this.getdata;
			if(typeof(this.newApplication.index) === 'undefined'){
				return
			}
			// keep the folder open
			if(!data[this.newApplication.index].data.open){
				this.$refs.cotalogue.expand_menu(this.newApplication.index);
			}

			let app = this.newApplication;
			// check the duplicated application name
			if(typeof (data.find(function(data_diagram){
				return data_diagram.data.nodeName.split('- ')[2] === app.applicationName && data_diagram.data.parentId === app.parentId;
			}))!=='undefined')
			{
				this.newApplication.loading = false;
				this.$nextTick(() => {
					this.newApplication.loading = true;
					this.$Message.warning('Duplicated name!');
				});
			}
			// check the empty application name
			else if(this.newApplication.applicationName.length === 0){
				this.newApplication.loading = false;
				this.$nextTick(() => {
					this.newApplication.loading = true;
					this.$Message.warning('Empty is not allowed!');
				});
			}
			else {
				/**
				 * @deprecated the counter of application folder is not used
				 */
				let index = 0;
				for(let i = 0; i < data.length; i++)
				{
					if(data[i].data.parentId === app.parentId && data[i].data.nodeName.includes('Application'))
						index++;
				}
				this.newApplication.appindex = index + 1;
				/**
				 * add new application folder and close modal
				 * @fires module:store~actions:createapplication
				 */
				this.$store.dispatch('createapplication', this.newApplication);
				this.newApplication.loading = false;
				this.newApplication.isshow = false;
			}
		},
		/**
		 * create a new adaptation folder
		 */
		createAdaptation(){
			let data = this.getdata;
			if(typeof(this.newAdaptation.index) === 'undefined'){
				return
			}
			// if(!data[this.newAdaptation.index].data.open){
			// 	this.$refs.cotalogue.expand_menu(this.newAdaptation.index);
			// }
			let adp = this.newAdaptation;
			// check the duplicated adaptation folder
			if(typeof (data.find(function(data_diagram){
				return data_diagram.data.nodeName.split('- ')[3] === adp.adapatationName && data_diagram.data.parentId == adp.parentId;
			}))!=='undefined')
			{
				this.newAdaptation.loading = false;
				this.$nextTick(() => {
					this.newAdaptation.loading = true;
					this.$Message.warning('Duplicated name!');
				});
			}
			// check the empty adaptation folder
			else if(this.newAdaptation.adapatationName.length === 0)
			{
				this.newAdaptation.loading = false;
				this.$nextTick(() => {
					this.newAdaptation.loading = true;
					this.$Message.warning('Empty is not allowed!');
				});
			}
			else {
				/**
				 * @deprecated the counter of adaptation folder is not used
				 */
				let index = 0;
				for(let i = 0; i < data.length; i++)
				{
					if(data[i].data.parentId === adp.parentId && data[i].data.nodeName.includes('Adaptation'))
						index++;
				}
				this.newApplication.adpindex = index + 1;
				/**
				 * add a new adaptation folder and close modal
				 * @fires module:store~actions:createadaptation
				 */
				this.$store.dispatch('createadaptation', this.newAdaptation);
				this.newAdaptation.loading = false;
				this.newAdaptation.isshow = false;
			}
		},
		// change name
		rename(){
			let data = this.getdata;
			if(typeof(this.newName.index) === 'undefined')
				return
			// modal accepts empty input
			else if(this.newName.formval.changedName.length === 0){
				this.newName.isshow = false;
				this.newName.loading = false;
				this.newName.formval.changedName='';
				this.newName.formval.id=null;
				return;
			}
			let nn = this.newName;
			// put the new name in the format "type" - "project name" - "application name" - "adaptation name"
			if(nn.formval.type === 'Application ')
				nn.formval.changedName = data[nn.index].data.nodeName.split('-')[0] + '-' + data[nn.index].data.nodeName.split('-')[1] + '- ' + nn.formval.changedName;
			else if(nn.formval.type === 'Adaptation ')
				nn.formval.changedName = data[nn.index].data.nodeName.split('-')[0] + '-' + data[nn.index].data.nodeName.split('-')[1] + '-' + data[nn.index].data.nodeName.split('-')[2] + '- ' + nn.formval.changedName;
			// check the duplicated name
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
			else{
				// check localstorage, if exists, replace it
				if(localStorage[data[nn.index].data.nodeName])
				{
					localStorage[nn.formval.changedName] = localStorage[data[nn.index].data.nodeName];
					localStorage.removeItem(data[nn.index].data.nodeName);
				}
				// if type is application, check the localstorage of adapatation and replace them
				if(nn.formval.type === 'Application ')
				{
					for(let i = nn.index + 1; i < data.length; i++)
					{
						if(data[i].data.parentId === data[nn.index].data.nodeId && data[i].data.nodeName.includes('Adaptation') && localStorage[data[i].data.nodeName])
						{
							localStorage['Adaptation -'+ nn.formval.changedName.split('-')[1] + '-' + nn.formval.changedName.split('-')[2] + ' -' + data[i].data.nodeName.split('-')[3]] = localStorage[data[i].data.nodeName];
							localStorage.removeItem(data[i].data.nodeName);
						}
					}
				}
				/**
				 * change name in the tree data and close modal
				 * @fires module:store~actions:changename
				 */
				this.$store.dispatch('changename', this.newName);
				this.newName.isshow = false;
				this.newName.loading = false;
				// change the router path to the new one
				let projectname = '';
				for(let i = 0; i < data.length; i++)
				{
					if(data[i].data.nodeId === data[nn.index].data.projectId)
						projectname = data[i].data.nodeName;
				}
				if(data[this.newName.index].data.open)
					this.$router.push("/models/"+projectname+"/"+nn.formval.changedName.replace(/\s+/g,"")+"/"+this.getactivetab);
			}
		}
	},
	computed: {
		/**
		 * @returns	{string} activetab in the store
		 */
        getactivetab (){
            return this.$store.getters.getactivetab;
		},
		/**
		 * @returns {array} tree data in the store
		 */
        getdata (){
            return this.$store.getters.getdata;
		},
		/**
		 * @returns {number} the index of current folder in the store
		 */
        getmodel_component_index (){
            return this.$store.getters.getmodelcomponentindex;
        }
    },
	watch:{
		// when activetab changes, update localstorage
		getactivetab:{
			handler(val) {
				localStorage.setItem('Filetree|activetab', JSON.stringify(val));
     	 	},
      		deep:true
		},
		// when tree data changes, update localstorage
		getdata:{
			handler(val) {
				localStorage.setItem('Filetree|User1', JSON.stringify(val));
     	 	},
      		deep:true
		},
		// when model_component_index changes, update localstorage
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
