<template>
  <div class="container">
    <div class="container bg-dark rounded-bottom">
      <nav class="navbar navbar-light bg-dark">
        <p class="h4 text-white">{{$t("requirex_admin_tittle")}}</p>
      </nav>

      <div class="row px-2 pb-5 mt-2">
        <div class="col-sm-4">
          <div class="card px-1">
            <h5 class="card-title text-left">{{$t("requirex_domain")}} - {{$t("Requirement")}}</h5>
            <div class="card-body py-0 px-0 text-left">
              <div>
                Create New requirement
                <button class="btn btn-link">click here.</button>
              </div>
            </div>
            <p class="card-text text-left">
              <small class="text-muted">current requirements {{requirementsDomain.length}}</small>
            </p>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="card">
            <h5 class="card-title">Application Requirement</h5>
            <div class="card-body py-0 px-0">This is some text within a card body.</div>
            <p class="card-text">
              <small class="text-muted">Last updated 3 mins ago</small>
            </p>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="card">
            <h5 class="card-title">Adaptation Requirement</h5>
            <div class="card-body py-0 px-0">This is some text within a card body.</div>
            <p class="card-text">
              <small class="text-muted">Last updated 3 mins ago</small>
            </p>
          </div>
        </div>
      </div>

      <!--Cuerpo del modulo adminstrativo-->
      <div class="px-2 py-2 position-absolute d-flex">
        <div class="card mt-n3">
          <div class="card-body">
            <h5 class="card-title text-left">{{$t("requirex_admin_tittle")}}</h5>
            <h6
              class="card-subtitle mb-2 text-muted text-left"
            >{{$t("requirex_domain")}} - {{$t("Requirements")}}</h6>
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
                  v-for="(domain, index) in requirementsDomain"
                  :key="domain.id"
                  @click="onSelectedRequitement(domain)"
                >
                  <th scope="row">{{index + 1}}</th>
                  <td>{{ domain.requirementNumber }}</td>
                  <td>{{ domain.name }}</td>
                  <td>17/12/2019</td>
                  <td>
                    <button class="btn text-danger" @click="update(domain)">
                      <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn text-primary">
                      <i class="fa fa-pencil-alt" aria-hidden="true"></i>
                    </button>
                    <button class="btn text-primary">
                      <i class="fa fa-file-pdf" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <a href="#" class="card-link">Card link</a>
            <a href="#" class="card-link">Another link</a>
          </div>
        </div>

        <div class="col-md-5 mt-n3">
          <div class="card">
            <div class="card-body">
              <h5
                class="card-title"
              >{{$t("requirement")}} : {{selectedRequirement.requirementNumber}} {{selectedRequirement.name}}</h5>
              <p class="card-text text-left">{{selectedRequirement.msg}}</p>
              <p class="card-text text-left">
                <small class="text-muted">{{selectedRequirement.systemName}}</small>
              </p>
              <a href="#" class="btn btn-primary">{{}}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--
  <Content :style="{padding: '0 30px'}">
    <Breadcrumb :style="{margin: '3px 0'}">
      <BreadcrumbItem>Variamos</BreadcrumbItem>
      <BreadcrumbItem>RequireX</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <Row :style="{margin: '1em 0'}">
        <Col span="6">
          <Dropdown placement="bottom-start" @on-click="onSelectedRequirement">
            <Button color="#17233d">
              <Icon type="ios-add" size="24" />Create Requirement
              <Icon type="md-arrow-dropdown" />
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem :name="$t('requirex_domain')">{{$t('requirex_domain')}}</DropdownItem>
              <DropdownItem :name="$t('requirex_application')">{{$t('requirex_application')}}</DropdownItem>
              <DropdownItem :name="$t('requirex_adaptation')">{{$t('requirex_adaptation')}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>

      <Row :style="{margin: '2em 0'}">
        <Col span="3">
          <p>Requirements</p>
        </Col>
      </Row>

      <div :style="{margin: '1em 0'}">
        <Table
          :columns="requirementsTable"
          :data="requirementsTableCollection"
          no-data-text="Sin Datos"
        ></Table>
      </div>

      <div class="container text-right">
        <button type="button" class="btn btn-danger" @click="onGeneratePdf">Generarte Pdf</button>
      </div>
    </Card>
  </Content>
  -->
</template>

<script>
/*import application from "../components/requirex/RequireXApplication";
import adaptation from "../components/requirex/RequireXAdaptation";
import domain from "../components/requirex/RequireXDomain";

import expandRow from "../components/requirex/components/TableExpand";
*/
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  components: {
    /*    "app-adaptation": adaptation,
    "app-application": application,
    "app-domain": domain,
    expandRow*/
  },
  data() {
    return {
      requirementsDomain: [],
      requirementsAdaptation: [],
      requirementsApplication: [],
      selectedRequirement: Object,
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
      requirementsTable: [
        {
          type: "expand",
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            });
          }
        },
        {
          title: "Requirement Type",
          key: "reqType"
        },
        {
          title: "Amount",
          key: "amount"
        },
        {
          title: "Last Time",
          key: "lastTime"
        }
      ],
      dialogDomain: false,
      dialogAdaptation: false,
      countDomain: 0,
      countApplication: 0,
      countAdaptation: 0,
      requirementsCount: 0
    };
  },
  methods: {
    onSelectedRequirement(name) {
      //alert(name);
      if (name == this.$t("requirex_domain")) {
        this.$router.push("/requirex/domain");
      } else if (name == this.$t("requirex_application")) {
        this.$router.push("/requirex/application");
      } else if (name == this.$t("requirex_adaptation")) {
        this.$router.push("/requirex/adaptation");
      }
    },

    onSelectedRequitement(requirement) {
      this.selectedRequirement = requirement;
    },

    update(requirement) {
      requirement.estado = false;

      let uri = `http://localhost:4000/domains/delete/${requirement._id}`;
      this.axios.post(uri, requirement).then(() => {
        //Eliminar item de la lista domains
        this.row.listRequirements.splice(
          this.row.listRequirements.indexOf(requirement._id),
          1
        );
      });
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
  created() {
    //Cargar lista de requerimientos de dominio
    let uri = "http://localhost:4000/domains";
    this.axios.get(uri).then(response => {
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].estado) {
          this.requirementsDomain.push(response.data[i]);
        }
      }
      this.requirementsDomain;
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

      //this.requirementsApplication = response.data;
      this.requirementsTableCollection[1].listRequirements = this.requirementsApplication;
      this.requirementsTableCollection[1].amount = this.requirementsApplication.length;
    });

    //Cargar lista de requerimientos de aplicacion
    uri = "http://localhost:4000/adaptations";
    this.axios.get(uri).then(response => {
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].estado) {
          this.requirementsAdaptation.push(response.data[i]);
        }
      }

      this.requirementsTableCollection[2].listRequirements = this.requirementsAdaptation;
      this.requirementsTableCollection[2].amount = this.requirementsAdaptation.length;
    });
  },
  mounted() {
    //Carga desde el local storage
    if (localStorage.lastTimeDomain) {
      this.requirementsTableCollection[0].lastTime =
        localStorage.lastTimeDomain;
    }
    /*---------------------------*/
    if (localStorage.lastTimeApplication) {
      this.requirementsTableCollection[1].lastTime =
        localStorage.lastTimeApplication;
    }
    /*---------------------------*/
    if (localStorage.lastTimeAdaptation) {
      this.requirementsTableCollection[2].lastTime =
        localStorage.lastTimeAdaptation;
    }
  }
};
</script>