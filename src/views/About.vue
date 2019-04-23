<template>
  <div>
    <div class="border-bottom text-left"><h1 class="h2">{{ $t("about_variamos") }}</h1></div>
    <div class="div-text-area">{{ $t("about_variamos_desc") }}</div>

    <div class="border-bottom text-left"><h1 class="h2">{{ $t("about_team") }}</h1></div>
    <div class="team-info">
      <img alt="" src="../assets/images/team/daniel.jpg" class="pull-left">
      <div class="pull-left">
        <span class="team-name">{{ $t("about_team_daniel") }}</span>
        <span class="team-post">{{ $t("about_team_daniel_desc") }}</span>
      </div>
    </div>
    <div class="team-info pad-40">
      <img alt="" src="../assets/images/team/raul.jpg" class="pull-left">
      <div class="pull-left">
        <span class="team-name">{{ $t("about_team_raul") }}</span>
        <span class="team-post">{{ $t("about_team_raul_desc") }}</span>
      </div>
    </div>

    <div class="border-bottom text-left"><h1 class="h2">{{ $t("about_past_versions") }}</h1></div>
    <div class="div-text-area">
      <b>{{ $t("about_team_past_copy1") }}</b> {{ $t("about_team_past_authors1") }}
      <br /><br />
      <b>{{ $t("about_team_past_copy2") }}</b> {{ $t("about_team_past_authors2") }}
      <br /><br />
      <b>{{ $t("about_team_past_copy3") }}</b> {{ $t("about_team_past_authors3") }}
    </div>

  </div>
</template>

<script>
export default {
  name: 'about'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.team-info{
    overflow: hidden;
    padding-top: 10px;
    display: flex;
}

.team-info span {
    display: block;
    text-align: left;
}

.team-info img {
    margin-right: 15px;
    border: 1px solid #f5f5f5;
    border-radius: 150px !important;
    height: 75px;
    padding: 3px;
}

.pull-left {
    float: left!important;
}

span.team-name {
    color: black;
    font-size: 16px;
    font-weight: 300;
    margin: 4px 0 7px;
}

span.team-post {
    color: #656565;
    font-size: 12px;
    text-align: justify;
}
</style>
