const state = {
    data: [],
    activetab: '',
    model_component: '',
    model_component_index: -1,
    xml: ''
}

const getters = {
    getdata: state => {
        return state.data
    },
    getactivetab: state => {
        return state.activetab
    },
    getmodelcomponent: state => {
        return state.model_component
    },
    getmodelcomponentindex: state => {
        return state.model_component_index
    },
    getnewnodeid: state => { //get a new nodeID
        let temp = 0;
        for(let i = 0; i < state.data.length; i++)
            temp = state.data[i].data.nodeId > temp ? state.data[i].data.nodeId : temp;
        return temp + 1;
    },
    getxml: state => {
        return state.xml;
    }
}

const actions = {
    loadtreedata ({commit}, data) {
        commit('updatedata', data);
    },
    createproject ({commit, getters}, name) {
        commit('createnewproject', {name, getters});
    },
    createapplication ({commit, getters}, app) {
        commit('createnewapplication', {app, getters});
    },
    createadaptation ({commit, getters}, adp) {
        commit('createnewadaptation', {adp, getters});
    },
    deletefolder ({commit}, index) {
        commit('deletetree', index);
    },
    deleteproject ({commit}, index) {
        commit('deletetree', index);
    },
    changename ({commit}, nn) {
        commit('changenewname', nn);
    },
    updatemodelcomponent ({commit}, index) {
        if(index === -1)
            commit('defaultmodelcomponent');
        else
            commit('setmodelcomponent',index);
    },
    updateactivetab ({commit}, name) {
        commit('setactivetab', name);
    },
    setopen({commit}, index) {
        commit('setitemopen', index);
    },
    setselect({commit}, index) {
        commit('setitemselect', index);
    },
    updatexml({commit}, xml) {
        commit('updatexml', xml);
    }
}

const mutations = {
    updatexml(state, xml) {
        state.xml = xml;
    },
    updatedata (state, data) {
        state.data = data;
    },
    createnewproject (state, {name, getters}) {
        let temp = getters.getnewnodeid;
		state.data.unshift({
			children: [],
            data: {
                open: false, 
                isSelected: false,
                level:  1,
				nodeId:  temp,
				nodeName: name,
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
				nodeName: "Domain - " + name,
				nodeType: 1,
				parentId: temp,
				projectId: temp,
				modeltype: 1,
				contextmenuIndex: 0
			},
			numberOfChildren: 3
		},{
			children: [],
			data: {
				open: false,
				isSelected: false,
				level: 3,
				nodeId: temp+2,
				nodeName: "feature",
				nodeType: 3,
				parentId: temp+1,
				projectId: temp,
				modeltype: 1,
				contextmenuIndex: 0
			},
			numberOfChildren: 0
		},{
			children: [],
			data: {
				open: false,
				isSelected: false,
				level: 3,
				nodeId: temp+3,
				nodeName: "component",
				nodeType: 3,
				parentId: temp+1,
				projectId: temp,
				modeltype: 2,
				contextmenuIndex: 0
			},
			numberOfChildren: 0
		},{
			children: [],
			data: {
				open: false,
				isSelected: false,
				level: 3,
				nodeId: temp+4,
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
				nodeId: temp+5,
				nodeName: "Application - " + name + " - 1",
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
				nodeId: temp+6,
				nodeName: "feature",
				nodeType: 3,
				parentId: temp+5,
				projectId: temp,
				modeltype: 1,
				contextmenuIndex: 0
			},
			numberOfChildren: 0
		// },{
		// 	children: [],
		// 	data: {
		// 		open: false,
		// 		isSelected: false,
		// 		level: 3,
		// 		nodeId: temp+7,
		// 		nodeName: "component",
		// 		nodeType: 3,
		// 		parentId: temp+5,
		// 		projectId: temp,
		// 		modeltype: 2,
		// 		contextmenuIndex: 0
		// 	},
		// 	numberOfChildren: 0
		// },{
		// 	children: [],
		// 	data: {
		// 		open: false,
		// 		isSelected: false,
		// 		level: 3,
		// 		nodeId: temp+8,
		// 		nodeName: "binding_feature_component",
		// 		nodeType: 3,
		// 		parentId: temp+5,
		// 		projectId: temp,
		// 		modeltype: 3,
		// 		contextmenuIndex: 0
		// 	},
		// 	numberOfChildren: 0
		},{
			children: [],
			data: {
				open: false,
				isSelected: false,
				level: 3,
				nodeId: temp+7,
				nodeName: "Adaptation - " + name + " - 1" + " - 1",
				nodeType: 1,
				parentId: temp+5,
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
				nodeId: temp+8,
				nodeName: "feature",
				nodeType: 3,
				parentId: temp+7,
				projectId: temp,
				modeltype: 1,
				contextmenuIndex: 0
			},
			numberOfChildren: 0
		// },{
		// 	children: [],
		// 	data: {
		// 		open: false,
		// 		isSelected: false,
		// 		level: 4,
		// 		nodeId: temp+11,
		// 		nodeName: "component",
		// 		nodeType: 3,
		// 		parentId: temp+9,
		// 		projectId: temp,
		// 		modeltype: 2,
		// 		contextmenuIndex: 0
		// 	},
		// 	numberOfChildren: 0
		// },{
		// 	children: [],
		// 	data: {
		// 		open: false,
		// 		isSelected: false,
		// 		level: 4,
		// 		nodeId: temp+12,
		// 		nodeName: "binding_feature_component",
		// 		nodeType: 3,
		// 		parentId: temp+9,
		// 		projectId: temp,
		// 		modeltype: 3,
		// 		contextmenuIndex: 0
		// 	},
		// 	numberOfChildren: 0
		});
    },
    createnewapplication (state, {app, getters}) {
        let temp = getters.getnewnodeid;
		let tempindex = 0;
		for(let i = 0; i < state.data.length; i++)
		{
			if(state.data[i].data.projectId === state.data[app.index].data.nodeId)
				tempindex++;
		}
		state.data.splice(app.index + tempindex, 0 , {
			children: [],
			data: {
				open: false,
				isSelected: false,
				level:  state.data[app.index].data.level + 1,
				nodeId:  temp,
				nodeName: "Application - " + app.parentFolder + " - " + app.applicationName,
				nodeType: 1,
				parentId: state.data[app.index].data.nodeId,
				projectId: state.data[app.index].data.nodeId,
				modeltype: state.data[app.index].data.modeltype,
				contextmenuIndex: 5
			},
			numberOfChildren: 2
		},{
			children: [],
			data: {
				open: false,
				isSelected: false,
				level: state.data[app.index].data.level + 2,
				nodeId: temp+1,
				nodeName: "feature",
				nodeType: 3,
				parentId: temp,
				projectId: state.data[app.index].data.nodeId,
				modeltype: 1,
				contextmenuIndex: 0
			},
			numberOfChildren: 0
		// },{
		// 	children: [],
		// 	data: {
		// 		open: false,
		// 		isSelected: false,
		// 		level: state.data[app.index].data.level + 2,
		// 		nodeId: temp+2,
		// 		nodeName: "component",
		// 		nodeType: 3,
		// 		parentId: temp,
		// 		projectId: state.data[app.index].data.nodeId,
		// 		modeltype: 2,
		// 		contextmenuIndex: 0
		// 	},
		// 	numberOfChildren: 0
		// },{
		// 	children: [],
		// 	data: {
		// 		open: false,
		// 		isSelected: false,
		// 		level: state.data[app.index].data.level + 2,
		// 		nodeId: temp+3,
		// 		nodeName: "binding_feature_component",
		// 		nodeType: 3,
		// 		parentId: temp,
		// 		projectId: state.data[app.index].data.nodeId,
		// 		modeltype: 3,
		// 		contextmenuIndex: 0
		// 	},
		// 	numberOfChildren: 0
		});
		state.data.splice(app.index + tempindex + 1, 0 , {
			children: [],
			data: {
			    open: false,
				isSelected: false,
				level:  state.data[app.index].data.level + 2,
				nodeId:  temp+2,
				nodeName: "Adaptation - " + app.parentFolder + " - " + app.applicationName + " - 1",
				nodeType: 1,
				parentId: temp,
				projectId: state.data[app.index].data.nodeId,
				modeltype: state.data[app.index].data.modeltype,
				contextmenuIndex: 1
			},
			numberOfChildren: 1
		},{
		    children: [],
			data: {
				open: false,
				isSelected: false,
				level: state.data[app.index].data.level + 3,
				nodeId: temp+3,
				nodeName: "feature",
				nodeType: 3,
				parentId: temp+2,
				projectId: state.data[app.index].data.nodeId,
				modeltype: 1,
				contextmenuIndex: 0
			},
			numberOfChildren: 0
		// },{
		//     children: [],
		// 	data: {
		// 		open: false,
		// 		isSelected: false,
		// 		level: state.data[app.index].data.level + 3,
		// 		nodeId: temp+6,
		// 		nodeName: "component",
		// 		nodeType: 3,
		// 		parentId: temp+4,
		// 		projectId: state.data[app.index].data.nodeId,
		// 		modeltype: 2,
		// 		contextmenuIndex: 0
		// 	},
		// 	numberOfChildren: 0
		// },{
		//     children: [],
		// 	data: {
		// 		open: false,
		// 		isSelected: false,
		// 		level: state.data[app.index].data.level + 3,
		// 		nodeId: temp+7,
		// 		nodeName: "binding_feature_component",
		// 		nodeType: 3,
		// 		parentId: temp+4,
		// 		projectId: state.data[app.index].data.nodeId,
		// 		modeltype: 3,
		// 		contextmenuIndex: 0
		// 	},
		// 	numberOfChildren: 0
		});
		state.data[app.index].numberOfChildren++;
    },
    createnewadaptation (state, {adp, getters}) {
        let temp = getters.getnewnodeid;
		state.data.splice(adp.index + 1, 0 , {
			children: [],
			data: {
				open: false,
				isSelected: false,
				level: state.data[adp.index].data.level + 1,
				nodeId: temp,
				nodeName: "Adaptation -" + adp.parentFolder.split('-')[1] + "-"+ adp.parentFolder.split('-')[2] + " - " + adp.adapatationName,
				nodeType: 1,
				parentId: state.data[adp.index].data.nodeId,
				projectId: state.data[adp.index].data.projectId,
				modeltype: state.data[adp.index].data.modeltype,
				contextmenuIndex: 1
			},
			numberOfChildren: 1
		},{
		    children: [],
			data: {
				open: false,
				isSelected: false,
				level: state.data[adp.index].data.level + 2,
				nodeId: temp+1,
				nodeName: "feature",
				nodeType: 3,
				parentId: temp,
				projectId: state.data[adp.index].data.projectId,
				modeltype: 1,
				contextmenuIndex: 0
			},
			numberOfChildren: 0
		// },{
		//     children: [],
		// 	data: {
		// 		open: false,
		// 		isSelected: false,
		// 		level: state.data[adp.index].data.level + 2,
		// 		nodeId: temp+2,
		// 		nodeName: "component",
		// 		nodeType: 3,
		// 		parentId: temp,
		// 		projectId: state.data[adp.index].data.projectId,
		// 		modeltype: 2,
		// 		contextmenuIndex: 0
		// 	},
		// 	numberOfChildren: 0
		// },{
		//     children: [],
		// 	data: {
		// 		open: false,
		// 		isSelected: false,
		// 		level: state.data[adp.index].data.level + 2,
		// 		nodeId: temp+3,
		// 		nodeName: "binding_feature_component",
		// 		nodeType: 3,
		// 		parentId: temp,
		// 		projectId: state.data[adp.index].data.projectId,
		// 		modeltype: 3,
		// 		contextmenuIndex: 0
		// 	},
		// 	numberOfChildren: 0
		});
		state.data[adp.index].numberOfChildren++;
    },
    deletetree (state, index) {
        for(let i = index + 1; i < state.data.length; i++)
		{
			if(state.data[i].data.level < state.data[index].data.level || state.data[i].data.level === state.data[index].data.level)
			{
				state.data.splice(index, i - index);
				break;
            }
            if(i === state.data.length-1)
                state.data.splice(index, i - index + 1);	
        }
        state.activetab = '';
    },
    changenewname (state, nn) {
		state.data[nn.index].data.nodeName = nn.formval.changedName;
		if(nn.formval.type === 'Application ')
		{
			for(let i = nn.index + 1; i < state.data.length; i++)
			{
				if(state.data[i].data.parentId === state.data[nn.index].data.nodeId && state.data[i].data.nodeName.includes('Adaptation'))
					state.data[i].data.nodeName = nn.formval.changedName + ' -' + state.data[i].data.nodeName.split('-')[3];
			}
		}
    },
    defaultmodelcomponent (state) {
        state.activetab = '';
        state.model_component = '';
        state.model_component_index = -1;
    },
    setmodelcomponent(state, index) {
        state.model_component = state.data[index].data.nodeName;
        state.model_component_index = index;
    },
    setactivetab(state, name) {
        state.activetab = name;
    },
    setitemopen(state,index) {
        state.data[index].data.open = !state.data[index].data.open;
    },
    setitemselect(state,index) {
        state.data.forEach((item)=>{
            item.data.isSelected = false;
        });
        state.data[index].data.isSelected = true;	
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}