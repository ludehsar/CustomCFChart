// CSP: disable automatic style injection
Chart.platform.disableCSSInjection = true;

const contestRatingResults = [];
const achievedHandles = [];
let globallyClickedDatasetIndex = -1;
let count = 0;

function generateRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#00';
    for (var i = 0; i < 4; i++) {
        color += letters[Math.round(Math.random() * 99989) % 16];
    }
    return color;
}

function addNewForm() {
    $('#input-form').append('<form action="#" id="handle-form-' + count +  '" data-count="' + count + '" class="form-inline"><div class="form-group mx-3 mb-2"><input type="text" name="handle" id="handle" class="form-control" placeholder="Enter a valid handle" required /></div><button type="submit" class="btn btn-primary mb-2">Add</button></form>');

    $('#handle-form-' + count).submit((event) => {
        event.preventDefault();
        const current = event.target.attributes['data-count'].value;
        populateChartData(event, current);
    });
}

function populateChartData(e, current) {
    const proposedHandle = e.target[0].value;
    for (var i = 0; i < achievedHandles.length; ++i) {
        if (proposedHandle == achievedHandles[i]) return;
    }
    $.ajax('https://codeforces.com/api/user.rating?handle=' + proposedHandle).then(function(res) {
        if (current == count) {
            contestRatingResults.push(res.result);
            const currentColor = generateRandomColor();
            const newDataset = {
                label: proposedHandle,
                lineTension: 0,
                pointRadius: 4,
                backgroundColor: currentColor,
                borderColor: currentColor,
                data: [],
                fill: false,
            };
            ContestRatingChart.data.datasets.push(newDataset);
            
            achievedHandles.push(proposedHandle);
        }
        else {
            contestRatingResults[current] = res.result;

            ContestRatingChart.data.datasets[current].label = proposedHandle;
            ContestRatingChart.data.datasets[current].data = [];

            achievedHandles[current] = proposedHandle;
        }
		res.result.forEach(data => {
            ContestRatingChart.data.datasets[current].data.push({
                t: moment.unix(data.ratingUpdateTimeSeconds).format(),
                y: data.newRating
            });
      
			// re-render the chart
			ContestRatingChart.update();
        });
        if (current == count) {
            count++;
            addNewForm();
        }
	});
}

function resetData() {
    while (contestRatingResults.length > 0) contestRatingResults.pop();
    while (achievedHandles.length > 0) achievedHandles.pop();
    count = 0;
    ContestRatingChart.data.datasets = [];
    ContestRatingChart.update();
    $('#input-form').empty();
    addNewForm();
}

var config = {
    type: 'line',
    data: {
        datasets: []
    },
    options: {
        responsive: true,
        events: ['click', 'touchstart', 'touchmove'],
        tooltips: {
            // Disable the on-canvas tooltip
            enabled: false,
            mode: 'index',
            position: 'nearest',
            intersect: true,
            callbacks: {
                title: function(tooltipItems, data) {
                    for (var i = 0; i < tooltipItems.length; ++i) {
                        if (tooltipItems[i].datasetIndex == globallyClickedDatasetIndex)
                            return contestRatingResults[globallyClickedDatasetIndex][tooltipItems[i].index].contestName;
                    }
                },
                labelColor: function(tooltipItems, chart) {
                    return {
                        borderColor: 'rgb(255, 255, 255)',
                        backgroundColor: 'rgb(153, 102, 255)'
                    };
                },
                labelTextColor: function(tooltipItems, chart) {
                    return '#543453';
                }
            },
            custom: function(tooltip) {
                // Tooltip Element
                var tooltipEl = document.getElementById('chartjs-tooltip');
    
                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'chartjs-tooltip';
                    tooltipEl.innerHTML = '<table></table>';
                    this._chart.canvas.parentNode.appendChild(tooltipEl);
                }
    
                // Hide if no tooltip
                if (tooltip.opacity === 0) {
                    tooltipEl.style.opacity = 0;
                    tooltipEl.style.display = 'none';
                    return;
                }
                tooltipEl.style.display = 'block';
    
                // Set caret Position
                tooltipEl.classList.remove('above', 'below', 'no-transform');
                if (tooltip.yAlign) {
                    tooltipEl.classList.add(tooltip.yAlign);
                } else {
                    tooltipEl.classList.add('no-transform');
                }
    
                function getBody(bodyItem) {
                    return bodyItem.lines;
                }
    
                // Set Text
                if (tooltip.body) {
                    var bodyLines = tooltip.body.map(getBody);
    
                    var innerHtml = '<thead>';

                    var index = -1;

                    for (var i = 0; i < tooltip.dataPoints.length; ++i) {
                        if (tooltip.dataPoints[i].datasetIndex == globallyClickedDatasetIndex) {
                            index = tooltip.dataPoints[i].index;
                            break;
                        }
                    }
                    

                    innerHtml += '<tr><th><a class="chartjs-tooltip-link" href="https://codeforces.com/contest/' + contestRatingResults[globallyClickedDatasetIndex][index].contestId + '/standings" target="_blank"><strong>' + tooltip.title[0] + '</strong></a></th></tr>';
                    innerHtml += '</thead><tbody>';

                    var colors = tooltip.labelColors[0];
                    var style = 'background:' + colors.backgroundColor;
                    style += '; border-color:' + colors.borderColor;
                    style += '; border-width: 2px';
                    var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
                    innerHtml += '<tr><td>' + span + 'Rating: ' + contestRatingResults[globallyClickedDatasetIndex][index].newRating + ' (' + ((contestRatingResults[globallyClickedDatasetIndex][index].newRating - contestRatingResults[globallyClickedDatasetIndex][index].oldRating) >= 0 ? '+' : '') + (contestRatingResults[globallyClickedDatasetIndex][index].newRating - contestRatingResults[globallyClickedDatasetIndex][index].oldRating) + ')</td></tr>';
                    innerHtml += '<tr><td>' + span + 'Rank: ' + contestRatingResults[globallyClickedDatasetIndex][index].rank + '</td></tr>';

                    innerHtml += '</tbody>';
    
                    var tableRoot = tooltipEl.querySelector('table');
                    tableRoot.innerHTML = innerHtml;
                }
    
                var positionY = this._chart.canvas.offsetTop;
                var positionX = this._chart.canvas.offsetLeft;
    
                // Display, position, and set styles for font
                tooltipEl.style.opacity = 1;
                tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                tooltipEl.style.top = positionY + tooltip.caretY + 'px';
                tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
                tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px';
                tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
                tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
            }
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        onClick: function (e) {
            const clicked = this.getElementAtEvent(e)[0];

            if (clicked) {
                globallyClickedDatasetIndex = clicked._datasetIndex;
            }
        },
        scales: {
            xAxes: [{
                display: true,
                type: 'time',
                distribution: 'linear',
                time: {
                    stepSize: 5,
                    displayFormats: {
                        'millisecond': 'MMM DD',
                        'second': 'MMM DD',
                        'minute': 'MMM DD',
                        'hour': 'MMM DD',
                        'day': 'MMM DD',
                        'week': 'MMM YYYY',
                        'month': 'MMM YYYY',
                        'quarter': 'YYYY',
                        'year': 'YYYY',
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
        annotation: {
            // Defines when the annotations are drawn.
			// This allows positioning of the annotation relative to the other
			// elements of the graph.
			//
			// Should be one of: afterDraw, afterDatasetsDraw, beforeDatasetsDraw
			// See http://www.chartjs.org/docs/#advanced-usage-creating-plugins
			drawTime: 'afterDatasetsDraw', // (default)

			// Mouse events to enable on each annotation.
			// Should be an array of one or more browser-supported mouse events
			// See https://developer.mozilla.org/en-US/docs/Web/Events
			events: ['click'],

			// Double-click speed in ms used to distinguish single-clicks from
			// double-clicks whenever you need to capture both. When listening for
			// both click and dblclick, click events will be delayed by this
			// amount.
            dblClickSpeed: 350, // ms (default)
            
            // Array of annotation configuration objects
            // See below for detailed descriptions of the annotation options
            annotations: [
                {
                    type: 'box',
                
                    // optional drawTime to control layering, overrides global drawTime setting
                    drawTime: 'beforeDatasetsDraw',
                
                    // optional annotation ID (must be unique)
                    id: 'a-box-1',
                
                    // ID of the X scale to bind onto
                    xScaleID: 'x-axis-0',
                
                    // ID of the Y scale to bind onto
                    yScaleID: 'y-axis-0',
                
                    // Left edge of the box. in units along the x axis
                    xMin: "1000-01-01T00:00:00Z",
                    
                    // Right edge of the box
                    xMax: "5000-01-01T09:00:00Z",
                
                    // Top edge of the box in units along the y axis
                    yMax: 1199,
                
                    // Bottom edge of the box
                    yMin:  0,
                
                    // Stroke color
                    borderColor: 'rgb(204, 204, 204)',
                
                    // Stroke width
                    borderWidth: 1,
                
                    // Fill color
                    backgroundColor: 'rgba(204, 204, 204, 0.5)',
                },
                {
                    type: 'box',
                
                    // optional drawTime to control layering, overrides global drawTime setting
                    drawTime: 'beforeDatasetsDraw',
                
                    // optional annotation ID (must be unique)
                    id: 'a-box-2',
                
                    // ID of the X scale to bind onto
                    xScaleID: 'x-axis-0',
                
                    // ID of the Y scale to bind onto
                    yScaleID: 'y-axis-0',
                
                    // Left edge of the box. in units along the x axis
                    xMin: "1000-01-01T00:00:00Z",
                    
                    // Right edge of the box
                    xMax: "5000-01-01T09:00:00Z",
                
                    // Top edge of the box in units along the y axis
                    yMax: 1399,
                
                    // Bottom edge of the box
                    yMin:  1200,
                
                    // Stroke color
                    borderColor: 'rgb(119, 255, 119)',
                
                    // Stroke width
                    borderWidth: 1,
                
                    // Fill color
                    backgroundColor: 'rgba(119, 255, 119, 0.5)',
                },
                {
                    type: 'box',
                
                    // optional drawTime to control layering, overrides global drawTime setting
                    drawTime: 'beforeDatasetsDraw',
                
                    // optional annotation ID (must be unique)
                    id: 'a-box-3',
                
                    // ID of the X scale to bind onto
                    xScaleID: 'x-axis-0',
                
                    // ID of the Y scale to bind onto
                    yScaleID: 'y-axis-0',
                
                    // Left edge of the box. in units along the x axis
                    xMin: "1000-01-01T00:00:00Z",
                    
                    // Right edge of the box
                    xMax: "5000-01-01T09:00:00Z",
                
                    // Top edge of the box in units along the y axis
                    yMax: 1599,
                
                    // Bottom edge of the box
                    yMin:  1400,
                
                    // Stroke color
                    borderColor: 'rgb(119, 221, 187)',
                
                    // Stroke width
                    borderWidth: 1,
                
                    // Fill color
                    backgroundColor: 'rgba(119, 221, 187, 0.5)',
                },
                {
                    type: 'box',
                
                    // optional drawTime to control layering, overrides global drawTime setting
                    drawTime: 'beforeDatasetsDraw',
                
                    // optional annotation ID (must be unique)
                    id: 'a-box-4',
                
                    // ID of the X scale to bind onto
                    xScaleID: 'x-axis-0',
                
                    // ID of the Y scale to bind onto
                    yScaleID: 'y-axis-0',
                
                    // Left edge of the box. in units along the x axis
                    xMin: "1000-01-01T00:00:00Z",
                    
                    // Right edge of the box
                    xMax: "5000-01-01T09:00:00Z",
                
                    // Top edge of the box in units along the y axis
                    yMax: 1899,
                
                    // Bottom edge of the box
                    yMin:  1600,
                
                    // Stroke color
                    borderColor: 'rgb(170, 170, 255)',
                
                    // Stroke width
                    borderWidth: 1,
                
                    // Fill color
                    backgroundColor: 'rgba(170, 170, 255, 0.5)',
                },
                {
                    type: 'box',
                
                    // optional drawTime to control layering, overrides global drawTime setting
                    drawTime: 'beforeDatasetsDraw',
                
                    // optional annotation ID (must be unique)
                    id: 'a-box-5',
                
                    // ID of the X scale to bind onto
                    xScaleID: 'x-axis-0',
                
                    // ID of the Y scale to bind onto
                    yScaleID: 'y-axis-0',
                
                    // Left edge of the box. in units along the x axis
                    xMin: "1000-01-01T00:00:00Z",
                    
                    // Right edge of the box
                    xMax: "5000-01-01T09:00:00Z",
                
                    // Top edge of the box in units along the y axis
                    yMax: 2099,
                
                    // Bottom edge of the box
                    yMin:  1900,
                
                    // Stroke color
                    borderColor: 'rgb(255, 136, 255)',
                
                    // Stroke width
                    borderWidth: 1,
                
                    // Fill color
                    backgroundColor: 'rgba(255, 136, 255, 0.5)',
                },
                {
                    type: 'box',
                
                    // optional drawTime to control layering, overrides global drawTime setting
                    drawTime: 'beforeDatasetsDraw',
                
                    // optional annotation ID (must be unique)
                    id: 'a-box-6',
                
                    // ID of the X scale to bind onto
                    xScaleID: 'x-axis-0',
                
                    // ID of the Y scale to bind onto
                    yScaleID: 'y-axis-0',
                
                    // Left edge of the box. in units along the x axis
                    xMin: "1000-01-01T00:00:00Z",
                    
                    // Right edge of the box
                    xMax: "5000-01-01T09:00:00Z",
                
                    // Top edge of the box in units along the y axis
                    yMax: 2299,
                
                    // Bottom edge of the box
                    yMin:  2100,
                
                    // Stroke color
                    borderColor: 'rgb(255, 204, 136)',
                
                    // Stroke width
                    borderWidth: 1,
                
                    // Fill color
                    backgroundColor: 'rgba(255, 204, 136, 0.5)',
                },
                {
                    type: 'box',
                
                    // optional drawTime to control layering, overrides global drawTime setting
                    drawTime: 'beforeDatasetsDraw',
                
                    // optional annotation ID (must be unique)
                    id: 'a-box-7',
                
                    // ID of the X scale to bind onto
                    xScaleID: 'x-axis-0',
                
                    // ID of the Y scale to bind onto
                    yScaleID: 'y-axis-0',
                
                    // Left edge of the box. in units along the x axis
                    xMin: "1000-01-01T00:00:00Z",
                    
                    // Right edge of the box
                    xMax: "5000-01-01T09:00:00Z",
                
                    // Top edge of the box in units along the y axis
                    yMax: 2399,
                
                    // Bottom edge of the box
                    yMin:  2300,
                
                    // Stroke color
                    borderColor: 'rgb(255, 187, 85)',
                
                    // Stroke width
                    borderWidth: 1,
                
                    // Fill color
                    backgroundColor: 'rgba(255, 187, 85, 0.5)',
                },
                {
                    type: 'box',
                
                    // optional drawTime to control layering, overrides global drawTime setting
                    drawTime: 'beforeDatasetsDraw',
                
                    // optional annotation ID (must be unique)
                    id: 'a-box-8',
                
                    // ID of the X scale to bind onto
                    xScaleID: 'x-axis-0',
                
                    // ID of the Y scale to bind onto
                    yScaleID: 'y-axis-0',
                
                    // Left edge of the box. in units along the x axis
                    xMin: "1000-01-01T00:00:00Z",
                    
                    // Right edge of the box
                    xMax: "5000-01-01T09:00:00Z",
                
                    // Top edge of the box in units along the y axis
                    yMax: 2599,
                
                    // Bottom edge of the box
                    yMin:  2400,
                
                    // Stroke color
                    borderColor: 'rgb(255, 119, 119)',
                
                    // Stroke width
                    borderWidth: 1,
                
                    // Fill color
                    backgroundColor: 'rgba(255, 119, 119, 0.5)',
                },
                {
                    type: 'box',
                
                    // optional drawTime to control layering, overrides global drawTime setting
                    drawTime: 'beforeDatasetsDraw',
                
                    // optional annotation ID (must be unique)
                    id: 'a-box-9',
                
                    // ID of the X scale to bind onto
                    xScaleID: 'x-axis-0',
                
                    // ID of the Y scale to bind onto
                    yScaleID: 'y-axis-0',
                
                    // Left edge of the box. in units along the x axis
                    xMin: "1000-01-01T00:00:00Z",
                    
                    // Right edge of the box
                    xMax: "5000-01-01T09:00:00Z",
                
                    // Top edge of the box in units along the y axis
                    yMax: 2999,
                
                    // Bottom edge of the box
                    yMin:  2600,
                
                    // Stroke color
                    borderColor: 'rgb(255, 51, 51)',
                
                    // Stroke width
                    borderWidth: 1,
                
                    // Fill color
                    backgroundColor: 'rgba(255, 51, 51, 0.5)',
                },
                {
                    type: 'box',
                
                    // optional drawTime to control layering, overrides global drawTime setting
                    drawTime: 'beforeDatasetsDraw',
                
                    // optional annotation ID (must be unique)
                    id: 'a-box-10',
                
                    // ID of the X scale to bind onto
                    xScaleID: 'x-axis-0',
                
                    // ID of the Y scale to bind onto
                    yScaleID: 'y-axis-0',
                
                    // Left edge of the box. in units along the x axis
                    xMin: "1000-01-01T00:00:00Z",
                    
                    // Right edge of the box
                    xMax: "5000-01-01T09:00:00Z",
                
                    // Top edge of the box in units along the y axis
                    yMax: 5000,
                
                    // Bottom edge of the box
                    yMin:  3000,
                
                    // Stroke color
                    borderColor: 'rgb(170, 0, 0)',
                
                    // Stroke width
                    borderWidth: 1,
                
                    // Fill color
                    backgroundColor: 'rgba(170, 0, 0, 0.5)',
                },
            ]
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

window.addEventListener('load', function() {
    var ctx = document.getElementById('canvas').getContext('2d');
    window.ContestRatingChart = new Chart(ctx, config);
    $('#reset-btn').click(() => {
        resetData();
    });

    addNewForm();
});
