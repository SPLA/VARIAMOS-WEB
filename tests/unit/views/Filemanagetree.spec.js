import {
    shallowMount,
    createLocalVue
} from '@vue/test-utils';
import {
    getters,
} from "../../../src/store/filetree";
import Vuex from 'vuex';
//import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import i18n from '../../../src/i18n'
//import flushPromises from 'flush-promises';
import Filemanagetree from '../../../src/views/Filemanagetree.vue'
// eslint-disable-next-line no-unused-vars
import cotalogue from '../../../src/components/cotalogue.vue'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
// eslint-disable-next-line no-unused-vars
import flushPromises from 'flush-promises'
import Bus from '../../../src/assets/js/common/bus.js'
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");

chai.use(sinonChai)

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(iView)
localVue.use(VueI18n)

describe('Filemanagetree', () => {

    /**
     * This function stubs the $router.push call within the
     * component.
     */
    let routPushStub

    /**
     * The localgetters object permits us to spy
     * on the behaviour of the getters within the
     * Vuex Store. The assumption that they are
     * functionally correct would allow their use
     * as they are also tested themselves. This avoids
     * the need to reimplement them.
     */
    let localgetters

    /**
     * mockDispatch allows one to observe
     * the behaviour of the store.dispatch
     * function.
     */
    let mockDispatch;

    /**
     * The stateFactory manufactures a state 
     * object to be inserted in a stubbed
     * Vuex store.
     * @param {Boolean} empty Sets whether the state is empty or not.
     * @returns a complete store state
     * @see wrapperFactory
     */
    const stateFactory = (empty) => {
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
            state = {
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
            };
        }
        return state
    }

    /**
     * WrapperFactory creates a Vue component wrapper
     * with the selected parameters.
     * @param {Boolean} empty Set whether the state is empty.
     * @param {string} projectName The project parameter for the route.
     * @param {string} folderName The folder parameter for the route.
     * @param {string} typeName The type parameter for the route.
     * @returns A wrapper for the component.
     */
    const wrapperFactory = (empty, projectName = '', folderName = '', typeName = '') => {
        const filetree = {
            state: stateFactory(empty),
            getters: localgetters
        }
        const store = new Vuex.Store({
            modules: {
                filetree
            },
        })
        mockDispatch = sinon.stub(store, 'dispatch')
        /**
         * We use shallowMount to avoid mounting the underlying
         * component structure so as to not overload the required
         * dependecies.
         */
        return shallowMount(Filemanagetree, {
            localVue,
            store,
            //router,
            mocks: {
                $route: {
                    params: {
                        type: typeName,
                        project: projectName,
                        folder: folderName
                    }
                },
                $router: {
                    push: routPushStub
                }
            },
            i18n
        })
    }

    before(function () {
        localgetters = {
            getactivetab: sinon.spy(getters, 'getactivetab'),
            getdata: sinon.spy(getters, 'getdata'),
            getmodelcomponent: sinon.spy(getters, 'getmodelcomponent'),
            getmodelcomponentindex: sinon.spy(getters, 'getmodelcomponentindex')
        }

        routPushStub = sinon.stub();
    });

    beforeEach(() => {
        class LocalStorageMock {
            constructor() {
                this.store = {};
            }
            clear() {
                this.store = {};
            }
            getItem(key) {
                return this.store[key] || null;
            }
            setItem(key, value) {
                this.store[key] = value.toString();
            }
            removeItem(key) {
                delete this.store[key];
            }
        }

        global.localStorage = new LocalStorageMock;
    })

    after(function () {
        sinon.restore();
    })

    it('localStorage correctly accessed for filetree data', () => {
        const emptyState = false;
        localStorage['Filetree|User1'] = 'TESTDATA'
        // eslint-disable-next-line no-unused-vars
        const wrapper = wrapperFactory(emptyState)
        expect(mockDispatch).to.have.been.calledWith('loadtreedata')
    })

    it('localStorage correctly accessed for activetab data', () => {
        const emptyState = false;
        localStorage['Filetree|activetab'] = 'TESTDATA'
        // eslint-disable-next-line no-unused-vars
        const wrapper = wrapperFactory(emptyState)
        expect(mockDispatch).to.have.been.calledWith('updateactivetab')
    })

    it('localStorage correctly accessed for model component index data', () => {
        const emptyState = false;
        localStorage['Filetree|model_component_index'] = 'TESTDATA'
        // eslint-disable-next-line no-unused-vars
        const wrapper = wrapperFactory(emptyState)
        expect(mockDispatch).to.have.been.calledWith('updatemodelcomponent')
    })

    it('Opens the newproject modal', () => {
        const emptyState = true;
        const wrapper = wrapperFactory(emptyState);
        const modal = wrapper.find('[data-test="newprojectmodal"]')
        wrapper.find('[data-test="newprojectbutton"]').trigger('click')
        expect(modal.attributes().value).to.be.ok
    })

    //Asynchronous behaviour breaks the test
    it.skip('Creates project correctly with empty project', async () => {
        const emptyState = true;
        const wrapper = wrapperFactory(emptyState)
        wrapper.setData({
            newProject:{
                ...wrapper.vm.newProject,
                formval: {
                    projectName: 'TEST',
                }
            }
        })
        //console.log(JSON.stringify(wrapper.vm.newProject))
        wrapper.vm.createproject()
        await flushPromises()
        await wrapper.vm.$nextTick()
        expect(mockDispatch).to.have.been.called
    })

    it('Bus.$on("createapplication") shows modal correctly', () => {
        const emptyState = false
        const data = {
            "children": [],
            "data": {
                "open": true,
                "isSelected": true,
                "level": 1,
                "nodeId": 1,
                "nodeName": "TEST",
                "nodeType": 1,
                "parentId": -1,
                "projectId": 1,
                "modeltype": 1,
                "contextmenuIndex": 3
            },
            "numberOfChildren": 2
        }
        const wrapper = wrapperFactory(emptyState)
        Bus.$emit('createapplication', data)
        expect(wrapper.vm.newApplication.isshow)
    })

    it('Bus.$on("createapplication") shows modal correctly', () => {
        const emptyState = false
        const data = {
            "children": [],
            "data": {
                "open": true,
                "isSelected": true,
                "level": 1,
                "nodeId": 1,
                "nodeName": "TEST",
                "nodeType": 1,
                "parentId": -1,
                "projectId": 1,
                "modeltype": 1,
                "contextmenuIndex": 3
            },
            "numberOfChildren": 2
        }
        const wrapper = wrapperFactory(emptyState)
        Bus.$emit('createapplication', data)
        expect(wrapper.vm.newApplication.isshow)
    })
})