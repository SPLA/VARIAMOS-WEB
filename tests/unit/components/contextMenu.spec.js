import {
  shallowMount,
  createLocalVue
} from '@vue/test-utils';
import Vuex from 'vuex';
//import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import i18n from '../../../src/i18n'
// eslint-disable-next-line no-unused-vars
import contextMenu from '../../../src/components/contextMenu.vue'
import iView from 'iview';
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
localVue.use(iView)
localVue.use(VueI18n)

describe('ContextMenu', () => {
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
   * localBus will hold a custom instance of the
   * event bus.
   */
  let localBus;

  let mockObj;

  let addEventListenerStub;

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
      }
    })
    mockDispatch = sinon.stub(store, 'dispatch')
    routPushStub = sinon.stub();

    const contextMenuDataMock = {
      menuName: 'menu',
      axios: {
        x: 0,
        y: 0,
      },
      menulists: {}
    }
    const targetClassMock = 'vue-contextmenuName-menu11'
    const dataMock = filetree.state.data[0]
    /**
     * We use shallowMount to avoid mounting the underlying
     * component structure so as to not overload the required
     * dependecies.
     */
    return shallowMount(contextMenu, {
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
        contextMenuData: contextMenuDataMock,
        targetClass: targetClassMock,
        data: dataMock,
      }
    })
  }

  beforeEach(function () {
    mockObj = {
      style: {
        display: 'TEST',
        left: '',
        top: ''
      }
    }
    global.document.getElementById = sinon.stub().returns(mockObj)
    addEventListenerStub = sinon.stub()
    global.document.addEventListener = addEventListenerStub
  })

  afterEach(function () {
    sinon.restore();
  })

  it('watch is triggered when contextMenuData.axios changes', async () => {
    const emptyState = false;
    const wrapper = wrapperFactory(emptyState);
    const contextMenuDataMock2 = {
      menuName: 'menu',
      axios: {
        x: 0,
        y: 0,
      },
      menulists: {}
    }
    wrapper.setProps({contextMenuData: contextMenuDataMock2})
    expect(addEventListenerStub).to.have.been.called
  })
})