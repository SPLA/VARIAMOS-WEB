<template>
  <div class="container">
    <div class="container bg-dark rounded-bottom">
      <nav class="navbar navbar-light bg-dark">
        <p class="h4 text-white">{{$t("requirex_admin_tittle")}}</p>
      </nav>

      <div class="row px-2 pb-5 mt-2">
        <div class="col-sm-4">
          <div class="card px-1">
            <h5 class="card-title ">{{$t("requirex_domain")}} - {{$t("Requirement")}}</h5>
             <h6 class="card-subtitle mb-2 text-muted">Current Requirements {{countDomain}}</h6>
            <div class="card-body py-0 px-0 ">
              <div>
                <button
                  class="btn btn-link"
                  @click="onRequirementClick($t('requirex_domain'))"
                >{{$t("requirex_generate")}}</button>
                <button
                  class="btn btn-link"
                  @click="onOpenTable($t('requirex_domain'))"
                >{{$t("requirex_get_all")}}</button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-4">
          <div class="card px-1">
            <h5 class="card-title ">{{$t("requirex_application")}} - {{$t("Requirement")}}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Current Requirements {{countApplication}}</h6>
            <div class="card-body py-0 px-0 ">
              <div>
                <button
                  class="btn btn-link"
                  @click="onRequirementClick($t('requirex_application'))"
                >{{$t("requirex_generate")}}</button>
                <button
                  class="btn btn-link"
                  @click="onOpenTable($t('requirex_application'))"
                >{{$t("requirex_get_all")}}</button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="card">
            <h5 class="card-title">{{$t("requirex_adaptation")}} - {{$t("Requirement")}}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Current Requirements {{countAdaptation}}</h6>
            <div class="card-body py-0 px-0 ">
              <div>
                <button
                  class="btn btn-link"
                  @click="onRequirementClick($t('requirex_adaptation'))"
                >{{$t("requirex_generate")}}</button>
                <button
                  class="btn btn-link"
                  @click="onOpenTable($t('requirex_adaptation'))"
                >{{$t("requirex_get_all")}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--Cuerpo del modulo adminstrativo-->
      <div class>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  data() {
    return {
      countDomain: 0,
      countApplication: 0,
      countAdaptation: 0,
      requirementsCount: 0
    };
  },
  methods: {
    onRequirementClick(name) {
      if (name == this.$t("requirex_domain")) {
        this.$router.push("/requirex/domain");
      } else if (name == this.$t("requirex_application")) {
        this.$router.push("/requirex/application");
      } else if (name == this.$t("requirex_adaptation")) {
        this.$router.push("/requirex/adaptation");
      }
    },

    onOpenTable(name) {
      if (name == this.$t("requirex_domain")) {
        this.$router.push("/requirex/domains");
      } else if (name == this.$t("requirex_application")) {
        this.$router.push("/requirex/applications");
      } else if (name == this.$t("requirex_adaptation")) {
        this.$router.push("/requirex/adaptations");
      }
    },

  },
  mounted() {
    alert(localStorage["domain_implementation_main_path"]);
    //Cargar lista de requerimientos de dominio
    let uri = localStorage["domain_implementation_main_path"] + "requirex/domains/bytotal/true";
    this.axios.get(uri).then(response => {
      this.countDomain = response.data;
      console.log("tamaño : " + this.requirementsDomain );
    });

    //Cargar lista de requerimientos de aplicacion
    uri = localStorage["domain_implementation_main_path"] + "requirex/applications/bytotal/true";
    this.axios.get(uri).then(response => {
      this.countApplication = response.data;
    });

    //Cargar lista de requerimientos de aplicacion
    uri = localStorage["domain_implementation_main_path"] + "requirex/adaptations/bytotal/true";
    this.axios.get(uri).then(response => {
      this.countAdaptation = response.data;
    });
  },
 
};
</script>