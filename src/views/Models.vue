<template>
  <div>
    <div class="card mb-3">
      <div class="card-body">
        <div class="button-header" style="font-size: 13px">
          <nav class="navbar navbar-expand-lg navbar-light bg-light nav_domain">
            <div id="navbarSupportedContent">
              <ul class="navbar-nav navbar-nav2 mr-auto">
                <li class="nav-item">
                  <a class="nav-link nav-text"
                    ><i class="fas fa-chart-area"></i> {{ $t("models_area") }} -
                    {{ $route.params.type }} {{ $t("models_model") }}</a
                  >
                </li>
                <!-- model actions -->
                <BackEnd />
                <VersionControlMenu />
                <Samples />
                <DomainMenu :current_graph="graph" :model_type="modelType" />
                <ApplicationMenu
                  :current_graph="graph"
                  :model_type="modelType"
                />
                <Verification :current_graph="graph" />
              </ul>
            </div>
          </nav>
        </div>

        <div class="button-area">
          <div class="button-unique" id="buttonSAVE"></div>
          <div class="button-unique" id="buttonUNDO"></div>
          <div class="button-unique" id="buttonREDO"></div>
          <div class="button-unique" id="buttonSHOW"></div>
          <div class="button-unique" id="buttonPONE"></div>
          <div class="button-unique" id="buttonDELETE"></div>
          <div class="button-unique" id="buttonRESET"></div>
          <div class="button-unique" id="buttonRESETALL"></div>
          <div class="button-unique" id="buttonEXPORT"></div>
          <div class="button-unique" id="buttonIMPORT" type="file"></div>
          <div class="button-unique" id="buttonXML"></div>
        </div>

        <div class="row main_area">
          <div id="left-draw" class="col-sm-9 left-area">
            <div id="graphContainer" class="model-area"></div>
            <div class="properties-area" style="font-size: 13px">
              <b>{{ $t("models_element_properties") }}</b
              ><br />
              <div id="properties"></div>
            </div>
          </div>

          <div
            id="right-draw"
            class="col-sm-3 right-area"
            style="font-size: 13px"
          >
            <div class="pallete-area">
              <b>{{ $t("models_palette") }}</b
              ><br /><br />
              <div id="tbContainer">
                <!-- <div class="col-6">
                  <selectableItem
                    :name="item.name"
                    :url="item.url"
                    :imgWidth="50"
                    :selected="item.selected"
                  />
                </div> -->
              </div>
            </div>
            <div class="other-area">
              <!--<b>{{ $t("models_navigator") }}</b>-->
              <div class="navi-buttons">
                <div id="buttonZIN"></div>
                <div id="buttonZOUT"></div>
                <div id="buttonZR"></div>
              </div>
              <div id="navigator" class="navigator"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer small text-muted"></div>
    </div>

    <div id="hidden_elements">
      <input
        type="hidden"
        id="model_code"
        @change="persist()"
        v-model="modelCode"
      />
      <input
        type="hidden"
        id="current_type"
        v-bind:value="$route.params.type"
      />
      <input id="file" type="file" class="button_hidden" />
    </div>
  </div>
</template>

<script>
require(`@/assets/js/models/custom/adaptation_hardware/setup_elements.js`);
import main from "@/assets/js/models/model_main.js";
import model_load from "@/assets/js/models/model_load.js";
import Bus from "../assets/js/common/bus.js";
import { getModelInfo } from "../assets/js/common/global_info";
import { setupModal, modalH3, modalSimpleText } from "../assets/js/common/util";

/* import actions */
import DomainMenu from "../components/model_actions/DomainMenu";
import ApplicationMenu from "../components/model_actions/ApplicationMenu";
import Verification from "../components/model_actions/Verification";
import BackEnd from "../components/model_actions/BackEnd";
import VersionControlMenu from "../components/model_actions/VersionControlMenu";
import Samples from "../components/model_actions/Samples";
import selectableItem from "../components/SelectableItem";

export default {
  data: function () {
    return {
      modelCode: "", //stores the model code when saved
      graph: new Object(), //mxGraph object
      toolbar: new Object(), //mxToolbar
      keyHandler: new Object(), //mxKeyHandler
      undoManager: new Object(), //mxUndoManager
      layers: {}, //model layers
      setupFunctions: {},
      models: [], //available models
      currentModel: "",
      mxModel: new Object(), //mxGraphModel
      modelType: "",
      item: {
        name: "Arduino UNO",
        url:
          "https://cdn.pixabay.com/photo/2017/03/23/12/32/arduino-2168193_1280.png",
        imgWidth: 100,
        selected: false,
      },
      secondItem: {
        name: "Arduino MEGA",
        url:
          "https://www.pngkey.com/png/full/207-2079814_bustedtheory-servo-motor-arduino-mega.png",
        imgWidth: 50,
        selected: true,
      },
    };
  },
  components: {
    BackEnd,
    Samples,
    DomainMenu,
    ApplicationMenu,
    Verification,
    VersionControlMenu,
    selectableItem,
  },
  mounted: function () {
    /**
     * set this mxgraph disabled
     * @listens module:Filemanagetree~event:setfalsegraph
     */
    Bus.$on("setfalsegraph", (data) => {
      this.graph.setEnabled(false);
    });
    this.models = getModelInfo()["gmodels"]; //represent the available models
    //preload the saved model if exists
    let temp = this.getmodel_component;
    if (localStorage[temp]) {
      this.modelCode = localStorage[temp];
    }
    this.graph = new mxGraph(document.getElementById("graphContainer"));
    //load saved model into the graph if exists, and return layers
    this.layers = model_load(this.graph, this.models, this.modelCode);
    this.modelType = this.$route.params.type; //based on URL Route

    // display custom menu options for domain-menu
    let domain_childs = document.querySelectorAll("#domain-menu a");
    this.hide_menu_options(domain_childs);
    // display custom menu options for verification-menu
    domain_childs = document.querySelectorAll("#verification-menu a");
    this.hide_menu_options(domain_childs);
    // display custom menu options for application-menu
    domain_childs = document.querySelectorAll("#application-menu a");
    this.hide_menu_options(domain_childs);

    //dynamic load of setup functions
    let all_setups = [
      "setup_relations",
      "setup_buttons",
      "setup_keys",
      "setup_properties",
      "setup_elements",
      "setup_events",
    ];
    for (let i = 0; i < all_setups.length; i++) {
      try {
        //try to load setup functions from custom model folder
        let st_fun = require(`@/assets/js/models/custom/${this.modelType}/${all_setups[i]}.js`);
        this.setupFunctions[all_setups[i]] = st_fun.default;
      } catch (ex) {
        //load setup functions from models folder
        let st_fun = require(`@/assets/js/models/${all_setups[i]}.js`);
        this.setupFunctions[all_setups[i]] = st_fun.default;
      }
    }

    //Import the current model file
    let modelToImport = require("@/assets/js/models/custom/" +
      this.modelType +
      ".js");
    this.currentModel = modelToImport.default;
    this.toolbar = new mxToolbar(document.getElementById("tbContainer"));
    this.keyHandler = new mxKeyHandler(this.graph);
    this.undoManager = new mxUndoManager();
    this.mxModel = this.graph.getModel();

    this.initialize_mx(1);
    //clear undo redo history
    this.undoManager.clear();

    if (localStorage["cache_selected" + temp])
      this.$store.dispatch(
        "updatecacheselected",
        JSON.parse(localStorage["cache_selected" + temp])
      );
  },
  methods: {
    persist() {
      //save model in localstorage
      let temp = this.getmodel_component;
      localStorage[temp] = document.getElementById("model_code").value;
      if (document.getElementById("model_code").value != "") {
        let c_header = modalH3(this.$t("modal_success"), "success");
        let c_body = modalSimpleText(this.$t("models_save_model"));
        setupModal(c_header, c_body);
      }
    },
    initialize_mx(counter) {
      //counter equals 1 load the entire mxGraph
      let graphContainer = document.getElementById("graphContainer");
      main(
        this.graph,
        this.layers,
        this.mxModel,
        this.toolbar,
        this.keyHandler,
        graphContainer,
        this.modelType,
        this.currentModel,
        counter,
        this.setupFunctions,
        this.undoManager,
        this.$route.params,
        this.$store
      );
      let outline = new mxOutline(
        this.graph,
        document.getElementById("navigator")
      );
      this.graph.currentVueInstance = this;
      outline.refresh();
    },
    hide_menu_options(domain_childs) {
      for (let i = 0; i < domain_childs.length; i++) {
        if (domain_childs[i].dataset.menudisplay != null) {
          let listdis = domain_childs[i].dataset.menudisplay;
          if (listdis.includes(this.modelType)) {
            domain_childs[i].style.display = "";
          } else {
            domain_childs[i].style.display = "none";
          }
        }
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    //destroy the window key events before leaving
    this.keyHandler.destroy();
    next();
  },
  computed: {
    /**
     * @returns {string} the current folder name in the store
     */
    getmodel_component() {
      return this.$store.getters.getmodelcomponent;
    },
    /**
     * @returns {array} the selected elements from feature and component models
     */
    getcache_selected() {
      return this.$store.getters.getcacheselected;
    },
  },
  watch: {
    $route(to, from) {
      if (this.$route.name === "Models") {
        //remove the palette content and navigator content when there is a change in the component route
        document.getElementById("tbContainer").innerHTML = "";
        document.getElementById("navigator").innerHTML = "";
        this.modelType = this.$route.params.type;

        // display custom menu options for domain-menu
        let domain_childs = document.querySelectorAll("#domain-menu a");
        this.hide_menu_options(domain_childs);
        // display custom menu options for verification-menu
        domain_childs = document.querySelectorAll("#verification-menu a");
        this.hide_menu_options(domain_childs);
        // display custom menu options for application-menu
        domain_childs = document.querySelectorAll("#application-menu a");
        this.hide_menu_options(domain_childs);

        //dynamic load of setup functions
        let all_setups = [
          "setup_relations",
          "setup_buttons",
          "setup_keys",
          "setup_properties",
          "setup_elements",
          "setup_events",
        ];
        for (let i = 0; i < all_setups.length; i++) {
          try {
            //try to load setup functions from custom model folder
            let st_fun = require(`@/assets/js/models/custom/${this.modelType}/${all_setups[i]}.js`);
            this.setupFunctions[all_setups[i]] = st_fun.default;
          } catch (ex) {
            //load setup functions from models folder
            let st_fun = require(`@/assets/js/models/${all_setups[i]}.js`);
            this.setupFunctions[all_setups[i]] = st_fun.default;
          }
        }
        //Import only the current need model file
        let modelToImport = require("@/assets/js/models/custom/" +
          this.modelType +
          ".js");
        this.currentModel = modelToImport.default;
        this.undoManager = new mxUndoManager();
        this.initialize_mx(2);
        //clear undo redo history
        this.undoManager.clear();
      }
    },
    // when the selected elements cache is changed, update localstorage
    getcache_selected: {
      handler(val) {
        localStorage.setItem(
          "cache_selected" + this.getmodel_component,
          JSON.stringify(val)
        );
      },
      deep: true,
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media (max-width: 992px) {
  .right-area,
  .left-area {
    flex: 100%;
    max-width: 100%;
  }
  .right-area {
    border-left: 0px !important;
  }
}

.button-header {
  border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
  border-bottom: 2px solid rgba(0, 0, 0, 0.125);
}

.nav_domain {
  padding: 2px;
}

.nav-text {
  color: rgba(0, 0, 0, 0.7) !important;
}

.button-unique {
  display: -webkit-box;
  float: left;
}

.button_hidden {
  visibility: hidden;
}

.main_area {
  margin-right: 0px;
  margin-left: 0px;
  margin-top: -6px;
}

.left-area {
  padding-right: 0px;
  padding-left: 0px;
}

.right-area {
  padding-right: 0px;
  padding-left: 0px;
  border-top: 1px solid rgba(0, 0, 0, 0.125);
  border-left: 1px solid rgba(0, 0, 0, 0.125);
}

.navigator {
  border: 2px solid rgba(0, 0, 0, 0.125);
  margin-top: 5px;
}

.button-area {
  display: inline-block;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  width: 100%;
}

.card-header {
  text-align: left;
}

.card-body {
  padding: 0px;
  background-color: white;
}

.properties-area,
.other-area {
  border-top: 1px solid rgba(0, 0, 0, 0.125);
  padding: 15px;
}

.model-area {
  overflow-block: scroll;
  overflow-x: auto;
  overflow-y: auto;
  height: 55vh;
  background: url("../assets/images/grid.gif");
  cursor: default;
  padding-right: 0px;
  padding-left: 0px;
}

.pallete-area {
  padding: 15px;
}

.pad20 {
  padding-top: 20px;
}

table {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
}

.properties-table td {
  padding: 5px;
}
</style>

<style>
#tbContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.pallete-div {
  display: block;
  max-width: 70px;
  margin: 3px;
}

.pallete-div span {
  font-size: 12px;
}

.nav-item a {
  cursor: pointer;
}

.navi-buttons {
  display: flex;
  margin: 0 auto;
  justify-content: flex-end;
}

.navi-buttons button {
  border: 1px solid #ccc;
  padding: 2px;
  padding-left: 7px;
  padding-right: 7px;
  width: 25px;
  margin-right: 2px;
}
</style>