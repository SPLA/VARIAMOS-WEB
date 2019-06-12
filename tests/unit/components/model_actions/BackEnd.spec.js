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
  import BackEnd from '../../../../src/components/model_actions/BackEnd.vue'
  import iView from 'iview';
  import 'iview/dist/styles/iview.css';
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
  localVue.use(iView)
  localVue.use(VueI18n)
  
  describe('BackEnd', () => {
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

    let setupModalStub = sinon.stub();
    let modalH3Stub = sinon.stub();
    let modalInputTextsStub = sinon.stub();
    let modalButtonStub = sinon.stub();
  
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
      return shallowMount(BackEnd, {
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
  
    it('set_params() - TODO', () => {
      BackEnd.__Rewire__('setupModal', setupModalStub)
      BackEnd.__Rewire__('modalH3', modalH3Stub)
      BackEnd.__Rewire__('modalInputTexts', modalInputTextsStub)
      BackEnd.__Rewire__('modalButton', modalButtonStub)
      const emptyState = false;
      const wrapper = wrapperFactory(emptyState);
      wrapper.vm.set_params()
      expect(setupModalStub).to.have.been.called
      expect(modalH3Stub).to.have.been.called
      expect(modalInputTextsStub).to.have.been.called
      expect(modalButtonStub).to.have.been.called
      __rewire_reset_all__();
    })

    it.skip('save_parameters() - IN PROGRESS', () => {
      const getElementByIdMock = { 
        value: 'BLABLA', 
        style: {
          display: 'BLABLA'
        } 
      }
      Object.defineProperty(document, 'getElementById', {
        value: () => getElementByIdMock,
      });
      const emptyState = false;
      const wrapper = wrapperFactory(emptyState);
      wrapper.vm.save_parameters()
      console.log(JSON.stringify(getElementByIdMock,null,2))
      console.log(JSON.stringify(global.localStorage,null,2))
    })
  })