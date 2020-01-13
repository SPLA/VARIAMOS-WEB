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
// eslint-disable-next-line no-unused-vars
import cotalogue from '../../../src/components/cotalogue.vue'
// eslint-disable-next-line no-unused-vars
import flushPromises from 'flush-promises'
import Bus from '../../../src/assets/js/common/bus.js'
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

describe('Catalogue', () => {
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
    return shallowMount(cotalogue, {
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

  beforeEach(function () {
    localgetters = {
      getdata: sinon.spy(getters, 'getdata'),
    }

    routPushStub = sinon.stub();
  })

  afterEach(function () {
    sinon.restore();
  })

  it('It displays the correct amount of items (5) for current config', () => {
    const emptyState = false;
    const wrapper = wrapperFactory(emptyState);
    const lis = wrapper.findAll('li')
    expect(lis.length).to.deep.equal(6) 
  })

  it('checkchildnode() works', () => {
    const emptyState = false;
    const wrapper = wrapperFactory(emptyState);
    //given wrapper factory's state is known
    let i
    let res = []
    for(i = 0; i < 10 ; i++){
      res[i] = wrapper.vm.checkchildnode(i)
    }
    const correct = [true,true,true,true,true,true,false,false,false,false]
    expect(res).to.deep.equal(correct)
  })

  it('double clicking name containers calls the right function', () => {
    const emptyState = false;
    const wrapper = wrapperFactory(emptyState);
    const stub = sinon.stub(wrapper.vm, 'dblClick')
    const li = wrapper.findAll('.name-container')
    for(let i = 0; i < 5; i++){
      li.at(i).trigger('dblclick')
    }
    expect(stub.callCount).to.deep.equal(5)
  })

  it('dblClick() works only for project and folder', () => {
    const emptyState = false;
    const wrapper = wrapperFactory(emptyState);
    const stub = sinon.stub(wrapper.vm, 'expand_menu')
    for(let i = 0; i < 5; i++){
      wrapper.vm.dblClick(i)
    }
    expect(stub.callCount).to.deep.equal(2)
  })

  it('Only clicking on the project arrow calls expand_menu()', () => {
    const emptyState = false;
    const wrapper = wrapperFactory(emptyState);
    const stub = sinon.stub(wrapper.vm, 'expand_menu')
    const images = wrapper.findAll('a > i')
    for(let i = 0; i < 5; i++){
      images.at(i).trigger('click')
    }
    expect(stub.callCount).to.deep.equal(1)
    expect(stub.getCall(0).args[0]).to.deep.equal(0);
  })

  //TODO: REMOVE TIMEOUT
  it.skip('expand_menu() - BROKEN - HAS A BREAKING TIMEOUT', () => {
  })

  it('Click anywhere calls the clickme() function', () => {
    const emptyState = false;
    const wrapper = wrapperFactory(emptyState);
    const stub = sinon.stub(wrapper.vm, 'clickme');
    const lis = wrapper.findAll('li');
    for(let i = 0; i < 5; i++){
      lis.at(i).trigger('click');
    }
    expect(stub.callCount).to.deep.equal(5);
  })

  it('clickme() behaves as expected', () => {
    const emptyState = false;
    const wrapper = wrapperFactory(emptyState);
    for(let i = 0; i < 5; i++){
      wrapper.vm.clickme(i)
    }
    expect(mockDispatch.args.filter(element => element[0] === 'setselect').length).to.deep.equal(5)
  })
})