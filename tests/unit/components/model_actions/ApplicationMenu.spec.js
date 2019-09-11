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
import ApplicationMenu from '../../../../src/components/model_actions/ApplicationMenu.vue'
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

describe.skip('ApplicationMenu - NOT DONE', () => {
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
    return shallowMount(Verification, {
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
    })
  }

  before(() => {
    localgetters = {
      getdata: sinon.spy(getters, 'getdata'),
    }
  })

  beforeEach(function () {
    routPushStub = sinon.stub();
  })

  after(() => {
    sinon.restore();
  })

  //TODO: TEST WITH BACKEND
})