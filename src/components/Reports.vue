<template>
  <div>
    <h1>{{ $t("reports_title") }}</h1>
    <canvas class="my-4 chartjs-render-monitor" id="myChart" width="1076" height="453" style="display: block; width: 1076px; height: 453px;"></canvas>
  </div>
</template>

<script>
import '@/assets/js/chart/Chart.min.js'


export default {
  mounted: function(){
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        datasets: [{
        data: [15339, 21345, 18483, 24003, 23489, 24092, 12034],
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
        }]
    },
    options: {
        scales: {
        yAxes: [{
            ticks: {
            beginAtZero: false
            }
        }]
        },
        legend: {
        display: false,
        }
    }
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>