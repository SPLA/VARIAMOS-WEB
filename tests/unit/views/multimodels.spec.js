import {
  shallowMount,
  createLocalVue
} from '@vue/test-utils';
import {
  getters
} from "../../../src/store/filetree";
import Vuex from 'vuex';
import MultiModels from '../../../src/views/Multi-models'
import model from '../../../src/views/Models'
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

describe.only('Multi-Models', () => {
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
    routPushStub = sinon.stub()
    /**
     * We use shallowMount to avoid mounting the underlying
     * component structure so as to not overload the required
     * dependecies.
     */
    return shallowMount(MultiModels, {
      localVue,
      store,
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

  before( () => {
    localgetters = {
      getactivetab: sinon.spy(getters, 'getactivetab'),
      getdata: sinon.spy(getters, 'getdata'),
      getmodelcomponent: sinon.spy(getters, 'getmodelcomponent'),
      getmodelcomponentindex: sinon.spy(getters, 'getmodelcomponentindex')
    }
  })

  it('model is shown with complete state', async () => {
    const emptyState = false
    const wrapper = wrapperFactory(emptyState)
    const componentModel = wrapper.find(model)
    await wrapper.vm.$nextTick()
    expect(componentModel.exists()).to.be.ok
  })

  it('model is not shown with empty state', () => {
    const emptyState = true
    const wrapper = wrapperFactory(emptyState)
    const componentModel = wrapper.find(model)
    expect(componentModel.exists()).to.not.be.ok
  })

  it('Message is shown when only selecting project', () => {
    const emptyState = true
    const wrapper = wrapperFactory(emptyState, 'Model1', 'default', 'default')
    const message = wrapper.find('[data-test="nofolder"]')
    expect(message.exists()).to.be.ok
  })

  it('Message is shown when there is no project', () => {
    const emptyState = true
    const wrapper = wrapperFactory(emptyState, 'default', 'default', 'default')
    const message = wrapper.find('[data-test="noproject"]')
    expect(message.exists()).to.be.ok
  })

  it('clickActiveTab() works when clicking on tab', () => {
    const emptyState = false
    const wrapper = wrapperFactory(emptyState, 'Model1', 'Domain-Model1', 'feature')
    const link = wrapper.findAll('#atabs').at(1)
    link.trigger('click')
    expect(routPushStub).to.have.been.called
    expect(mockDispatch).to.have.been.called
  })
})