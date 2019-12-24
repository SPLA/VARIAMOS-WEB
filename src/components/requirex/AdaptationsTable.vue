<template>
  <div class="px-2 py-2 position-absolute d-flex">
    <div class="card mt-n3">
      <div class="card-body">
        <h5 class="card-title text-left">{{$t("requirex_admin_tittle")}}</h5>
        <h6
          class="card-subtitle mb-2 text-muted text-left"
        >{{$t("requirex_adaptation")}} - {{$t("Requirements")}}</h6>
        <div class="text-left">
          <button class="card-text btn btn-link text-left" @click="generateConsolidatePdf">
            {{$t("requirex_generate_pdf")}}
            <span class="text-danger">
              <i class="fa fa-file-pdf" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <table class="table table-sm table-hover">
          <thead class="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Number</th>
              <th scope="col">Name</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(adaptation, index) in requirementsAdaptation"
              :key="adaptation.id"
              @click="onSelectedRequitement(adaptation)"
            >
              <th scope="row">{{index + 1}}</th>
              <td>{{ adaptation.requirementNumber }}</td>
              <td>{{ adaptation.name }}</td>
              <td>{{ formatDate(adaptation.date_at) }}</td>
              <td>
                <button class="btn text-danger" @click="update(adaptation)">
                  <i class="fas fa-trash"></i>
                </button>
                <button class="btn text-primary" @click="edit">
                  <i class="fa fa-pencil-alt" aria-hidden="true"></i>
                </button>
                <button class="btn text-primary" @click="generatePdf(adaptation)">
                  <i class="fa fa-file-pdf" aria-hidden="true"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <router-link to="/requirex/adaptation">{{$t("New")}} {{$t("Requirement")}}</router-link>
      </div>
    </div>

    <div class="col-md-5 mt-n3">
      <div class="card">
        <div class="card-body" v-if="selectedRequirement">
          <h5
            class="card-title"
          >{{$t("requirement")}} : {{selectedRequirement.requirementNumber}} {{selectedRequirement.name}}</h5>
          <p class="card-text text-left">{{selectedRequirement.msg}}</p>
          <p class="card-text text-left">
            <small class="text-muted">{{selectedRequirement.systemName}}</small>
          </p>
          <button class="btn btn-link" @click="edit">{{$t("requirex_edit")}}</button>
        </div>
        <div class="card-body" v-else>
          <h5 class="card-title">Select a Requirement for actions</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  data() {
    return {
      requirementsAdaptation: [],
      selectedRequirement: null,
      countadAptation: 0
    };
  },
  methods: {
    onSelectedRequitement(requirement) {
      this.selectedRequirement = requirement;
    },
    update(requirement) {
      requirement.estado = false;

      let uri = `http://localhost:4000/adaptations/delete/${requirement._id}`;
      this.axios.post(uri, requirement).then(() => {
        //Eliminar item de la lista applications
        this.row.listRequirements.splice(
          this.row.listRequirements.indexOf(requirement._id),
          1
        );
      });
    },
    edit() {
      this.$router.push({
        name: "requirexadaptationedit",
        params: { id: this.selectedRequirement._id }
      });
    },
    formatDate(date) {
      if (date) {
        return moment(String(date)).format("DD/MM/YYYY");
      }
    },
    generatePdf(requirement) {
      var doc = new jsPDF();
      var linea = 20;

      //Titulo
      doc.setFontSize(22);
      doc.text(20, linea, "Variamos - RequireX");
      linea += 20;

      doc.setFontSize(16);
      doc.text(20, linea, this.$t("requirex_adaptation_tittle") + "s");
      linea += 10;

      var vec = [];
      var item = {
        id: requirement.requirementNumber,
        system: requirement.systemName,
        name: requirement.name,
        requirement: requirement.msg,
        date: this.formatDate(requirement.date_at)
      };
      vec.push(item);

      //Tabla
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

      doc.save("requirement.pdf");
    },
    generateConsolidatePdf(){
      var doc = new jsPDF();
      var linea = 20;
      var total = this.requirementsAdaptation.length;

      //Titulo
      doc.setFontSize(22);
      doc.text(20, linea, "Variamos - RequireX");
      linea += 20;
      
      doc.setFontSize(16);
      doc.text(20, linea, this.$t("requirex_adaptation_tittle") + "s");
      linea += 10;

      var vec = [];
       for (var i = 0; i < this.requirementsAdaptation.length; i++) {
          var requirement = this.requirementsAdaptation[i];
          var item = {
            id: requirement.requirementNumber,
            system: requirement.systemName,
            name: requirement.name,
            requirement: requirement.msg,
            date: this.formatDate(requirement.date_at)
          };
          vec.push(item);
        }
        //Tabla
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

        doc.save("requirement.pdf");
    }
  },
  mounted() {
    //Cargar lista de requerimientos de aplicacion
    let uri = "http://localhost:4000/adaptations";
    this.axios.get(uri).then(response => {
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].estado) {
          this.requirementsAdaptation.push(response.data[i]);
        }
      }
    });
  }
};
</script>

<style lang="" scoped>
</style>