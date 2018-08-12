var orderid=document.getElementById("orderid");
var date=document.getElementById("date");
var orderitem=document.getElementById("orderitem");
var contact=submit=document.getElementById("contact-submit");
var database=firebase.database();

function submitClick(orderid,date,orderitem){
/*database.ref('orders/').push({
    orderid:orderid,
    date:date,
    orderitem:orderitem
});
}*/

datebase.ref().child("Text").set("Value Some");
}

