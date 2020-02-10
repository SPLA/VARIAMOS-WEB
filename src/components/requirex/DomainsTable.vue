<template>
  <div class="px-2 py-2 position-absolute d-flex">
    <div class="card mt-n3">
      <div class="card-body">
        <h5 class="card-title text-left">{{$t("requirex_admin_tittle")}}</h5>
        <h6
          class="card-subtitle mb-2 text-muted text-left"
        >{{$t("requirex_domain")}} - {{$t("Requirements")}}</h6>
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
              v-for="(domain, index) in requirementsDomain"
              :key="domain.id"
              @click="onSelectedRequitement(domain)"
            >
              <th scope="row">{{index + 1}}</th>
              <td>{{ domain.requirementNumber }}</td>
              <td>{{ domain.name }}</td>
              <td>{{ formatDate(domain.date_at) }}</td>
              <td>
                <button class="btn text-danger" @click="update(domain)">
                  <i class="fas fa-trash"></i>
                </button>
                <button class="btn text-primary" @click="edit">
                  <i class="fa fa-pencil-alt" aria-hidden="true"></i>
                </button>
                <button class="btn text-primary" @click="generatePdf(domain, 1)">
                  <i class="fa fa-file-pdf" aria-hidden="true"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <router-link to="/requirex/domain">{{$t("New")}} {{$t("Requirement")}}</router-link>
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
          <a href="#" class="btn btn-primary">{{$t("requirex_edit")}}</a>
        </div>
        <div class="card-body" v-else>
          <h5 class="card-title">Select a Requirement for actions</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*import jsPDF from "jspdf";
import "jspdf-autotable";*/
import axios from 'axios'; 

export default {
  data() {
    return {
      requirementsDomain: [],
      selectedRequirement: null,
      countDomain: 0
    };
  },
  methods: {
    onSelectedRequitement(requirement) {
      this.selectedRequirement = requirement;
    },
    formatDate(date) {
      if (date) {
        return date;
      }
    },
    update(requirement) {
      requirement.estado = false;

      let uri = localStorage["domain_implementation_main_path"] + `requirex/domains/${requirement.id}`;
      this.axios.delete(uri, requirement).then(() => {
        //Eliminar item de la lista domains
        this.row.listRequirements.splice(
          this.row.listRequirements.indexOf(requirement.id),
          1
        );
      });
    },
    edit() {
      this.$router.push({
        name: "requirexdomainedit",
        params: { id: this.selectedRequirement.id }
      });
    },

    generatePdf(requirement, total) {
      let doc = ""; //new jsPDF();
      let linea = 20;

      //Titulo
      doc.setFontSize(22);
      doc.text(20, linea, "Variamos - RequireX");

      if (total > 0) {
        linea += 20;
        doc.setFontSize(16);
        doc.text(20, linea, this.$t("requirex_domain_tittle") + "s");
        linea += 10;

        let vec = [];
        let item = {
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
      }
    },

    generateConsolidatePdf() {
      let doc = new jsPDF();
      let linea = 20;
      let total = this.requirementsDomain.length;

      //Titulo
      doc.setFontSize(22);
      doc.text(20, linea, "Variamos - RequireX");

      if (total > 0) {
        linea += 20;
        doc.setFontSize(16);
        doc.text(20, linea, this.$t("requirex_domain_tittle") + "s");
        linea += 10;

        let vec = [];
        for (let i = 0; i < this.requirementsDomain.length; i++) {
          let requirement = this.requirementsDomain[i];

          let item = {
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
    }
  },
  mounted() {
    //Cargar lista de requerimientos de dominio
    let uri = localStorage["domain_implementation_main_path"] + "requirex/domains";
    this.axios.get(uri).then(response => {
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].estado) {
          this.requirementsDomain.push(response.data[i]);
        }
      }
      this.requirementsDomain;
      console.log("tamaño : " + this.requirementsDomain.length);
    });
  }
};
</script>

<style lang="" scoped>
</style>