<template>
  <li class="nav-item dropdown">
    <a
      class="nav-link dropdown-toggle"
      id="navbarDropdown"
      role="button"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      {{ $t("version_control_menu") }}
    </a>
    <div
      id="version-control-menu"
      class="dropdown-menu"
      aria-labelledby="navbarDropdown"
    >
      <a
        data-menudisplay="['feature','component','binding_feature_component']"
        @click="setup_github_credentials()"
        class="dropdown-item"
        >{{ $t("version_control_menu_setup_github_credentials") }}</a
      >
      <a
        data-menudisplay="['feature','component','binding_feature_component']"
        @click="setup_cvs_settings()"
        class="dropdown-item"
        >{{ $t("version_control_menu_setup_settings") }}</a
      >

      <a
        data-menudisplay="['feature','component','binding_feature_component']"
        @click="domain_repository_initialization()"
        class="dropdown-item"
        >{{ $t("version_control_menu_domain_repository_initialization") }}</a
      >

      <a
        data-menudisplay="['feature','component','binding_feature_component']"
        @click="update_domain_repository_open_window()"
        class="dropdown-item"
        >{{ $t("version_control_menu_domain_update_domain_repository") }}</a
      >

       <a
        data-menudisplay="['feature','component','binding_feature_component']"
        @click="tag_domain_repository_open_window()"
        class="dropdown-item"
        >{{ $t("version_control_menu_tag_domain_release") }}</a
      >
<!--
      <a
        data-menudisplay="['feature','component','binding_feature_component']"
        @click="product_repository_initialization()"
        class="dropdown-item"
        >{{ $t("version_control_menu_product_repository_initialization") }}</a
      >
      <a
        data-menudisplay="['feature','component','binding_feature_component']"
        @click="domain_commits()"
        class="dropdown-item"
        >{{ $t("version_control_menu_domain_repository_commit") }}</a
      >

      <a
        data-menudisplay="['feature','component','binding_feature_component']"
        @click="product_commits()"
        class="dropdown-item"
        >{{ $t("version_control_menu_product_repository_commit") }}</a
      >
      <a
        data-menudisplay="['feature','component','binding_feature_component']"
        @click="spread_update()"
        class="dropdown-item"
        >{{ $t("version_control_menu_spread_update") }}</a
      >
      <a
        data-menudisplay="['feature','component','binding_feature_component']"
        @click="export_cvs_settings()"
        class="dropdown-item"
        >{{ $t("version_control_menu_export_configuration") }}</a
      >
      -->
      <component
        :is="dynamicComponent"
        :current_graph="current_graph"
      ></component>
    </div>
  </li>
</template>
<script>
import axios from "axios";
import di_actions from "@/assets/js/models/actions/domain_implementation/di_actions.js";
import "@/assets/js/chart/Chart.min.js";
import {
  setupModal,
  modalH3,
  modalSimpleText,
  modalInputTexts,
  modalInputRadios,
  modalCustomization,
  modalButton,
  downloadFile,
} from "../../assets/js/common/util.js";
import adaptation_state_actions from "@/assets/js/models/actions/domain_implementation/adaptation_state_actions.js";
import { getcontextmenulist, getModelInfo } from "@/assets/js/common/global_info.js";

export default {
  methods: {
    init_cvs_settings() {
      if (localStorage.getItem("cvs_settings") == null) {
        let cvs_settings_json = {
          githubUser: "",
          githubPat: "",
          productLineName: "",
          productLineId: "",
          domainRepositoryPrefix: "",
          domainRepositorySufix: "",
          applicationRepositoryPrefix: "",
          applicationRepositorySufix: "",
          domainRepository: "",
          applicationRepositories: [],
          gitWorkflow: "",
          lastCommintMessage: "",
          modelContent: "",
          modelName: "",
          commitMessagePrefix:"Update",
          commitCounter:0,
          domainTagPrefix: "DV",
          lastDomainTag:"",
          productTagPrefix: "PV",
          lastProductTag:"",
          versionIncrement:""
        };
        localStorage.setItem("cvs_settings", JSON.stringify(cvs_settings_json));
      }
    },
    setup_github_credentials() {
      this.init_cvs_settings();
      let cvs_settings = JSON.parse(localStorage.getItem("cvs_settings"));
      let c_header = modalH3(
        this.$t("version_control_menu_setup_github_credentials")
      );
      // modal body
      let default_vals = [];
      let texts = [
        this.$t("version_control_settings_github_pat"),
        this.$t("version_control_settings_github_login"),
      ];
      let inputs = [
        "version_control_settings_github_pat",
        "version_control_settings_github_login",
      ];
      if (cvs_settings.githubPat) {
        default_vals[0] = [cvs_settings.githubPat];
      } else {
        default_vals[0] = "[GITHUB TOKEN]";
      }
      if (cvs_settings.githubUser) {
        default_vals[1] = [cvs_settings.githubUser];
      } else {
        default_vals[1] = "[GIT USER LOGIN]";
      }

      let c_body = modalInputTexts(texts, inputs, default_vals);
      // modal footer
      let c_footer = modalButton(
        this.$t("modal_save"),
        this.save_github_credentials
      );
      setupModal(c_header, c_body, c_footer);
    },
    save_github_credentials() {
      this.init_cvs_settings();
      let cvs_settings = JSON.parse(localStorage.getItem("cvs_settings"));
      cvs_settings.githubUser = document.getElementById(
        "version_control_settings_github_login"
      ).value;

      cvs_settings.githubPat = document.getElementById(
        "version_control_settings_github_pat"
      ).value;
      localStorage.setItem("cvs_settings", JSON.stringify(cvs_settings));
      document.getElementById("main_modal").style.display = "none";
    },
    setup_cvs_settings() {
      this.init_cvs_settings();
      let cvs_settings = JSON.parse(localStorage.getItem("cvs_settings"));
      let c_header = modalH3(this.$t("version_control_menu_setup_settings"));
      // modal body
      let default_vals = [
        cvs_settings.productLineName,
        cvs_settings.productLineId,
        cvs_settings.domainRepositoryPrefix,
        cvs_settings.domainRepositorySufix,
        cvs_settings.applicationRepositoryPrefix,
        cvs_settings.applicationRepositorySufix,
        cvs_settings.domainRepository,
        cvs_settings.applicationRepositories,
        cvs_settings.gitWorkflow,
      ];

      let texts = [
        this.$t("version_control_settings_product_line_name"),
        this.$t("version_control_settings_product_line_id"),
        this.$t("version_control_settings_domain_repository_prefix"),
        this.$t("version_control_settings_domain_repository_sufix"),
        this.$t("version_control_settings_application_repository_prefix"),
        this.$t("version_control_settings_application_repository_sufix"),
        this.$t("version_control_settings_domain_repository_urls"),
        this.$t("version_control_settings_application_repositories_urls"),
        this.$t("version_control_settings_git_workflow"),
      ];
      let inputs = [
        "version_control_settings_product_line_name",
        "version_control_settings_product_line_id",
        "version_control_settings_domain_repository_prefix",
        "version_control_settings_domain_repository_sufix",
        "version_control_settings_application_repository_prefix",
        "version_control_settings_application_repository_sufix",
        "version_control_settings_domain_repository_urls",
        "version_control_settings_application_repositories_urls",
        "version_control_settings_git_workflow",
      ];
      let c_body = modalInputTexts(texts, inputs, default_vals);
      // modal footer
      let c_footer = modalButton(this.$t("modal_save"), this.save_cvs_settings);
      setupModal(c_header, c_body, c_footer);
    },
    save_cvs_settings() {
      let cvs_settings = JSON.parse(localStorage.getItem("cvs_settings"));
      cvs_settings.productLineName = document.getElementById(
        "version_control_settings_product_line_name"
      ).value;
      cvs_settings.productLineId = document.getElementById(
        "version_control_settings_product_line_id"
      ).value;
      cvs_settings.domainRepositoryPrefix = document.getElementById(
        "version_control_settings_domain_repository_prefix"
      ).value;
      cvs_settings.domainRepositorySufix = document.getElementById(
        "version_control_settings_domain_repository_sufix"
      ).value;
      cvs_settings.applicationRepositoryPrefix = document.getElementById(
        "version_control_settings_application_repository_prefix"
      ).value;
      cvs_settings.applicationRepositorySufix = document.getElementById(
        "version_control_settings_application_repository_sufix"
      ).value;
      cvs_settings.domainRepository = document.getElementById(
        "version_control_settings_domain_repository_urls"
      ).value;
      cvs_settings.applicationRepositories = [
        document.getElementById(
          "version_control_settings_application_repositories_urls"
        ).value,
      ];
      cvs_settings.gitWorkflow = document.getElementById(
        "version_control_settings_git_workflow"
      ).value;
      localStorage.setItem("cvs_settings", JSON.stringify(cvs_settings));
      document.getElementById("main_modal").style.display = "none";
    },
    create_repositories() {
      this.init_cvs_settings();
      //let cvs_settings = JSON.parse(localStorage.getItem("cvs_settings"));
      let cvs_settings = localStorage.getItem("cvs_settings");
      /*
      if(this.validate_cvs_settings()){
        alert(this.$t("version_control_message_validation_success"));
      }else{
        alert(this.$t("version_control_message_validation_error"));
      }*/
      this.errors = [];
      //var encoder = new mxCodec();
      //var result = encoder.encode(this.current_graph.getModel());
      //var xml = mxUtils.getXml(result);
      axios
        .post(
          localStorage["domain_implementation_main_path"] +
            "repository/validate",
          {
            cvs_settings,
          }
        )
        .then((response) => {
          var c_header = modalH3("Test response");
          var c_body = modalSimpleText(response.data);
          setupModal(c_header, c_body);
        })
        .catch((e) => {
          this.errors.push(e);
          var c_header = modalH3(this.$t("modal_error"), "error");
          var c_body = modalSimpleText(
            e + this.$t("model_actions_backend_problem")
          );
          setupModal(c_header, c_body);
        });
    },
    domain_repository_initialization() {
      let cvs_settings = JSON.parse(localStorage.getItem("cvs_settings"));
      cvs_settings.productLineName = document.getElementById(
        "version_control_settings_product_line_name"
      ).value;

      this.errors = [];

      axios
        .post(
          localStorage["domain_implementation_main_path"] +
            "repository/domainrepositoryinitialization",
          {
            cvs_settings,
          }
        )
        .then((response) => {
          if (response.data.indexOf("ERROR") == -1) {
            if (response.data.length > 0) {
              cvs_settings.domainRepository = response.data;
              localStorage.setItem(
                "cvs_settings",
                JSON.stringify(cvs_settings)
              );
            }
          } else {
            var c_header = modalH3(this.$t("modal_error"), "error");
            var c_body = modalSimpleText(
              e + this.$t("model_actions_backend_problem")
            );
            setupModal(c_header, c_body);
            f;
          }

          var c_header = modalH3(
            this.$t("version_control_menu_domain_repository_initialization")
          );
          var c_body = modalSimpleText(cvs_settings.domainRepository);
          setupModal(c_header, c_body);
        })
        .catch((e) => {
          this.errors.push(e);
          var c_header = modalH3(this.$t("modal_error"), "error");
          var c_body = modalSimpleText(
            e + this.$t("model_actions_backend_problem")
          );
          setupModal(c_header, c_body);
        });
    },
    update_domain_repository_open_window() {
      let cvs_settings = JSON.parse(localStorage.getItem("cvs_settings"));
      if(cvs_settings.commitMessagePrefix == undefined)
      {
        cvs_settings.commitMessagePrefix = "Update";
        cvs_settings.commitCounter = 0;
      }
      cvs_settings.commitCounter++;
      localStorage.setItem("cvs_settings",JSON.stringify(cvs_settings));
      let c_header = modalH3(
        this.$t("version_control_menu_domain_update_domain_repository")
      );
      // modal body

      let default_vals = [cvs_settings.commitMessagePrefix + " "
          + cvs_settings.commitCounter];
      let texts = [this.$t("version_control_menu_commit_message")];
      let inputs = ["version_control_menu_commit_message"];
      let c_body = modalInputTexts(texts, inputs, default_vals);
      // modal footer
      let c_footer = modalButton(
        this.$t("modal_save"),
        this.update_domain_repository
      );
      setupModal(c_header, c_body, c_footer);
    },
    update_domain_repository() {
      let cvs_settings = JSON.parse(localStorage.getItem("cvs_settings"));

      cvs_settings.modelContent = localStorage["Domain - " + cvs_settings.productLineName];
      cvs_settings.modelName = "Domain - " + cvs_settings.productLineName + ".xml";
      cvs_settings.lastCommintMessage = document.getElementById(
        "version_control_menu_commit_message"
      ).value;
      this.errors = [];

      axios
        .post(
          localStorage["domain_implementation_main_path"] +
            "repository/domainrepositoryupdate",
          {
            cvs_settings,
          }
        )
        .then((response) => {
          if (response.data.indexOf("ERROR") == -1) {
            var c_header = modalH3(
              this.$t("version_control_menu_domain_update_domain_repository")
            );
            var c_body = modalSimpleText(
              this.$t("version_control_response_message")
            );
            setupModal(c_header, c_body);
          } else {
            var c_header = modalH3(this.$t("modal_error"), "error");
            var c_body = modalSimpleText(
              this.$t("model_actions_backend_problem")
            );
            setupModal(c_header, c_body);
          }

        })
        .catch((e) => {
          this.errors.push(e);
          var c_header = modalH3(this.$t("modal_error"), "error");
          var c_body = modalSimpleText(
            e + this.$t("model_actions_backend_problem")
          );
          setupModal(c_header, c_body);
        });
    },
    tag_domain_repository_open_window() {
      let cvs_settings = JSON.parse(localStorage.getItem("cvs_settings"));
      if(cvs_settings.domainTagPrefix == undefined)
      {
        cvs_settings.domainTagPrefix = "DV";
        cvs_settings.lastDomainTag = cvs_settings.domainTagPrefix + "0.0.0";
      }

      localStorage.setItem("cvs_settings",JSON.stringify(cvs_settings));
      let c_header = modalH3(
        "Last " + this.$t("version_control_menu_tag_domain_release") + ": " + cvs_settings.lastDomainTag
      );
      // modal body
 
      //let default_vals = [cvs_settings.lastDomainTag];
      let default_vals = cvs_settings.lastDomainTag.split(".") ;
      //let texts = [this.$t("version_cocvs_settings.lastDomainTag ntrol_tag_message")];
      let texts = ["MAJOR","MINOR","PATCH"];
      //let inputs = ["version_control_tag_message"];
      let inputs = ["MAJOR","MINOR","PATCH"];
      let c_body = modalInputRadios(texts, inputs, default_vals,cvs_settings.domainTagPrefix);
      // modal footer
      let c_footer = modalButton(
        this.$t("modal_save"),
        this.tag_domain_repository
      );
      setupModal(c_header, c_body, c_footer);
    },
    tag_domain_repository() {
      let cvs_settings = JSON.parse(localStorage.getItem("cvs_settings"));
      /*
      cvs_settings.lastDomainTag = document.getElementsByName(
        cvs_settings.domainTagPrefix
      ).value;
      */
      
      var radios = document.getElementsByName(
        cvs_settings.domainTagPrefix
      );
      var i = 0;
      for(i=0;i<radios.length;i++)
      {
        if(radios.item(i).checked)
        {
          cvs_settings.versionIncrement = radios.item(i).value;
        }
      }

      //alert(cvs_settings.lastDomainTag);
      //return;
      //alert(cvs_settings.versionIncrement);
/*
      alert(document.getElementsByName(
        cvs_settings.domainTagPrefix
      ).item(0).value);
*/
      //return;
/*
     var radios = document.getElementsByName(cvs_settings.domainTagPrefix);
     radios.forEach(e=>{
       if(e.checked)
       {
         cvs_settings.versionIncrement = e.value;
       }
     })
*/
      //cvs_settings.versionIncrement = document.getElementById(
        //cvs_settings.domainTagPrefix).value;
      this.errors = [];

      axios
        .post(
          localStorage["domain_implementation_main_path"] +
            "repository/tagdomainrepository",
          {
            cvs_settings,
          }
        )
        .then((response) => {
          if (response.data.indexOf("ERROR") == -1) {
            cvs_settings.lastDomainTag = response.data;
            localStorage.setItem("cvs_settings",JSON.stringify(cvs_settings));
            var c_header = modalH3(
              this.$t("version_control_menu_tag_domain_release")
            );
            var c_body = modalSimpleText(
              this.$t("version_control_tag_response_message") + ": " + cvs_settings.lastDomainTag
            );
            setupModal(c_header, c_body);
          } else {
            
            var c_header = modalH3(this.$t("modal_error"), "error");
            var c_body = modalSimpleText(
              this.$t("model_actions_backend_problem")
            );
            setupModal(c_header, c_body);
          }

        })
        .catch((e) => {
          this.errors.push(e);
          var c_header = modalH3(this.$t("modal_error"), "error");
          var c_body = modalSimpleText(
            e + this.$t("model_actions_backend_problem")
          );
          setupModal(c_header, c_body);
        });
    },
    //Deprecated domain_commits
    domain_commits() {
      this.$t("version_control_menu_domain_repository_commit");
    },

    product_repository_initialization() {
      let cvs_settings = JSON.parse(localStorage.getItem("cvs_settings"));

      this.errors = [];

      axios
        .post(
          localStorage["domain_implementation_main_path"] +
            "repository/productrepositoryinitialization",
          {
            cvs_settings,
          }
        )
        .then((response) => {
          if (response.data.indexOf("ERROR") == -1) {
            if (response.data.length > 0) {
              cvs_settings.applicationRepositories = [response.data];
              localStorage.setItem(
                "cvs_settings",
                JSON.stringify(cvs_settings)
              );
            }
          } else {
            var c_header = modalH3(this.$t("modal_error"), "error");
            var c_body = modalSimpleText(
              e + this.$t("model_actions_backend_problem")
            );
            setupModal(c_header, c_body);
            f;
          }

          var c_header = modalH3(
            this.$t("version_control_menu_product_repository_initialization")
          );

          var c_body = modalSimpleText(cvs_settings.applicationRepositories[0]);
          setupModal(c_header, c_body);
        })
        .catch((e) => {
          this.errors.push(e);
          var c_header = modalH3(this.$t("modal_error"), "error");
          var c_body = modalSimpleText(
            e + this.$t("model_actions_backend_problem")
          );
          setupModal(c_header, c_body);
        });
    },
    product_commits() {
      alert(this.$t("version_control_menu_product_repository_commit"));
    },
    spread_update() {
      alert(this.$t("version_control_menu_spread_update"));
    },
    export_cvs_settings() {
      alert("Export CVs configuration");
    },
    validate_cvs_settings() {
      let cvs_settings = JSON.parse(localStorage.getItem("cvs_settings"));
      let cvs_validation = false;
      if (cvs_settings.githubUser) {
        cvs_validation = true;
      } else {
        return false;
      }
      if (cvs_settings.githubPat) {
        cvs_validation = true;
      } else {
        return false;
      }
      if (cvs_settings.productLineId) {
        cvs_validation = true;
      } else {
        return false;
      }
      if (cvs_settings.productLineName) {
        cvs_validation = true;
      } else {
        return false;
      }
      if (cvs_settings.domainRepositoryPrefix) {
        cvs_validation = true;
      } else {
        return false;
      }
      if (cvs_settings.domainRepositorySufix) {
        cvs_validation = true;
      } else {
        return false;
      }
      if (cvs_settings.applicationRepositoryPrefix) {
        cvs_validation = true;
      } else {
        return false;
      }
      if (cvs_settings.applicationRepositorySufix) {
        cvs_validation = true;
      } else {
        return false;
      }
      if (cvs_settings.domainRepository) {
        cvs_validation = true;
      } else {
        return false;
      }
      if (cvs_settings.applicationRepositories) {
        cvs_validation = true;
      } else {
        return false;
      }
      return cvs_validation;
    },
    commit_feature_model() {},
  },
};
</script>
<style scoped></style>
