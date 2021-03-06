var tabs_content = ["showSummary", "showSavings", "showCredit", "showHistory", "showInbox"]

function showSummary() {

    tabs_content.forEach((element)=>{
   
        var x = document.getElementById(element);
        if (element=="showSummary") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        } 
    });
    console.log("summ")
}

function showSavings() {
    tabs_content.forEach((element)=>{
   
        var x = document.getElementById(element);
        if (element=="showSavings") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        } 
    });
    console.log("savings")
}

function showCredit() {
    tabs_content.forEach((element)=>{
   
        var x = document.getElementById(element);
        if (element=="showCredit") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        } 
    });
    console.log("credits")
}

function showHistory() {
    tabs_content.forEach((element)=>{
        var x = document.getElementById(element);
        if (element=="showHistory") {
            x.style.display = "block";
        } else {    
            x.style.display = "none";
            
           
        } 
    });
    console.log("history")
}

function showInbox() {
    tabs_content.forEach((element)=>{
   
        var x = document.getElementById(element);
        if (element=="showInbox") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        } 
    });
    console.log("inbox")
}

$( document ).ready(function() {
    console.log( "ready!" );


    // show the savings data
    $.getJSON("./data/saving_december.json", function(json) {
        
        console.log(json)
        $("#savings").text("$"+json['availableBalance'])
        $("#balance").text("$"+json['availableBalance'])
        $("#savingAccount").text(json['accountNumber'])
    });

    $.getJSON("./data/credit_106.json", function(json) {
        
        console.log(json)
        $("#credit").text("$"+json['outstandingAmount'])

    });

    $.getJSON("./data/transaction.json", function(json) {
      $.each(json, function(i, data){
          console.log(json)
        $("#history").append("$"+ "<tr><td>" + json['date'] + "</td><td>" + json['type']+ "</td></tr>" + json['referenceNumber']+ "</td></tr>" + json['amount']+ "</td></tr>")
      },

  )})

    $.getJSON("./data/marketing_msg.json", function(json) {
        
        console.log(json)
        $("#marketmsg").text("Ads: " + json['body'])

    });
    
});