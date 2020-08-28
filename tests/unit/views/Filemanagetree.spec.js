import {
  shallowMount,
  createLocalVue
} from '@vue/test-utils';
import {
  getters,
} from "../../../src/store/filetree";
import Vuex from 'vuex';
import VueI18n from 'vue-i18n'
import i18n from '../../../src/i18n'
import Filemanagetree from '../../../src/views/Filemanagetree.vue'
import cotalogue from '../../../src/components/cotalogue.vue'
import Vue from 'vue'
import {
  stateFactory
} from '../util/StateManagement'
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");

chai.use(sinonChai)

const localVue = createLocalVue()
localVue.use(Vuex)
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
   * localBus will hold a custom instance of the
   * event bus.
   */
  let localBus;

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
      this[key] = value
    }
    removeItem(key) {
      delete this.store[key];
    }
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
        },
      },
      stubs: {
        'cotalogue': cotalogue
      },
      i18n
    })
  }

  /**
   * The rationale for using resetting it all before each test is
   * to make sure every instance that appears in the tests is
   * independent from all others.
   */
  beforeEach(() => {
    global.localStorage = new LocalStorageMock;

    localgetters = {
      getactivetab: sinon.spy(getters, 'getactivetab'),
      getdata: sinon.spy(getters, 'getdata'),
      getmodelcomponent: sinon.spy(getters, 'getmodelcomponent'),
      getmodelcomponentindex: sinon.spy(getters, 'getmodelcomponentindex')
    }

    localBus = new Vue();

    routPushStub = sinon.stub();
  })

  afterEach(function () {
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
  it('createproject() Creates project correctly with empty project', () => {
    const emptyState = true;
    const wrapper = wrapperFactory(emptyState)
    wrapper.setData({
      newProject: {
        ...wrapper.vm.newProject,
        formval: {
          projectName: 'TEST',
        }
      }
    })
    wrapper.vm.createproject()
    expect(mockDispatch).to.have.been.calledWith('createproject', 'TEST')
  })

  it('createApplication() Creates a new application folder in non-empty project', () => {
    Filemanagetree.__Rewire__('Bus', localBus)
    const emptyState = false;
    const wrapper = wrapperFactory(emptyState)
    const data = wrapper.vm.getdata[0]
    localBus.$emit('createapplication', data)
    wrapper.setData({
      newApplication: {
        ...wrapper.vm.newApplication,
        applicationName: 'TEST',
      }
    })
    wrapper.vm.createApplication()
    expect(mockDispatch).to.have.been.calledWith('createapplication')
    expect(mockDispatch.getCall(0).args[1].applicationName).to.deep.equal('TEST')
    __rewire_reset_all__();
  })

  it('Bus.$on("createapplication") shows modal correctly', () => {
    Filemanagetree.__Rewire__('Bus', localBus)
    const emptyState = false
    const wrapper = wrapperFactory(emptyState)
    const data = wrapper.vm.getdata[0]
    localBus.$emit('createapplication', data)
    expect(wrapper.vm.newApplication.isshow).to.be.ok
    __rewire_reset_all__();
  })

  it('Bus.$on("createadaption")(sic) shows modal correctly', () => {
    Filemanagetree.__Rewire__('Bus', localBus)
    const emptyState = false
    const wrapper = wrapperFactory(emptyState)
    const data = wrapper.vm.getdata[5]
    localBus.$emit('createadaption', data)
    expect(wrapper.vm.newAdaptation.isshow).to.be.ok
    __rewire_reset_all__();
  })

  it('Bus.$on("cloneadaption")(sic) shows modal correctly', () => {
    Filemanagetree.__Rewire__('Bus', localBus)
    const emptyState = false
    const wrapper = wrapperFactory(emptyState)
    const data = wrapper.vm.getdata[5]
    localBus.$emit('cloneadaption', data)
    expect(wrapper.vm.newAdaptation.isshow).to.be.ok
    __rewire_reset_all__();
  })

  it('Bus.$on("deletedire") deletes the folder', () => {
    Filemanagetree.__Rewire__('Bus', localBus)
    const emptyState = false
    const wrapper = wrapperFactory(emptyState)
    const data = wrapper.vm.getdata[5]
    localBus.$emit('deletedire', data)
    expect(mockDispatch).to.have.been.called
    __rewire_reset_all__();
  })

  it('Bus.$on("deleteproject") deletes the folder', () => {
    Filemanagetree.__Rewire__('Bus', localBus)
    const emptyState = false
    const wrapper = wrapperFactory(emptyState)
    const data = wrapper.vm.getdata[0]
    localBus.$emit('deleteproject', data)
    expect(mockDispatch).to.have.been.called
    expect(routPushStub).to.have.been.called
    __rewire_reset_all__();
  })

  it('Bus.$on("newname") creates the modal', () => {
    Filemanagetree.__Rewire__('Bus', localBus)
    const emptyState = false
    const wrapper = wrapperFactory(emptyState)
    const data = wrapper.vm.getdata[5]
    localBus.$emit('newname', data)
    expect(wrapper.vm.newName.isshow).to.be.ok
    __rewire_reset_all__();
  })
})