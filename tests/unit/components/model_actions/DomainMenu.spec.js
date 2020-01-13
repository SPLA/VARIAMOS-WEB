import {
  shallowMount,
  createLocalVue
} from '@vue/test-utils';
import Vuex from 'vuex';
//import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import i18n from '../../../../src/i18n'
// eslint-disable-next-line no-unused-vars
import DomainMenu from '../../../../src/components/model_actions/DomainMenu.vue'
// eslint-disable-next-line no-unused-vars
import flushPromises from 'flush-promises'
import {
  stateFactory
} from '../../util/StateManagement'
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");

chai.use(sinonChai)

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueI18n)

describe('DomainMenu', () => {
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
   * This function stubs the $router.push call within the
   * component.
   */
  let routPushStub

  /**
   * mockDispatch allows one to observe
   * the behaviour of the store.dispatch
   * function.
   */
  let mockDispatch;

  /**
   * mockGraph exists to simulate the behaviour of the
   * mxGraph model.
   */
  let mockGraph;
  
  /**
   * These variables will hold both the stub that replaces
   * getElementbyId() and the object it returns.
   */
  let getElementByIdMock;
  let mockObj;

  /**
   * These variables will contain the stubs that will replace
   * all of the modal functionality.
   */
  let setupModalStub;
  let modalH3Stub;
  let modalInputTextsStub;
  let modalButtonStub;
  
   /**
   * This class allows one to mock localStorage without the
   * need for a browser. Unfortunately the setItem method
   * behaves somewhat stragely but it has been necessary to
   * implement it in this way to solve the issue of the different
   * ways one has to interact with localStorage and that its
   * unique behaviour as part of the browser.
   */
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
    mockGraph = {
      getModel: sinon.stub(),
      removeCellOverlay: sinon.stub(),
    }
    const actions = {

    }
    const filetree = {
      state: stateFactory(empty),
      actions,
      getters: localgetters
    }
    const store = new Vuex.Store({
      modules: {
        filetree
      }
    })
    mockDispatch = sinon.stub(store, 'dispatch')
    /**
     * We use shallowMount to avoid mounting the underlying
     * component structure so as to not overload the required
     * dependecies.
     */
    return shallowMount(DomainMenu, {
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
      propsData: {
        current_graph: mockGraph
      },
      i18n
    })
  }

  beforeEach(() => {
    global.localStorage = new LocalStorageMock;
    mockObj = {
      value: 'TEST',
      style: {
        display: 'TEST'
      }
    }
    getElementByIdMock = sinon.stub().returns(mockObj)
    global.document.getElementById = getElementByIdMock;
    setupModalStub = sinon.stub();
    modalH3Stub = sinon.stub();
    modalInputTextsStub = sinon.stub();
    modalButtonStub = sinon.stub();
    routPushStub = sinon.stub();
  })

  afterEach(() => {
    sinon.restore();
  })

  it('set_params()', () => {
    DomainMenu.__Rewire__('setupModal', setupModalStub)
    DomainMenu.__Rewire__('modalH3', modalH3Stub)
    DomainMenu.__Rewire__('modalInputTexts', modalInputTextsStub)
    DomainMenu.__Rewire__('modalButton', modalButtonStub)
    const emptyState = false;
    const wrapper = wrapperFactory(emptyState);
    wrapper.vm.set_parameters();
    expect(setupModalStub).to.have.been.called
    expect(modalH3Stub).to.have.been.called
    expect(modalInputTextsStub).to.have.been.called
    expect(modalButtonStub).to.have.been.called
    __rewire_reset_all__();
  })

  it('save_parameters()', () => {
    const emptyState = false;
    const wrapper = wrapperFactory(emptyState);
    wrapper.vm.save_parameters();
    expect(global.localStorage["domain_implementation_pool_path"]).to.deep.equal('TEST');
    expect(mockObj.style.display).to.deep.equal('none');
  })

  it('show_file_code()', () => {

  })
})