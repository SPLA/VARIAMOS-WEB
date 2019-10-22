/**
 * The stateFactory manufactures a state 
 * object to be inserted in a stubbed
 * Vuex store.
 * In the default 'full' configuration, it starts with a simple
 * project and has the binding_feature_component model selected
 * @param {Boolean} empty Sets whether the state is empty or not.
 * @returns a complete store state
 * @see wrapperFactory
 */
export const stateFactory = (empty, position = 5, open = false, projectName = 'Model1') => {
  let state;
  if (empty) {
    state = {
      data: [],
      activetab: '',
      model_component: '',
      model_component_index: -1,
      xml: ''
    };
  } else {
    if (position <= 0 || position >= 10){
      throw "Incorrect position parameter"
    }
    if(typeof open !== 'boolean'){
      throw "Incorrect type for open parameter"
    }
    let data = []
    let i
    for (i = 0; i < 10; i++){
      data[i] = {
        children: [],
        data: {
          open: position - 1 === i && open,
          isSelected: position - 1 === i ,
          contextmenuIndex: i === 0 
            ? 'project' 
            : i === 6 
            ? 'application_folder' 
            : i === 8 
            ? 'adaptation_folder' 
            : 'empty',
          level: i === 0 //i === 0 (Project)
            ? 1
            : [1,6].includes(i)//i === 1 (Domain) || i === 6 (application)
            ? 2 
            : [2,3,4,5,7,8].includes(i)//i === 2 (feature) || i === 3 (component) || i === 4 (binding) || i === 5 (istar) || i === 7 (app/feature) || i === 8 (adaptation)
            ? 3
            : 4,
          modeltype: [2,7,9].includes(i) //feature
            ? 0
            : [0,1,3,6,8].includes(i) //component && folder ???
            ? 1
            : [4].includes(i) //binding
            ? 2 // istar
            : 3,
          nodeId: i + 1,
          nodeName: i === 0
            ? projectName
            : i === 1
            ? 'Domain - ' + projectName
            : i === 6
            ? 'Application - ' + projectName + ' - 1'
            : i === 8
            ? 'Adaptation - ' + projectName + ' - 1 - 1'
            : i === 3
            ? 'component'
            : [2,7,9].includes(i)
            ? 'feature'
            : i === 4
            ? 'binding_feature_component'
            : 'istar',
          nodeType: [0,1,6,8].includes(i) //folders -> 1, models -> 3
          ? 1
          : 3,
          parentId: i === 0
          ? -1
          : [1,6].includes(i) //domain && app
          ? 1
          : [2,3,4,5].includes(i) //domain models
          ? 2
          : [7,8].includes(i) //application models && adaptation folder
          ? 6 
          : 8,
          projectId: 1,
        },
        numberOfChildren: [0,6].includes(i)
        ? 2 
        : [1].includes(i)
        ? 4
        : [8].includes(i)
        ? 1
        : 0
      }
    }
    if( position !== 1 ){
      if([2,3,4,5,6,7,8,9,10].includes(position)){
        data[0].data.open = true
      }
      if([3,4,5,6].includes(position)){
        data[1].data.open = true
      }
      if([8].includes(position)){
        data[6].data.open = true
      }
      if([10].includes(position)){
        data[8].data.open = true
      }
    }

    state = {
      data: data,
      activetab: [0].includes(position - 1)
      ? ''
      : [1,2,6,7,8,9].includes(position - 1)
      ? 'feature'
      : position - 1 === 3
      ? 'component'
      : position - 1 === 5
      ? 'istar'
      : 'binding_feature_component',
      model_component: [0].includes(position - 1)
      ? ''
      : [1,2,3,4,5].includes(position - 1)
      ? 'Domain - ' + projectName
      : [6,7].includes(position - 1)
      ? 'Application - ' + projectName + ' - 1'
      : [8,9].includes(position - 1)
      ? 'Adaptation - ' + projectName + ' - 1 - 1'
      : '',
      model_component_index: [0].includes(position - 1)
      ? -1
      : [1,2,3,4,5].includes(position - 1)
      ? 1
      : [6,7].includes(position - 1)
      ? 6
      : 8,
      xml: 'TESTXML'
    };

  }
  return state;
}