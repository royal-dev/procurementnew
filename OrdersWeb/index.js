(function() {

	var orderid = document.getElementById("orderid");
	var date = document.getElementById("date");
	var orderitem = document.getElementById("orderitem");
	try{
	document.forms.contact.addEventListener('submit', function(e) {
		e.preventDefault();
		
		var key = Math.random().toString(36).substr(2);
	  
		var newData={
			id: key,
			orderid: orderid.value,
			date: date.value,
			orderitem: orderitem.value,
			orderweight: orderweight.value
		 }
	  
		 firebase.database().ref('/orders/'+ key).set(newData);
	  
	});}catch(e){
		alert("Error, Updating");
	}
}());



	
	
	