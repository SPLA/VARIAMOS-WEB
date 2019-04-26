<template>
    <span class="vue-contextmenu-listWrapper" :id="'vue-contextmenuName-' + contextMenuData.menuName + data.data.nodeType + data.data.nodeId">
        <li v-for="item in contextMenuData.menulists[data.data.contextmenuIndex]" :key="item.nodeId" class="context-menu-list">
            <button @click.stop="fnHandler(item)">
                <i :class="item.icoName"></i>
                <span>{{item.btnName}}</span>
            </button>
        </li>
    </span>
</template>
<script>
import Bus from '../assets/js/common/bus.js'
export default {
    name: 'contextMenu',
    props: {
        contextMenuData: {
            type: Object,
            default () {
              return {
                menuName: null,
                axios: {
                  x: null,
                  y: null
                },
                menulists: {}
              }
            }
        },
        targetClass: {
            type: String,
            default: ''
        },
        // the element of tree data
        data: {
            type: Object,
            default: {}
        }
  },
    data () {
        return {}
    },
    mounted () {

    },
    watch: {
        // watch the change of the property axios of the object contextMenuData 
        'contextMenuData.axios' (val) {
            var x = val.x;
            var y = val.y;
            var _this = this;
            var menuName = 'vue-contextmenuName-' + _this.contextMenuData.menuName + '' + _this.data.data.nodeType + '' + _this.data.data.nodeId;
                // if the clicked item matches the context menu, the context menu show up
                if(menuName === _this.targetClass){
                    var menu = document.getElementById(menuName);
                    menu.style.display = 'block';
                    menu.style.left = x + 'px';
                    menu.style.top = y + 'px';
                    /**
                     * click the option in the context menu, the context menu closes
                     * @listens medule:contextMenu~event:mouseup
                     */
                    document.addEventListener('mouseup', function () {
                        menu.style.display = 'none'
                    }, false);
            }
        }
    },
    methods: {
        /**
         * click the option in the context menu, send the corresponding event
         * @param {string} item     - the element of the context menu array
         * @fires medule:contextMenu~event:mouseup
         */
        fnHandler (item) {
            Bus.$emit(item.fnHandler,this.data);
        }
    }
}
</script>
<style>
    .vue-contextmenu-listWrapper {
        display: none;
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
        border: 1px solid #d1d1d1;
    }
    .vue-contextmenu-listWrapper .context-menu-list {
        width: 150px;
        height: 32px;
        border-radius: 4px;
        background: #F3F3F3;
        text-decoration: none;
        list-style: none;
    }
    .vue-contextmenu-listWrapper .context-menu-list button {
        cursor: pointer;
        width: 100%;
        height: 100%;
        display: block;
        outline: 0;
        border: 0;
        color: #555;
        background-color: #fff;
    }
    .vue-contextmenu-listWrapper .context-menu-list button i, .vue-contextmenu-listWrapper .context-menu-list button span {
        float: left;
    }
    .vue-contextmenu-listWrapper .context-menu-list button i {
        color: rgb(120, 120, 120);
        padding: 8px 10px;
    }
    .vue-contextmenu-listWrapper .context-menu-list button:hover {
        background:#c4e6ff;
    }
</style>
