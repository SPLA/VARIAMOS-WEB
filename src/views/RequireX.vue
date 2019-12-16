<template>
  <div class="container">
    <div class="container bg-dark">
      <nav class="navbar navbar-light bg-dark">
        <p class="h4 text-white">RequireX</p>
      </nav>

      <div class="row px-2 py-2">
        <div class="col-sm-4">          
          <div class="card">
             <h5 class="card-title">Domain Requirement</h5>
            <div class="card-body">This is some text within a card body.</div>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="card">
            <h5 class="card-title">Application Requirement</h5>
            <div class="card-body">This is some text within a card body.</div>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="card">
            <h5 class="card-title">Domain Requirement</h5>
            <div class="card-body">This is some text within a card body.</div>
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
      this.requirementsTableCollection[0].listRequirements = this.requirementsDomain;
      this.requirementsTableCollection[0].amount = this.requirementsDomain.length;
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