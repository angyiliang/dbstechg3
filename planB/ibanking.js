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
            
            alert(mydata)
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