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
    if (position <= 0 || position >= 9){
      throw "Incorrect position parameter"
    }
    if(typeof open !== 'boolean'){
      throw "Incorrect type for open parameter"
    }
    let data = []
    let i
    for (i = 0; i < 9; i++){
      data[i] = {
        children: [],
        data: {
          open: position - 1 === i && open,
          isSelected: position - 1 === i ,
          contextmenuIndex: i === 0 
            ? 'project' 
            : i === 5 
            ? 'application_folder' 
            : i === 7 
            ? 'adaptation_folder' 
            : 'empty',
          level: i === 0 
            ? 1
            : [1,5].includes(i)//i === 1 || i === 5
            ? 2 
            : [2,3,4,6,7].includes(i)//i === 2 || i === 3 || i === 4 || i === 6 || i === 7
            ? 3
            : 4,
          modeltype: [0,1,2,5,6,7,8].includes(i)
            ? 1
            : [3].includes(i)
            ? 2
            : 3,
          nodeId: i + 1,
          nodeName: i === 0
            ? projectName
            : i === 1
            ? 'Domain - ' + projectName
            : i === 5
            ? 'Application - ' + projectName + ' - 1'
            : i === 7
            ? 'Adaptation - ' + projectName + ' - 1 - 1'
            : i === 3
            ? 'component'
            : [2,6,8].includes(i)
            ? 'feature'
            : 'binding_feature_component',
          nodeType: [0,1,5,7].includes(i)
          ? 1
          : 3,
          parentId: i === 0
          ? -1
          : [1,5].includes(i)
          ? 1
          : [2,3,4].includes(i)
          ? 2
          : [6,7].includes(i)
          ? 6 
          : 7,
          projectId: 1,
        },
        numberOfChildren: [0,5].includes(i)
        ? 2 
        : [1].includes(i)
        ? 3
        : [7].includes(i)
        ? 1
        : 0
      }
    }
    if( position !== 1 ){
      if([2,3,4,5,6,7,8,9].includes(position)){
        data[0].data.open = true
      }
      if([3,4,5].includes(position)){
        data[1].data.open = true
      }
      if([7].includes(position)){
        data[5].data.open = true
      }
      if([9].includes(position)){
        data[7].data.open = true
      }
    }

    state = {
      data: data,
      activetab: [0].includes(position - 1)
      ? ''
      : [1,2,5,6,7,8].includes(position - 1)
      ? 'feature'
      : position - 1 === 3
      ? 'component'
      : 'binding_feature_component',
      model_component: [0].includes(position - 1)
      ? ''
      : [1,2,3,4].includes(position - 1)
      ? 'Domain - ' + projectName
      : [5,6].includes(position - 1)
      ? 'Application - ' + projectName + ' - 1'
      : [7,8].includes(position - 1)
      ? 'Adaptation - ' + projectName + ' - 1 - 1'
      : '',
      model_component_index: [0].includes(position - 1)
      ? -1
      : [1,2,3,4].includes(position - 1)
      ? 1
      : [5,6].includes(position - 1)
      ? 5
      : 7,
      xml: 'TESTXML'
    };

  }
  return state;
}