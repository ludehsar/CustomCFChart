window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

let handle = '';

$(document).ready(function () {
	let url = window.location.toString();
	handle = url.substring(url.lastIndexOf('/') + 1);
	$.ajax('https://codeforces.com/api/user.rating?handle=' + handle).then(function(res) {
		if (ContestRatingChart.data.datasets[0].label.length <= 0) ContestRatingChart.data.datasets[0].label = handle;
		res.result.forEach(data => {
			// add new label and data point to chart's underlying data structures
			ContestRatingChart.data.labels.push(moment.unix(data.ratingUpdateTimeSeconds).format());

			ContestRatingChart.data.datasets[0].data.push(data.newRating);
      
			// re-render the chart
			ContestRatingChart.update();
		});
	});
});