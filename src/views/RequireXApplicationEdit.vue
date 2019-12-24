<template>
  <div class="container">
     <div id="applicationMessage" class="alert alert-danger" role="alert" style="display: none">
      <span></span>
    </div>

    <div class="container text-left">
      <button class="btn" @click="onGoBack">
        <i class="fa fa-arrow-left"></i>
        <small class="mx-2">{{ $t("requirex_go_back") }}</small>
      </button>
    </div>

    <div class="container my-2 form-requirement">
      <form id="applicationForm" ref="requirement">
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
          <div class="col">
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

          <div class="col">
            <label class="text-left">
              <font size="3" color="red">*</font>
              {{ $t('requirex_requirement_system_activity_label') }}
            </label>
            <select
              id="systemActivity"
              v-model="requirement.systemActivity"
              class="form-control"
              @change="onSystemActivityChange"
            >
              <option
                :value="$t('requirex_requirement_system_activity_value_1')"
              >{{ $t('requirex_requirement_system_activity1')}}</option>
              <option
                :value="$t('requirex_requirement_system_activity_value_2')"
              >{{ $t('requirex_requirement_system_activity2')}}</option>
              <option
                :value="$t('requirex_requirement_system_activity_value_3')"
              >{{ $t('requirex_requirement_system_activity3')}}</option>
            </select>
          </div>
        </div>

        <div id="userContent" class="text-left my-2">
          <label>{{$t('requirex_requirement_user_label')}}</label>
          <input
            id="user"
            v-model="requirement.user"
            class="form-control"
            :placeholder="$t('requirex_requirement_user_label')"
          />
        </div>

        <div id="extIntContent" class="row my-2" style="display: none">
          <div class="col">
            <label>{{$t('requirex_requirement_system_label')}}</label>
            <input
              id="system"
              v-model="requirement.system"
              class="form-control"
              :placeholder="$t('requirex_requirement_system_label')"
            />
          </div>
          <div class="col">
            <label>{{ $t('requirex_requirement_from_label') }}</label>
            <select
              id="from"
              v-model="requirement.from"
              class="form-control"
              :placeholder="$t('requirex_select')"
            >
              <option
                :value="$t('requirex_requirement_from_value_1')"
              >{{ $t('requirex_requirement_from1')}}</option>
              <option
                :value="$t('requirex_requirement_system_from_value_2')"
              >{{ $t('requirex_requirement_from2')}}</option>
            </select>
          </div>
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

        <div class="custom-control custom-switch my-2">
          <input
            type="checkbox"
            class="custom-control-input"
            id="systemCondition"
            v-model="requirement.systemCondition"
            @click="onSystemConditionCheck"
          />
          <label
            class="custom-control-label"
            for="systemCondition"
          >{{$t('requirex_requirement_system_condition_domain_label')}}</label>
        </div>

        <div id="systemConditionDescriptionContainer" class="text-left" style="display: none">
          <label>{{ $t('requirex_requirement_description') }}</label>
          <textarea
            id="systemConditionDescription"
            v-model="requirement.systemConditionDescription"
            class="form-control"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            :placeholder="$t('requirex_requirement_system_condition_descrive_label')"
          />
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
import $ from "jquery";
import { c }  from "../assets/js/common/cons";

$(function() {
  //Agregar o retirar condiciones del sistema
  $(document).on("click", "#cancel", function() {
    $("#applicationForm").trigger("reset");
  });
});
export default {
  data() {
    return {
      requirement: {}
    };
  },
  created() {
    let uri = c.host + `applications/${this.$route.params.id}`;
    this.axios.get(uri).then(response => {
      this.requirement = response.data;
    });
  },
  methods: {
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

    //Activar condiciones
    onSystemConditionCheck() {
      if ($("#systemCondition").is(":checked")) {
        $("#systemConditionDescriptionContainer")
          .first()
          .fadeIn("slow");
        this.requirement.systemCondition = true;
      } else {
        this.requirement.systemCondition = false;
        $("#systemConditionDescriptionContainer").hide();
      }
    },

    onSystemActivityChange() {
      if (this.requirement.systemActivity == "userInt") {
        $("#userContent")
          .first()
          .fadeIn("slow");
        $("#extIntContent").hide();
      } else if (this.requirement.systemActivity == "autoAct") {
        //Al selecccionar actividad autonoma
        $("#userContent").hide();
        $("#extIntContent").hide();
      } else if (this.requirement.systemActivity == "extInt") {
        //Al seleccionar actividad externa
        $("#userContent").hide();
        $("#extIntContent")
          .first()
          .fadeIn("slow");
      }
    },
    onGenerateRequirement(nae) {
      this.requirement.msg = "";
      //Si hay una condición
      if (this.requirement.condition) {
        this.requirement.msg += this.requirement.conditionDescription + " ";
      }

      this.requirement.msg +=
        "The " +
        this.requirement.systemName +
        " " +
        this.requirement.imperative;

      //Validate system activity
      if (this.requirement.systemActivity == "autoAct") {
        this.requirement.msg +=
          " " + this.requirement.processVerb + " " + this.requirement.object;
      } else if (this.requirement.systemActivity == "userInt") {
        this.requirement.msg +=
          " provide the " + this.requirement.user + " the capacity of";
        this.requirement.msg +=
          " " + this.requirement.processVerb + " " + this.requirement.object;
      } else if (this.requirement.systemActivity == "extInt") {
        this.requirement.msg +=
          " have the capacity of " +
          this.requirement.processVerb +
          " " +
          this.requirement.object +
          " " +
          this.requirement.from +
          " the " +
          this.requirement.system;
      }

      //Validat conditions
      if (this.requirement.systemCondition) {
        this.requirement.msg +=
          ", " + this.requirement.systemConditionDescription;
      }

      this.updateRequirement();
    },
    updateRequirement() {
      let uri = c.host + `applications/update/${this.$route.params.id}`;
      this.axios.post(uri, this.requirement).then(() => {
        $("#applicationMessage span").text("Success!");
        $("#applicationMessage").addClass("alert-success");
        $("#applicationMessage").removeClass("alert-danger");
        setTimeout(this.showTooltip, 500);
      });
    },
     showTooltip() {
      $("#applicationMessage").show("slow");
      setTimeout(this.hideTooltip, 5000);
    },

    hideTooltip() {
      $("#applicationMessage").hide("slow");
    },

    onGoBack() {
      this.$router.push({
        name: "RequireX"
      });
    }
  }
};
</script>