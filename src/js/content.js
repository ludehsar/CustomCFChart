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
            lineTension: 0,
            pointRadius: 4,
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
                    display: true
                },
            }],
            yAxes: [{
                display: true
            }]
        },
        plugins: {
            zoom: {
                // Container for pan options
                pan: {
                    // Boolean to enable panning
                    enabled: true,
        
                    // Panning directions. Remove the appropriate direction to disable
                    // Eg. 'y' would only allow panning in the y direction
                    // A function that is called as the user is panning and returns the
                    // available directions can also be used:
                    //   mode: function({ chart }) {
                    //     return 'xy';
                    //   },
                    mode: 'xy',
        
                    rangeMin: {
                        // Format of min pan range depends on scale type
                        x: null,
                        y: null
                    },
                    rangeMax: {
                        // Format of max pan range depends on scale type
                        x: null,
                        y: null
                    },
        
                    // On category scale, factor of pan velocity
                    speed: 20,
        
                    // Minimal pan distance required before actually applying pan
                    threshold: 10,
                },
        
                // Container for zoom options
                zoom: {
                    // Boolean to enable zooming
                    enabled: true,
        
                    // Enable drag-to-zoom behavior
                    drag: false,
        
                    // Drag-to-zoom effect can be customized
                    // drag: {
                    // 	 borderColor: 'rgba(225,225,225,0.3)'
                    // 	 borderWidth: 5,
                    // 	 backgroundColor: 'rgb(225,225,225)',
                    // 	 animationDuration: 0
                    // },
        
                    // Zooming directions. Remove the appropriate direction to disable
                    // Eg. 'y' would only allow zooming in the y direction
                    // A function that is called as the user is zooming and returns the
                    // available directions can also be used:
                    //   mode: function({ chart }) {
                    //     return 'xy';
                    //   },
                    mode: 'xy',
        
                    rangeMin: {
                        // Format of min zoom range depends on scale type
                        x: null,
                        y: null
                    },
                    rangeMax: {
                        // Format of max zoom range depends on scale type
                        x: null,
                        y: null
                    },
        
                    // Speed of zoom via mouse wheel
                    // (percentage of zoom on a wheel event)
                    speed: 0.1,
        
                    // Minimal zoom distance required before actually applying zoom
                    threshold: 2,
        
                    // On category scale, minimal zoom level before actually applying zoom
                    sensitivity: 3,
                }
            }
        }
    },
};

window.onload = function() {
    var ctx = document.getElementById('canvas').getContext('2d');
    window.ContestRatingChart = new Chart(ctx, config);
};
