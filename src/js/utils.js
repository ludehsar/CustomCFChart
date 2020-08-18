/**
 * This js file is responsible for getting the rating changes of users.
 * 
 */

let handle = '';

window.contestRatingResults = [];

$(document).ready(function () {
	let url = window.location.toString();
	handle = url.substring(url.lastIndexOf('/') + 1);
	$.ajax('https://codeforces.com/api/user.rating?handle=' + handle).then(function(res) {
		contestRatingResults = res.result;
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