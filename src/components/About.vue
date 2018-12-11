<template>
  <div>
    <h1>{{ $t("about_team") }}</h1>
    <div class="team-info">
      <img alt="" src="/static/images/team/daniel.jpg" class="pull-left">
      <div class="pull-left">
        <span class="team-name">{{ $t("about_team_daniel") }}</span>
        <span class="team-post">{{ $t("about_team_daniel_desc") }}</span>
      </div>
    </div>
    <div class="team-info">
      <img alt="" src="/static/images/team/raul.jpg" class="pull-left">
      <div class="pull-left">
        <span class="team-name">{{ $t("about_team_raul") }}</span>
        <span class="team-post">{{ $t("about_team_raul_desc") }}</span>
      </div>
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
    width: 75px;
}

.pull-left {
    float: left!important;
}

span.team-name {
    color: black;
    font-size: 16px;
    font-weight: 300;
    margin: 15px 0 7px;
}

span.team-post {
    color: #656565;
    font-size: 12px;
}
</style>
