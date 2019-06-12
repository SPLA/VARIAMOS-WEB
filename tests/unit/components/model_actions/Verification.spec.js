import {
    shallowMount,
    createLocalVue
  } from '@vue/test-utils';
  import {
    getters,
  } from "../../../../src/store/filetree";
  import Vuex from 'vuex';
  //import VueRouter from 'vue-router'
  import VueI18n from 'vue-i18n'
  import i18n from '../../../../src/i18n'
  // eslint-disable-next-line no-unused-vars
  import Verification from '../../../../src/components/model_actions/Verification'
  import iView from 'iview';
  import 'iview/dist/styles/iview.css';
  import axios from 'axios'
  // eslint-disable-next-line no-unused-vars
  import flushPromises from 'flush-promises'
  const chai = require("chai");
  const expect = chai.expect;
  const sinon = require("sinon");
  const sinonChai = require("sinon-chai");
  
  chai.use(sinonChai)
  
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(iView)
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

    let setupModalStub = sinon.stub();
    let modalH3Stub = sinon.stub();
    let modalSimpleTextStub = sinon.stub();
  
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
  
    beforeEach(function () {  
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
  
      global.localStorage = new LocalStorageMock;

      routPushStub = sinon.stub();
    })
  
    afterEach(function () {
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
      sinon.stub(axios, 'post').resolves({ data: "Success" });
      global.mxCodec = function() {
        this.encode = sinon.stub()
      }
      global.mxUtils = {
        getXml: sinon.stub()
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