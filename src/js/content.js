/**
 * This js file replaces the default rating chart in codeforces with custom chart.
 * 
 */

$('#placeholder').parent().css("height", "450px");
$('#placeholder').html('<div style="width:100%;"><canvas id="canvas"></canvas></div>');

var config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: '',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [],
            fill: false,
        }]
    },
    options: {
        responsive: true,
        tooltips: {
            mode: 'index',
            intersect: true
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                type: 'time',
                distribution: 'linear',
                time: {
                    unitStepSize: 5,
                    displayFormats: {
                        'millisecond': 'MMM DD',
                        'second': 'MMM DD',
                        'minute': 'MMM DD',
                        'hour': 'MMM DD',
                        'day': 'MMM DD',
                        'week': 'MMM DD',
                        'month': 'MMM YYYY',
                        'quarter': 'MMM YYYY',
                        'year': 'MMM YYYY',
                    }
                },
                gridLines: {
                    display: false
                },
            }],
            yAxes: [{
                display: true
            }]
        }
    }
};

window.onload = function() {
    var ctx = document.getElementById('canvas').getContext('2d');
    window.ContestRatingChart = new Chart(ctx, config);
};

var colorNames = Object.keys(window.chartColors);
