<template>
  <div class="px-2 py-2 position-absolute d-flex">
    <div class="card mt-n3">
      <div class="card-body">
        <h5 class="card-title text-left">{{$t("requirex_admin_tittle")}}</h5>
        <h6
          class="card-subtitle mb-2 text-muted text-left"
        >{{$t("requirex_application")}} - {{$t("Requirements")}}</h6>
        <p
          class="card-text"
        >Some quick example text to build on the card title and make up the bulk of the card's content.</p>
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
              v-for="(application, index) in requirementsApplication"
              :key="application.id"
              @click="onSelectedRequitement(application)"
            >
              <th scope="row">{{index + 1}}</th>
              <td>{{ application.requirementNumber }}</td>
              <td>{{ application.name }}</td>
              <td>{{  formatDate(application.date_at) }}</td>
              <td>
                <button class="btn text-danger" @click="update(application)">
                  <i class="fas fa-trash"></i>
                </button>
                <button class="btn text-primary" @click="edit">
                  <i class="fa fa-pencil-alt" aria-hidden="true"></i>
                </button>
                <button class="btn text-primary">
                  <i class="fa fa-file-pdf" aria-hidden="true"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <router-link to="/requirex/application">{{$t("New")}} {{$t("Requirement")}}</router-link>
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

export default {
  data() {
    return {
      requirementsApplication: [],
      selectedRequirement: null,
      countApplication: 0
    };
  },
  methods: {
    onSelectedRequitement(requirement) {
      this.selectedRequirement = requirement;
    },
    formatDate(date) {
      if (date) {
        return moment(String(date)).format("DD/MM/YYYY");
      }
    },
    update(requirement) {
      requirement.estado = false;

      let uri = `http://localhost:4000/applications/delete/${requirement._id}`;
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
        name: "requirexapplicationedit",
        params: { id: this.selectedRequirement._id }
      });
    }
  },
  mounted() {
    //Cargar lista de requerimientos de aplicacion
    let uri = "http://localhost:4000/applications";
    this.axios.get(uri).then(response => {
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].estado) {
          this.requirementsApplication.push(response.data[i]);
        }
      }
    });
  }
};
</script>

<style lang="" scoped>
</style>