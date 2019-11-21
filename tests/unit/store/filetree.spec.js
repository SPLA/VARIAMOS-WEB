import {
  getters,
  actions,
  mutations
} from '../../../src/store/filetree';
import {
  stateFactory
} from '../util/StateManagement'
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");

chai.use(sinonChai)

//Only methods with complex computations have tests written for them.
describe('Filetree Store Unit tests', () => {

  describe('Getters', () => {
    it('getNewNodeID', () => {
      const state = {
        "data": [{
          "children": [],
          "data": {
            "open": true,
            "isSelected": false,
            "level": 1,
            "nodeId": 1,
            "nodeName": "Model1",
            "nodeType": 1,
            "parentId": -1,
            "projectId": 1,
            "modeltype": 1,
            "contextmenuIndex": 3
          },
          "numberOfChildren": 2
        }, {
          "children": [],
          "data": {
            "open": true,
            "isSelected": false,
            "level": 2,
            "nodeId": 2,
            "nodeName": "Domain - Model1",
            "nodeType": 1,
            "parentId": 1,
            "projectId": 1,
            "modeltype": 1,
            "contextmenuIndex": 0
          },
          "numberOfChildren": 3
        }, {
          "children": [],
          "data": {
            "open": false,
            "isSelected": false,
            "level": 3,
            "nodeId": 3,
            "nodeName": "feature",
            "nodeType": 3,
            "parentId": 2,
            "projectId": 1,
            "modeltype": 1,
            "contextmenuIndex": 0
          },
          "numberOfChildren": 0
        }, {
          "children": [],
          "data": {
            "open": false,
            "isSelected": false,
            "level": 3,
            "nodeId": 4,
            "nodeName": "component",
            "nodeType": 3,
            "parentId": 2,
            "projectId": 1,
            "modeltype": 2,
            "contextmenuIndex": 0
          },
          "numberOfChildren": 0
        }, {
          "children": [],
          "data": {
            "open": false,
            "isSelected": true,
            "level": 3,
            "nodeId": 5,
            "nodeName": "binding_feature_component",
            "nodeType": 3,
            "parentId": 2,
            "projectId": 1,
            "modeltype": 3,
            "contextmenuIndex": 0
          },
          "numberOfChildren": 0
        }, {
          "children": [],
          "data": {
            "open": false,
            "isSelected": false,
            "level": 2,
            "nodeId": 6,
            "nodeName": "Application - Model1 - 1",
            "nodeType": 1,
            "parentId": 1,
            "projectId": 1,
            "modeltype": 1,
            "contextmenuIndex": 5
          },
          "numberOfChildren": 2
        }, {
          "children": [],
          "data": {
            "open": false,
            "isSelected": false,
            "level": 3,
            "nodeId": 7,
            "nodeName": "feature",
            "nodeType": 3,
            "parentId": 6,
            "projectId": 1,
            "modeltype": 1,
            "contextmenuIndex": 0
          },
          "numberOfChildren": 0
        }, {
          "children": [],
          "data": {
            "open": false,
            "isSelected": false,
            "level": 3,
            "nodeId": 8,
            "nodeName": "Adaptation - Model1 - 1 - 1",
            "nodeType": 1,
            "parentId": 6,
            "projectId": 1,
            "modeltype": 1,
            "contextmenuIndex": 1
          },
          "numberOfChildren": 1
        }, {
          "children": [],
          "data": {
            "open": false,
            "isSelected": false,
            "level": 4,
            "nodeId": 9,
            "nodeName": "feature",
            "nodeType": 3,
            "parentId": 8,
            "projectId": 1,
            "modeltype": 1,
            "contextmenuIndex": 0
          },
          "numberOfChildren": 0
        }],
        "activetab": "binding_feature_component",
        "model_component": "Domain - Model1",
        "model_component_index": 1,
        "xml": "<mxGraphModel>\n  <root>\n    <mxCell id=\"0\"/>\n    <mxCell id=\"feature\" parent=\"0\" visible=\"0\"/>\n    <root label=\"root\" type=\"root\" id=\"1\">\n      <mxCell style=\"\" parent=\"feature\" vertex=\"1\">\n        <mxGeometry x=\"200\" y=\"40\" width=\"100\" height=\"35\" as=\"geometry\"/>\n      </mxCell>\n    </root>\n    <leaf label=\"leaf\" type=\"leaf\" selected=\"false\" id=\"2\">\n      <mxCell style=\"\" parent=\"feature\" vertex=\"1\">\n        <mxGeometry x=\"370\" y=\"160\" width=\"100\" height=\"35\" as=\"geometry\"/>\n      </mxCell>\n    </leaf>\n    <rel_leaf_root type=\"relation\" relType=\"mandatory\" id=\"3\">\n      <mxCell parent=\"feature\" source=\"2\" target=\"1\" edge=\"1\">\n        <mxGeometry relative=\"1\" as=\"geometry\"/>\n      </mxCell>\n    </rel_leaf_root>\n    <mxCell id=\"component\" parent=\"0\" visible=\"0\"/>\n    <component label=\"component\" type=\"component\" id=\"4\">\n      <mxCell style=\"shape=component\" parent=\"component\" vertex=\"1\">\n        <mxGeometry x=\"320\" y=\"80\" width=\"100\" height=\"40\" as=\"geometry\"/>\n      </mxCell>\n    </component>\n    <mxCell id=\"binding_feature_component\" parent=\"0\"/>\n    <leaf label=\"leaf\" type=\"leaf\" selected=\"false\" id=\"clon2\">\n      <mxCell style=\"fillColor=#DCDCDC;\" parent=\"binding_feature_component\" vertex=\"1\">\n        <mxGeometry x=\"390\" y=\"90\" width=\"100\" height=\"35\" as=\"geometry\"/>\n      </mxCell>\n    </leaf>\n    <component label=\"component\" type=\"component\" id=\"clon4\">\n      <mxCell style=\"shape=component;fillColor=#DCDCDC;\" parent=\"binding_feature_component\" vertex=\"1\">\n        <mxGeometry x=\"180\" y=\"90\" width=\"100\" height=\"40\" as=\"geometry\"/>\n      </mxCell>\n    </component>\n    <rel_leaf_component type=\"relation\" id=\"5\">\n      <mxCell parent=\"binding_feature_component\" source=\"clon2\" target=\"clon4\" edge=\"1\">\n        <mxGeometry relative=\"1\" as=\"geometry\"/>\n      </mxCell>\n    </rel_leaf_component>\n  </root>\n</mxGraphModel>\n"
      }
      const result = getters.getnewnodeid(state);
      expect(result).to.deep.equal(10);
    })
  })

  describe('Actions', () => {
    it('updatemodelcomponent index not -1', () => {
      const index = 0
      const commit = sinon.spy()
      actions.updatemodelcomponent({
        commit
      }, index)
      expect(commit).to.have.been.calledOnceWith('setmodelcomponent', index)
    })

    it('updatemodelcomponent index -1', () => {
      const index = -1
      const commit = sinon.spy()
      actions.updatemodelcomponent({
        commit
      }, index)
      expect(commit).to.have.been.calledOnceWith('defaultmodelcomponent')
    })
  })

  describe('Mutations', () => {
    it('deletetree', () => {
      const state = stateFactory(false)
      mutations.deletetree(state, 0)
      expect(state.activetab).to.deep.equal('')
      expect(state.data).to.deep.equal([])
    })

    it('create new project empty state -- PROJECT GENERATION MUST BE UPDATED', () => {
      const state = stateFactory(true)
      const getters = {
        getnewnodeid: 1
      }
      const name = 'Test1'
      mutations.createnewproject(state, {
        name,
        getters
      })
      //console.log(JSON.stringify(state.data,null,2))
      expect(state.data.length).to.deep.equal(10)
    })

    it('create new project non empty state -- PROJECT GENERATION MUST BE UPDATED', () => {
      const state = stateFactory(false)
      const getters = {
        getnewnodeid: 10
      }
      const name = 'Test2'
      mutations.createnewproject(state, {
        name,
        getters
      })
      //console.log(JSON.stringify(state.data,null,2))
      expect(state.data.length).to.deep.equal(20)
    })

    //There is a bug if you change the application name
    it('changenewname', () => {
      const index = 5;
      const newName = "Application - App - 1234"
      const payload = {
        "isshow": true,
        "loading": true,
        "index": index,
        "formval": {
          "changedName": newName,
          "id": null,
          "projectId": 1,
          "type": "Application "
        }
      }
      const state = stateFactory(false)
      mutations.changenewname(state, payload)
      expect(state.data[index].data.nodeName).to.deep.equal(newName)
    })

    it('defaultmodelcomponent', () => {
      const state = stateFactory(true)
      mutations.defaultmodelcomponent(state)
      expect(state.activetab).to.deep.equal('')
      expect(state.model_component).to.deep.equal('')
      expect(state.model_component_index).to.deep.equal(-1)
    })

    it('setitemselect', () => {
      const mutationIndex = 3
      const state = stateFactory(false)
      mutations.setitemselect(state, mutationIndex)
      //Check that only one item is selected.
      const correctSelection = state.data.every((element, index) => {
        if (index !== mutationIndex) {
          return element.data.isSelected === false
        } else {
          return element.data.isSelected === true
        }
      })
      expect(correctSelection).to.deep.equal(true)
    })
  })
})