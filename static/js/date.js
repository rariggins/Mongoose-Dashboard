module.exports = {
	myDate: function(dateObj) {
		var date = dateObj;
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

		var day = date.getDate() + 1;
		var month = months[date.getMonth()];
		var year = date.getFullYear();

		return month + " " + day + " " + year;
	}

	bDate: function(dateObj) {
		var date = dateObj;

		var day = date.getDate() + 1;
		var m = date.getMonth() + 1;
		var month = (m < 10) ? ("0" + m) : m
		var year = date.getFullYear();

		return year + "-" + month + "-" + day;
	}

}