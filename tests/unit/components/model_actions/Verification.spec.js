import {
  shallowMount,
  createLocalVue
} from '@vue/test-utils';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n'
import i18n from '../../../../src/i18n'
import Verification from '../../../../src/components/model_actions/Verification'
import axios from 'axios'
import flushPromises from 'flush-promises'
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");

chai.use(sinonChai)

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueI18n)
  
describe('Verification', () => {
  /**
   * This function stubs the $router.push call within the
   * component.
   */
  let routPushStub;

  /**
   * mockGraph exists to simulate the behaviour of the
   * mxGraph model.
   */
  let mockGraph;

  /**
   * These variables will contain the stubs that will replace
   * all of the modal functionality.
   */
  let setupModalStub;
  let modalH3Stub;
  let modalSimpleTextStub;
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
      this[key] = value.toString();
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
    /**
     * We use shallowMount to avoid mounting the underlying
     * component structure so as to not overload the required
     * dependecies.
     */
    return shallowMount(Verification, {
      localVue,
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

  /**
   * The rationale for using resetting it all before each test is
   * to make sure every instance that appears in the tests is
   * independent from all others.
   */
  beforeEach( () => {  
    global.localStorage = new LocalStorageMock;
    routPushStub = sinon.stub();
    setupModalStub = sinon.stub();
    modalH3Stub = sinon.stub();
    modalSimpleTextStub = sinon.stub();
    modalButtonStub = sinon.stub();
  })

  after(() => {
    sinon.restore();
  })

  it('initialsetup() feature model', () => {
    const emptyState = false;
    const wrapper = wrapperFactory(emptyState, '', '', 'feature');
    expect(wrapper.vm.menu_options).to.not.be.empty
  })

  it('initialsetup() non feature model', () => {
    const emptyState = false;
    const wrapper = wrapperFactory(emptyState, '', '', '');
    expect(wrapper.vm.menu_options).to.be.empty
  })

  it('clear_overlays()', () => {
    const emptyState = false;
    const wrapper = wrapperFactory(emptyState, '', '', 'feature');
    wrapper.vm.cell_errors = Array(5)
    wrapper.vm.clear_overlays()
    expect(mockGraph.removeCellOverlay.callCount).to.deep.equal(5)
  })

  //https://github.com/speedskater/babel-plugin-rewire
  //https://www.dotnetcurry.com/vuejs/1441/vuejs-unit-testing
  it('test()', async () => {
    Verification.__Rewire__('setupModal', setupModalStub)
    Verification.__Rewire__('modalH3', modalH3Stub)
    Verification.__Rewire__('modalSimpleText', modalSimpleTextStub)
    Verification.__Rewire__('modalButton', modalButtonStub)
    sinon.stub(axios, 'post').resolves({ data: "Success" });
    global.mxCodec = function() {
      this.encode = sinon.stub()
    }
    global.mxUtils = {
      getPrettyXml: sinon.stub(),
      getXml: sinon.stub().returns(""),
    }
    global.localStorage.setItem("domain_implementation_main_path", 'XXXX')
    const emptyState = false;
    const wrapper = wrapperFactory(emptyState, '', '', 'feature');
    wrapper.vm.test()
    await flushPromises()
    expect(setupModalStub).to.have.been.called
    expect(modalH3Stub).to.have.been.called
    expect(modalSimpleTextStub).to.have.been.called
    __rewire_reset_all__();
  })
})