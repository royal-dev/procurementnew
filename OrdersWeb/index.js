(function() {

	var orderid = document.getElementById("orderid");
	var date = document.getElementById("date");
	var orderitem = document.getElementById("orderitem");
	var database = firebase.database();
	document.forms.contact.addEventListener('submit', function(e) {
		e.preventDefault();
		database.ref('orders/').push({
			orderid: orderid.value,
			date: date.value,
			orderitem: orderitem.value
		});
	});
}());
