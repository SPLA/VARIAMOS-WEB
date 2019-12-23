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
             <h6 class="card-subtitle mb-2 text-muted">Current Requirements {{requirementsDomain.length}}</h6>
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
            <h6 class="card-subtitle mb-2 text-muted">Current Requirements {{requirementsApplication.length}}</h6>
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
            <h6 class="card-subtitle mb-2 text-muted">Current Requirements {{requirementsAdaptation.length}}</h6>
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
      requirementsDomain: [],
      requirementsAdaptation: [],
      requirementsApplication: [],

      requirementsTableCollection: [
        {
          reqType: this.$t("requirex_domain"),
          amount: 0,
          lastTime: "No Data",
          listRequirements: []
        },
        {
          reqType: this.$t("requirex_application"),
          amount: 0,
          lastTime: "No Data",
          listRequirements: []
        },
        {
          reqType: this.$t("requirex_adaptation"),
          amount: 0,
          lastTime: "No Data",
          listRequirements: []
        }
      ],

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

    onGeneratePdf() {
      var domainCount = this.requirementsTableCollection[0].amount;
      var applicationCount = this.requirementsTableCollection[1].amount;
      var adaptationCount = this.requirementsTableCollection[2].amount;

      var linea = 20;
      var idCount = 1;
      var total = domainCount + applicationCount + adaptationCount;
      var doc = new jsPDF();

      //Titulo
      doc.setFontSize(22);
      doc.text(20, linea, "Variamos - RequireX");

      if (total > 0) {
        linea += 20;

        //Sub titulo
        if (domainCount > 0) {
          doc.setFontSize(16);
          doc.text(20, linea, this.$t("requirex_domain_tittle") + "s");
          linea += 10;

          var vec = [];
          for (var i = 0; i < domainCount; i++) {
            var item = {
              id: this.requirementsTableCollection[0].listRequirements[i]
                .requirementNumber,
              system: this.requirementsTableCollection[0].listRequirements[i]
                .systemName,
              name: this.requirementsTableCollection[0].listRequirements[i]
                .name,
              requirement: this.requirementsTableCollection[0].listRequirements[
                i
              ].msg,
              date: this.requirementsTableCollection[0].lastTime
            };

            vec.push(item);
            idCount++;
          }

          doc.autoTable({
            columns: [
              { header: "Id", dataKey: "id" },
              { header: "Name", dataKey: "name" },
              { header: "Requirement", dataKey: "requirement" },
              { header: "Date", dataKey: "date" }
            ],
            body: vec,
            startY: linea,
            theme: "grid"
          });
          linea += 15;
          linea += domainCount * 15;
        }

        if (applicationCount > 0) {
          doc.setFontSize(16);
          doc.text(20, linea, this.$t("requirex_application_tittle") + "s");
          linea += 10;

          var vec = [];
          for (var i = 0; i < applicationCount; i++) {
            var item = {
              id: this.requirementsTableCollection[1].listRequirements[i]
                .requirementNumber,
              system: this.requirementsTableCollection[1].listRequirements[i]
                .systemName,
              name: this.requirementsTableCollection[1].listRequirements[i]
                .name,
              requirement: this.requirementsTableCollection[1].listRequirements[
                i
              ].msg,
              date: this.requirementsTableCollection[1].lastTime
            };

            vec.push(item);
          }

          doc.autoTable({
            columns: [
              { header: "Id", dataKey: "id" },
              { header: "System", dataKey: "system" },
              { header: "Name", dataKey: "name" },
              { header: "Requirement", dataKey: "requirement" },
              { header: "Date", dataKey: "date" }
            ],
            body: vec,
            startY: linea,
            theme: "grid"
          });

          linea += 15;
          linea += applicationCount * 15;
        }

        //Sub titulo
        if (adaptationCount > 0) {
          doc.setFontSize(16);
          doc.text(20, linea, this.$t("requirex_adaptation_tittle") + "s");
          linea += 10;

          var vec = [];
          for (var i = 0; i < adaptationCount; i++) {
            var item = {
              id: this.requirementsTableCollection[2].listRequirements[i]
                .requirementNumber,
              system: this.requirementsTableCollection[2].listRequirements[i]
                .systemName,
              name: this.requirementsTableCollection[2].listRequirements[i]
                .name,
              requirement: this.requirementsTableCollection[2].listRequirements[
                i
              ].msg,
              date: this.requirementsTableCollection[2].lastTime
            };

            vec.push(item);
            idCount++;
          }

          doc.autoTable({
            columns: [
              { header: "Id", dataKey: "id" },
              { header: "Name", dataKey: "name" },
              { header: "Requirement", dataKey: "requirement" },
              { header: "Date", dataKey: "date" }
            ],
            body: vec,
            startY: linea,
            theme: "grid"
          });
          linea += 15;
          linea += domainCount * 15;
        }
        doc.save("requirement.pdf");
      } else {
        this.$Message.error("There are no requirements to generate!");
      }
    }
  },
  mounted() {
    //Cargar lista de requerimientos de dominio
    let uri = "http://localhost:4000/domains";
    this.axios.get(uri).then(response => {
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].estado) {
          this.requirementsDomain.push(response.data[i]);
        }
      }
      console.log("tamaño : " + this.requirementsDomain.length);
    });

    //Cargar lista de requerimientos de aplicacion
    uri = "http://localhost:4000/applications";
    this.axios.get(uri).then(response => {
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].estado) {
          this.requirementsApplication.push(response.data[i]);
        }
      }
    });

    //Cargar lista de requerimientos de aplicacion
    uri = "http://localhost:4000/adaptations";
    this.axios.get(uri).then(response => {
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].estado) {
          this.requirementsAdaptation.push(response.data[i]);
        }
      }

    });
  },
 
};
</script>