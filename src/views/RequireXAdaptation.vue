<template>
  <div>
    <div id="adaptationMessage" class="alert alert-danger" role="alert" style="display: none">
      <span></span>
    </div>

    <div class="container text-left">
      <button class="btn" @click="onGoBack">
        <i class="fa fa-arrow-left"></i>
        <small class="mx-2">{{ $t("requirex_go_back") }}</small>
      </button>
    </div>

    <div class="my-3">
      <h2>{{$t("requirex_adaptation_tittle")}}</h2>
    </div>

    <div class="container my-2 form-requirement">
      <form id="adaptationForm" ref="requirement">
        <div class="row">
          ´
          <label for="reqType">
            <font size="3" color="red">*</font>
            {{$t('requirex_requirement_type_label')}}
          </label>

          <select id="reqType" v-model="requirement.reqType" class="form-control">
            <option
              :value="$t('requirex_requirement_type_value_1')"
            >{{ $t('requirex_requirement_type1')}}</option>
            <option
              :value="$t('requirex_requirement_type_value_2')"
            >{{ $t('requirex_requirement_type2')}}</option>
            <option
              :value="$t('requirex_requirement_type_value_3')"
            >{{ $t('requirex_requirement_type3')}}</option>
          </select>
        </div>

        <div class="row my-2">
          <div class="col">
            <label>
              <font size="3" color="red">*</font>
              {{$t('requirex_requirement_system_domain_name_label')}}
            </label>
            <input
              id="systemName"
              v-model="requirement.systemName"
              class="form-control"
              :placeholder="$t('requirex_requirement_system_domain_name_label')"
            />
          </div>
          <div class="col">
            <label>
              <font size="3" color="red">*</font>
              {{$t('requirex_requirement_name_label')}}
            </label>
            <input
              id="name"
              v-model="requirement.name"
              class="form-control"
              :placeholder="$t('requirex_requirement_name_label')"
            />
          </div>
        </div>

        <div class="row my-2">
          <div class="col">
            <div class="custom-control custom-switch">
              <input
                type="checkbox"
                class="custom-control-input"
                id="condition"
                v-model="requirement.condition"
                value="false"
                @click="onConditionCheck"
              />
              <label
                class="custom-control-label"
                for="condition"
              >{{$t('requirex_requirement_condition_label')}}</label>
            </div>
          </div>
          <div id="conditionDescriptionContainer" class="col" style="display: none">
            <textarea
              id="conditionDescription"
              v-model="requirement.conditionDescription"
              class="form-control"
              type="textarea"
              :autosize="{minRows: 2,maxRows: 5}"
              :placeholder="$t('requirex_requirement_condition_descrive_label')"
            />
          </div>
        </div>

        <div class="row">
          <label>
            <font size="3" color="red">*</font>
            {{ $t('requirex_requirement_imperative_label') }}
          </label>
          <select id="imperative" v-model="requirement.imperative" class="form-control">
            <option
              :value="$t('requirex_requirement_imperative_value_1')"
            >{{ $t('requirex_requirement_imperative1') }}</option>
            <option
              :value="$t('requirex_requirement_imperative_value_2')"
            >{{ $t('requirex_requirement_imperative2')}}</option>
            <option
              :value="$t('requirex_requirement_imperative_value_3')"
            >{{ $t('requirex_requirement_imperative3')}}</option>
          </select>
        </div>

        <div class="row">
          <div class="col">
            <label>
              <font size="3" color="red">*</font>
              {{ $t('requirex_requirement_process_verb_label') }}
            </label>
            <input
              id="processVerb"
              v-model="requirement.processVerb"
              class="form-control"
              :placeholder="$t('requirex_requirement_process_verb_label')"
            />
          </div>
          <div
            class="col"
            v-if="requirement.relaxing != $t('requirex_requirement_relax_many') && requirement.relaxing != $t('requirex_requirement_relax_few')"
          >
            <label>
              <font size="3" color="red">*</font>
              {{ $t('requirex_requirement_object_label') }}
            </label>
            <input
              id="object"
              v-model="requirement.object"
              class="form-control"
              :placeholder="$t('requirex_requirement_object_label')"
            />
          </div>
        </div>

        <div class="row">
          <label>{{$t('requirex_requirement_relax_label')}}</label>
          <select v-model="requirement.relaxing" class="form-control">
            <option
              :value="$t('requirex_requirement_relax_many')"
            >{{ $t('requirex_requirement_relax_many')}}</option>
            <option
              :value="$t('requirex_requirement_relax_few')"
            >{{ $t('requirex_requirement_relax_few')}}</option>
            <option
              :value="$t('requirex_requirement_relax_before')"
            >{{ $t('requirex_requirement_relax_before')}}</option>
            <option
              :value="$t('requirex_requirement_relax_after')"
            >{{ $t('requirex_requirement_relax_after')}}</option>
            <option
              :value="$t('requirex_requirement_relax_during')"
            >{{ $t('requirex_requirement_relax_during')}}</option>
            <option
              :value="$t('requirex_requirement_relax_until')"
            >{{ $t('requirex_requirement_relax_until')}}</option>
            <option
              :value="$t('requirex_requirement_relax_within')"
            >{{ $t('requirex_requirement_relax_within')}}</option>
            <option
              :value="$t('requirex_requirement_relax_least')"
            >{{ $t('requirex_requirement_relax_least')}}</option>
            <option
              :value="$t('requirex_requirement_relax_eventually')"
            >{{ $t('requirex_requirement_relax_eventually')}}</option>
            <option
              :value="$t('requirex_requirement_relax_close')"
            >{{ $t('requirex_requirement_relax_close')}}</option>
          </select>
        </div>

        <div
          class="row"
          v-if="requirement.relaxing == $t('requirex_requirement_relax_many') | requirement.relaxing == $t('requirex_requirement_relax_few')"
        >
          <div class="col">
            <label>{{ $t('requirex_requirement_post_behaviour') }}</label>
            <select v-model="requirement.postBehaviour" class="form-control">
              <option
                :value="$t('requirex_requirement_after')"
              >{{ $t('requirex_requirement_after')}}</option>
              <option
                :value="$t('requirex_requirement_before')"
              >{{ $t('requirex_requirement_before')}}</option>
              <option
                :value="$t('requirex_requirement_during')"
              >{{ $t('requirex_requirement_during')}}</option>
            </select>
          </div>

          <div class="col">
            <label>
              <font size="3" color="red">*</font>
              {{ $t('requirex_requirement_object_label') }}
            </label>
            <input
              id="object"
              v-model="requirement.object"
              class="form-control"
              :placeholder="$t('requirex_requirement_object_label')"
            />
          </div>
        </div>
        <div
          class="row"
          v-if="requirement.relaxing == $t('requirex_requirement_relax_many') |
            requirement.relaxing == $t('requirex_requirement_relax_few') |  
            requirement.relaxing == $t('requirex_requirement_relax_before') |
            requirement.relaxing == $t('requirex_requirement_relax_after') |
            requirement.relaxing == $t('requirex_requirement_relax_during') |
            requirement.relaxing == $t('requirex_requirement_relax_until')"
        >
          <div class="col">
            <label>{{$t('requirex_requirement_event')}}</label>
            <input
              v-model="requirement.event"
              :placeholder="$t('requirex_requirement_event')"
              class="form-control"
            />
          </div>
        </div>

        <div class="row" v-if="requirement.relaxing == $t('requirex_requirement_relax_within')">
          <div class="col-3">
            <label>{{$t('requirex_requirement_time')}}</label>
            <input
              class="form-control"
              type="number"
              max="999999"
              min="1"
              step="1"
              v-model="requirement.timeInterval"
            />
          </div>
          <div class="col-3">
            <label>{{ $t('requirex_requirement_units') }}</label>
            <select v-model="requirement.units" class="form-control">
              <option
                :value="$t('requirex_requirement_units_milliseconds')"
              >{{ $t('requirex_requirement_units_milliseconds')}}</option>
              <option
                :value="$t('requirex_requirement_units_seconds')"
              >{{ $t('requirex_requirement_units_seconds')}}</option>
              <option
                :value="$t('requirex_requirement_units_minutes')"
              >{{ $t('requirex_requirement_units_minutes')}}</option>
              <option
                :value="$t('requirex_requirement_units_hours')"
              >{{ $t('requirex_requirement_units_hours')}}</option>
              <option
                :value="$t('requirex_requirement_units_days')"
              >{{ $t('requirex_requirement_units_days')}}</option>
              <option
                :value="$t('requirex_requirement_units_weeks')"
              >{{ $t('requirex_requirement_units_weeks')}}</option>
              <option
                :value="$t('requirex_requirement_units_months')"
              >{{ $t('requirex_requirement_units_months')}}</option>
              <option
                :value="$t('requirex_requirement_units_years')"
              >{{ $t('requirex_requirement_units_years')}}</option>
            </select>
          </div>
        </div>

        <div class="row" v-if="requirement.relaxing == $t('requirex_requirement_relax_least')">
          <div class="col-3">
            <label>{{ $t('requirex_requirement_time') }}</label>
            <input
              class="form-control"
              type="number"
              max="999999"
              min="1"
              step="1"
              v-model="requirement.timeInterval"
            />
          </div>
          <div class="col-9">
            <label>{{$t('requirex_requirement_frecuency')}}</label>
            <input
              class="form-control"
              v-model="requirement.frecuency"
              :placeholder="$t('requirex_requirement_frecuency')"
            />
          </div>
        </div>

        <div class="row" v-if="requirement.relaxing == $t('requirex_requirement_relax_close')">
          <div class="col">
            <label>{{ $t('requirex_requirement_quantity_frecuency') }}</label>

            <input
              class="form-control"
              v-model="requirement.quantityFrecuency"
              :placeholder="$t('requirex_requirement_quantity_frecuency')"
            />
          </div>
        </div>
      </form>

      <div class="container text-right my-2">
        <button
          id="generate"
          @click="onGenerateRequirement"
          type="button"
          class="btn btn-outline-dark mx-2"
        >{{$t('requirex_generate')}}</button>
        <button id="cancel" type="button" class="btn btn-danger">{{$t('requirex_cancel')}}</button>
      </div>
    </div>
  </div>
</template>

<script>

import { c } from '../assets/js/common/cons';

export default {
  data() {
    return {
      listAdaptationRequirement: [],
      requirement: {
        id: 0,
        requirementNumber: "",
        reqType: this.$t("requirex_requirement_type_value_1"),
        name: "",
        condition: false,
        conditionDescription: "",
        imperative: this.$t("requirex_requirement_imperative_value_1"),
        systemName: "",
        processVerb: "",
        object: "",
        system: "",
        relaxing: this.$t("requirex_requirement_relax_many"),
        postBehaviour: this.$t("requirex_requirement_after"),
        event: "",
        timeInterval: 0,
        units: "",
        quantity: "",
        frecuency: "",
        quantityFrecuency: "",
        msg: "",
        estado: true,
        date_at: new Date().toISOString().slice(0, 10)
      },

      countAdaptation: 0
    };
  },
  methods: {
    //Activar condiciones
    onConditionCheck() {
      if ($("#condition").is(":checked")) {
        $("#conditionDescriptionContainer")
          .first()
          .fadeIn("slow");

        this.requirement.condition = true;
      } else {
        this.requirement.condition = false;
        $("#conditionDescriptionContainer").hide();
      }
    },
    onAdaptationCancel() {
      $("#adaptationForm").trigger("reset");
    },
    onGenerateRequirement(name) {
      //Validar el formulario

      this.requirement.msg = "";

      //Si hay una condición
      if (this.requirement.condition) {
        this.requirement.msg += this.requirement.conditionDescription + " ";
      }
      //Complemento y nombre
      this.requirement.msg +=
        this.$t("requirex_requirement_sel_adaptive_complement") +
        this.requirement.systemName +
        " " +
        this.requirement.imperative;
      //Process Verrb
      this.requirement.msg += " " + this.requirement.processVerb + " ";

      //Validate Relax
      if (
        (this.requirement.relaxing ==
          this.$t("requirex_requirement_relax_many")) |
        (this.requirement.relaxing == this.$t("requirex_requirement_relax_few"))
      ) {
        this.requirement.msg +=
          this.requirement.relaxing +
          " " +
          this.requirement.object +
          " " +
          this.$t("requirex_requirement_as_posible") +
          " " +
          this.requirement.postBehaviour +
          " " +
          this.requirement.event;
      } else if (
        (this.requirement.relaxing ==
          this.$t("requirex_requirement_relax_before")) |
        (this.requirement.relaxing ==
          this.$t("requirex_requirement_relax_after")) |
        (this.requirement.relaxing ==
          this.$t("requirex_requirement_relax_during")) |
        (this.requirement.relaxing ==
          this.$t("requirex_requirement_relax_until"))
      ) {
        this.requirement.msg +=
          this.requirement.object +
          " " +
          this.requirement.relaxing +
          " " +
          this.requirement.event;
      } else if (
        this.requirement.relaxing ==
        this.$t("requirex_requirement_relax_within")
      ) {
        this.requirement.msg +=
          this.requirement.object +
          " " +
          this.requirement.relaxing +
          " " +
          this.requirement.timeInterval +
          " " +
          this.requirement.units +
          " ";
      } else if (
        this.requirement.relaxing == this.$t("requirex_requirement_relax_least")
      ) {
        this.requirement.msg +=
          this.requirement.object +
          " " +
          this.requirement.relaxing +
          " " +
          this.requirement.timeInterval +
          " " +
          this.requirement.quantity +
          " " +
          this.$t("requirex_requirement_times") +
          " " +
          this.requirement.frecuency +
          " ";
      } else if (
        this.requirement.relaxing ==
        this.$t("requirex_requirement_relax_eventually")
      ) {
        this.requirement.msg +=
          this.requirement.object + " " + this.requirement.relaxing;
      } else {
        this.requirement.msg +=
          this.requirement.object +
          " " +
          this.requirement.relaxing +
          " " +
          this.requirement.quantityFrecuency;
      }
      //Agregar item a la lista
      this.countAdaptation++;
      this.requirement.id = this.countAdaptation;
      this.requirement.requirementNumber = "S.R." + this.requirement.id;

      this.saveRequirement();
    },
    saveRequirement() {
      let uri = c.host + "requirex/adaptations";
      this.axios.post(uri, this.requirement).then(() => {
        $("#adaptationMessage span").text("Success!");
        $("#adaptationMessage").addClass("alert-success");
        $("#adaptationMessage").removeClass("alert-danger");
        setTimeout(this.showTooltip, 500);
        //Limpiar formulario
        this.onAdaptationCancel();
      });
    },
    onGoBack() {
      this.$router.push({
        name: "RequireX"
      });
    },
    showTooltip() {
      $("#adaptationMessage").show("slow");
      setTimeout(this.hideTooltip, 5000);
    },

    hideTooltip() {
      $("#adaptationMessage").hide("slow");
    }
  },
  mounted() {
    //Cargar lista de requerimientos de aplicacion
    let uri = c.host + "requirex/adaptations";
    this.axios.get(uri).then(response => {
      this.listAdaptationRequirement = response.data;
      this.countAdaptation = this.listAdaptationRequirement.length;
    });
  }
};
</script>

<style scoped>
.form-requirement {
  margin: 0 auto;
  max-width: 500px;
}
</style>