<template>
  <div>
    <div class="border-bottom text-left" style="width:100%;">
      <h1 class="h2" style="display:inline;">{{ $t("app_menu_hlvl") }}</h1>
      <img style="float:right;height:50px;" src="@/assets/images/coffee.png">
    </div>
    <p style="text-align:left;">
      Powered by
      <strong>Coffee Framework</strong>
    </p>
    <div class="div-text-area">
      <textarea v-model="input"></textarea>
      <br>
      <button v-on:click="compile">Compile code</button>
      <br>
      <br>
      <textarea v-model="response"></textarea>
    </div>
  </div>
</template>

<script>
import { AXIOS } from "../http-commons";

export default {
  name: "hlvl",
  data() {
    return {
      input: `variable "image" {
  default = "Ubuntu 14.04"
}`,
      response: [],
      errors: []
    };
  },
  methods: {
    compile: function() {
      AXIOS.get(`http://localhost:8888/variamosbackend/coffee`, {
        params: {
          input: this.input
        }
      }) // base URL is in http-commons.js
        .then(response => {
          // JSON responses are automatically parsed.
          this.response = response.data["content"];
        })
        .catch(e => {
          this.errors.push(e);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
textarea {
  display: block;
  margin: 0px 0;
  min-height: 200px;
  width: 200px;
}
</style>
