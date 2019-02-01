// Global vars
var init_start_value = new Date('2012-01-01T00:00:00').getTime();
var init_end_value = new Date('2017-12-31T00:00:00').getTime();
var start_date = formatDate(new Date(init_start_value), "mmyy");
var end_date = formatDate(new Date(init_end_value), "mmyy");
var graph_to_show = "disease_line"; //disease_line,disease_arrow,weather_rainfall,weather_temperature,holiday_line,holiday_calendar
var graph_start = init_start_value;
var graph_end = init_end_value;
var graph_show_month = false;
var graph_hierarchy = 0;
var graph_data = [];

$(document).ready(function () {
    $.getJSON("../data/sort_by_disease.json", function (json) {
        var divGroup = document.getElementById("disease-data");
        var catList = [];
        var cat_group = 0;
        // build disease dropdown with data
        for (var cat in json) {
            if (cat != "total") {
                var catDiv = document.createElement('div');
                catList.push(cat);
                var catParent = document.createElement('input');

                catParent.type = 'checkbox';
                catParent.className = 'select-disease disease_category';
                catParent.value = cat;
                catParent.style.marginLeft = "20px";
                var catText = document.createTextNode(cat+" ");
                var btn = document.createElement('button');
                btn.id = "cat-btn";
                btn.className = "collapse-buttons";
                btn.setAttribute("data-toggle","collapse");
                btn.setAttribute("data-target","#cat_"+cat_group);
                var catContainer = document.createElement('li');
                catContainer.appendChild(catParent);
                catContainer.appendChild(catText);
                catContainer.appendChild(btn);
                catContainer.className = "cat-container";
                catDiv.appendChild(catContainer);
                catDiv.className = "cat-div";
                divGroup.appendChild(catDiv);
                var divParent = document.createElement('div');
                divParent.id = "cat_"+cat_group;
                divParent.className = "collapse in";
                cat_group+=1;
                for (var disease in json[cat]) {
                    if (disease == "total") continue;
                    var li = document.createElement('li');
                    var diseaseChild = document.createElement('input');
                    diseaseChild.type = 'checkbox';
                    diseaseChild.className = 'select-disease disease_individual';
                    diseaseChild.value = disease;
                    diseaseChild.style.marginLeft = "40px";
                    var diseaseName = document.createTextNode(disease);
                    li.appendChild(diseaseChild);
                    li.appendChild(diseaseName);
                    li.className = "child-li";
                    divParent.appendChild(li);
                }
                catDiv.appendChild(divParent);
            }
        }
        resetValues()

        $(".all-disease").on("click", function(e){

            // detect if the clicked element is the collapse button
            if(e.target.className.includes("collapse-buttons")){
                return;
            }

            changeAllDisease($("#all-disease-checkbox"));
        });

        $(".all-disease").change(function(){
            changeAllDisease($("#all-disease-checkbox"));
        })

        // handle the category checkboxes
        $(".disease_category").change(function(){
            changeCategory($(this));
        });

            
        $(".disease_individual").change(function(){
            changeIndividual($(this));
        });

        $(".child-li").on("click", function(){
            if(graph_hierarchy > 1) {
                changeIndividual($(this).children());
            }
        });

        $(".cat-container").on("click", function(e){
            // detect if the clicked element is the collapse button
            if(e.target.className.includes("collapse-buttons")){
                return;
            }

            if(graph_hierarchy > 0) {
                changeCategory($(this).children(".disease_category"));
            }
        });

        $(".disease_individual").prop("disabled", true);
        $(".disease_category").prop("disabled", true);
        $(".hierarchy").change(function () {
            var hierarchy = $(this).val();
            if (hierarchy == "all") {
                $(".select-disease").prop("checked",true);
                $(".disease_individual").prop("disabled", true);
                $(".disease_category").prop("disabled", true);
                $(".select-disease").prop("checked",true);
                graph_hierarchy = 0;
            }
            if (hierarchy == "category") {
                $(".select-disease").prop("checked",true);
                $(".disease_category").prop("disabled", false);
                $(".disease_individual").prop("disabled",true);
                graph_hierarchy = 1;
            }
            if (hierarchy == "individual") {
                $(".disease_individual").prop("disabled", false);
                $(".disease_category").prop("disabled",false);
                graph_hierarchy = 2;
            }
            itemList();
        });
        
        $(document).on('click', '.dropdown-menu', function (e) {
            e.stopPropagation();
          });
    });
    manupilatePage();
});

// check hierarchy before calling graph
function itemList() {
    var hierarchy_value = $(".hierarchy:checked").val();
    
    var checkedItems = [];
    if(hierarchy_value == "all")
    {
        checkedItems = [];
    }
    if (hierarchy_value == "individual") {
        checkedItems = $('.disease_individual:checked').map(function () {
            return $(this).val()
        });
    }
    if (hierarchy_value == "category") {
        checkedItems = $('.disease_category:checked').map(function () {
            return $(this).val()
        });
    }
    if(checkedItems.length == 0){
        graph_data = [];
    }else{
        graph_data = $.makeArray(checkedItems);
    }
    
    
    manupilatePage();
}

// function call to relevant graphs
function manupilatePage(){
    
    if(graph_to_show == "disease_line"){
        get_line_diagram(graph_start,graph_end,graph_hierarchy,graph_show_month,graph_data)
        //show html
    }

    else if(graph_to_show == "disease_arrow"){
        get_arrow_diagram(graph_start,graph_end,graph_hierarchy,graph_data);
        //show html
    }

    else if(graph_to_show == "weather_rainfall"){
        get_rain_fall(graph_start,graph_end,graph_hierarchy,graph_show_month,graph_data);
        //show html
    }
    
    else if(graph_to_show == "weather_temperature"){
        get_temperature(graph_start,graph_end,graph_hierarchy,graph_show_month,graph_data);
    }
    
    else if(graph_to_show == "holiday_line"){
        get_school_holiday(graph_start,graph_end,graph_hierarchy,graph_show_month,graph_data);
        //show html
    }

    else if(graph_to_show == "holiday_calendar"){
        get_holiday_calendar(graph_start,graph_end,graph_hierarchy,graph_show_month,graph_data);
        //show html
    }
}
// reset page function for graph
function graphDefaults(graph_type){
    graph_to_show = graph_type;
    graph_start = init_start_value;
    graph_end = init_end_value;
    graph_hierarchy = 0;
    graph_show_month = false;
    graph_data = [];
    manupilatePage();
}
// page selection button
$('#cmbCompare').change(function () {
    var selected_compare = $(this).val();
    if (selected_compare == "weather") {
        $('#visualisation-panel').hide();
        resetValues();
        $('.months-control').show()
        $('#weather-panel').show();
        document.getElementById("graph-container").setAttribute("style","margin-left:70px;width:80%;height:80%;")
        graphDefaults("weather_rainfall");
    }
    if (selected_compare == "holidays") {
        $('#weather-panel').hide();
        $('.dvisual-btns').hide();
        resetValues();
        $('#visualisation-panel').show();
        $('.cvisual-btns').show();

        document.getElementById("graph-container").setAttribute("style","padding-left:350px;width:120%;height:120%;")
        graphDefaults("holiday_line")
        
        $('#showmonths').prop("checked", true);
        checkEnabled();
    }
});
// range slider function
$(function () {
    $("#slider-range").slider({
        range: true,
        min: init_start_value,
        max: init_end_value,
        step: 86400000,
        values: [init_start_value, init_end_value],
        slide: function (event, ui) {
            var checkDate = document.getElementById('showmonths')
            $("#amount").val(formatDate(new Date(ui.values[0]), "yy") + ' - ' + formatDate(new Date(ui.values[1]), "yy"));
            start_date = formatDate(new Date(ui.values[0]), "mmyy");
            end_date = formatDate(new Date(ui.values[1]), "mmyy")
            if (checkDate.checked) {
                $("#startDate").val(start_date);
                $("#endDate").val(end_date);
            } else {
                $("#startDate").val("");
                $("#endDate").val("");
            }
            graph_start = new Date($("#slider-range").slider("values", 0));
            graph_end = new Date($("#slider-range").slider("values", 1));
            manupilatePage();
        }
    });
    $("#amount").val(formatDate((new Date($("#slider-range").slider("values", 0))), "yy") +
        " - " + formatDate((new Date($("#slider-range").slider("values", 1))), "yy"));
    graph_start = new Date($("#slider-range").slider("values", 0));
    graph_end = new Date($("#slider-range").slider("values", 1));
    manupilatePage();
});
// return mmyy format
function formatDate(date, x) {
    var monthNames = [
        "01", "02", "03",
        "04", "05", "06", "07",
        "08", "09", "10",
        "11", "12"
    ];

    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    if (x == "yy") {
        return year;
    }
    if (x == "mmyy") {
        return monthNames[monthIndex] + "/" + year;
    }
}
// for dropdown checkbox
function changeAllDisease(ele){
    let status = $("#all-disease-checkbox").prop("checked");

    if(status){
        $("#all-disease-checkbox").prop("checked", false);
    } else {
        $("#all-disease-checkbox").prop("checked", true);
    }

    // $(".disease_category").prop("checked", status);
    // $(".disease_individual").prop("checked", status);
    $(".select-disease").prop("checked", $("#all-disease-checkbox").prop("checked"));
    
    itemList();
}
// for dropdown checkbox
function changeCategory(ele){
    var status = ele.prop("checked");

    if(status){
        ele.prop("checked", false);
        status = false;
    } else {
        ele.prop("checked", true);
        status = true;
    }

  
    // change the children disease to same status
    ele.parent().next().children().children().prop("checked", status);

    var parentStatus = true;
    var trueCounter = $(".disease_category").length;
    // change the parent to relavant status
    $(".disease_category").each(function(){
        
        if(!$(this).prop("checked")){
            $("#all-disease-checkbox").prop("checked", false);
        } else {
            trueCounter--;
        }

        if(trueCounter == 0){
            $("#all-disease-checkbox").prop("checked", true);
        }
    });

    itemList();
}
// for dropdown checkbox
function changeIndividual(ele){

    
    var status = ele.prop("checked");

    if(status){
        ele.prop("checked", false);
    } else {
        ele.prop("checked", true);
    }


    var parentStatus = true;
    var trueCounter = ele.closest("li").siblings().length + 1;
    ele.closest("li").parent().children().each(function(){
        
        if(!$(this).children().prop("checked")){ 
            $(this).parent().prev().children().prop("checked", false);
            $("#all-disease-checkbox").prop("checked", false);
        } else {
            trueCounter--;
        }

        if(trueCounter == 0){
            $(this).parent().prev().children().prop("checked", true);
        }
    });

    trueCounter = $(".disease_category").length;
    // change the parent to relavant status
    $(".disease_category").each(function(){
        
        if(!$(this).prop("checked")){
            $("#all-disease-checkbox").prop("checked", false);
        } else {
            trueCounter--;
        }

        if(trueCounter == 0){
            $("#all-disease-checkbox").prop("checked", true);
        }
    });

    

    itemList();

}
// function for data picker calendar
$(function () {
    $('.date-picker').datepicker(
        {
            dateFormat: "mm/yy",
            changeMonth: true,
            changeYear: true,
            minDate: new Date(init_start_value),
            maxDate: new Date(init_end_value),
            showButtonPanel: true,
            onClose: function (dateText, inst) {


                function isDonePressed() {
                    return ($('#ui-datepicker-div').html().indexOf('ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all ui-state-hover') > -1);
                }

                if (isDonePressed()) {
                    var id = $(this).attr('id');
                    var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                    var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                    var date = new Date(year, month, 1)
                    var current_start_date = new Date($("#slider-range").slider("values", 0))
                    var current_end_date = new Date($("#slider-range").slider("values", 1))
                    var start_date_change;
                    var end_date_change;
                    if (id == "startDate") {
                        start_date_change = date;
                        if (start_date_change > current_end_date) {
                            $("#dateWarning").text("Start date cannot be later than end date!");
                            $("#dateWarning").fadeIn(1000);
                            start_date_change = current_start_date;
                        }
                        end_date_change = current_end_date;
                        $(this).datepicker('setDate', start_date_change).trigger('change');
                    } else {
                        end_date_change = date;
                        if (end_date_change < current_start_date) {
                            $("#dateWarning").text("End date cannot be earlier than start date!")
                            $("#dateWarning").fadeIn(1000);
                            end_date_change = current_end_date;
                        }
                        start_date_change = current_start_date;
                        $(this).datepicker('setDate', end_date_change).trigger('change');
                    }
                    $("#slider-range").slider({
                        values: [start_date_change, end_date_change]
                    });
                    graph_start = start_date_change;
                    graph_end = end_date_change;
                    manupilatePage();
                    $("#dateWarning").delay(3000).fadeOut(4000);
                    $("#amount").val(formatDate((new Date($("#slider-range").slider("values", 0))), "yy") +
                        " - " + formatDate((new Date($("#slider-range").slider("values", 1))), "yy"));
                    $('.date-picker').focusout()//Added to remove focus from datepicker input box on selecting date
                }
            },
            beforeShow: function (input, inst) {

                inst.dpDiv.addClass('month_year_datepicker')

                if ((datestr = $(this).val()).length > 0) {
                    year = datestr.substring(datestr.length - 4, datestr.length);
                    month = datestr.substring(0, 2);
                    $(this).datepicker('option', 'defaultDate', new Date(year, month - 1, 1));
                    $(this).datepicker('setDate', new Date(year, month - 1, 1));
                    $(".ui-datepicker-calendar").hide();
                }
            }
        })
});

function checkEnabled() {
    var checkDate = document.getElementById('showmonths')
    var startdate = document.getElementById('startDate')
    var enddate = document.getElementById('endDate')
    if (checkDate.checked) {
        startdate.disabled = false;
        enddate.disabled = false;
        $("#startDate").val(start_date);
        $("#endDate").val(end_date);
        graph_show_month = true;
    } else {
        startdate.disabled = true;
        enddate.disabled = true;
        $("#startDate").val("");
        $("#endDate").val("");
        graph_show_month = false;
    }
    manupilatePage();
};

function arrowClick() {
    $('.months-control').hide();
    resetValues();
    graphDefaults("disease_arrow");
}

function lineClick() {
    $('.months-control').show();
    resetValues()
    graphDefaults("disease_line");
}

function calClick() {
    $('.months-control').hide();
    resetValues();
    graphDefaults("holiday_calendar");
}

function holClick() {
    $('.months-control').show();
    resetValues();
    graphDefaults("holiday_line");
}

function rainClick(){
    resetValues();
    graphDefaults("weather_rainfall")
}

function tempClick(){
    resetValues();
    graphDefaults("weather_temperature");
}

//TOP BUTTONS
var btnContainer = document.getElementById("nav-disease");
// Get all buttons with class="btn" inside the container
var btns = btnContainer.getElementsByClassName("disease-btn");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("active");

        // If there's no active class
        

        // Add the active class to the current/clicked button
        if(graph_to_show != "disease_line" && graph_to_show != "disease_arrow"){
            this.className += " active";
            if (current.length > 0) {
                current[0].className = current[0].className.replace(" active", "");
            }
        }
        
        
    });
}

//DEFAULT VISUALISATION BUTTONS
var visuald_btnContainer = document.getElementById("nav-disease");
// Get all buttons with class="btn" inside the container
var vdbtns = visuald_btnContainer.getElementsByClassName("default-visual");
for (var i = 0; i < vdbtns.length; i++) {
    vdbtns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("vdactive");

        // If there's no active class
        if (current.length > 0) {
            current[0].className = current[0].className.replace(" vdactive", "");
        }

        // Add the active class to the current/clicked button
        this.className += " vdactive";
    });
}

//DEFAULT VISUALISATION BUTTONS
var visuald_btnContainer = document.getElementById("nav-disease");
// Get all buttons with class="btn" inside the container
var vcbtns = visuald_btnContainer.getElementsByClassName("calendar-visual");
for (var i = 0; i < vcbtns.length; i++) {
    vcbtns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("vcactive");

        // If there's no active class
        if (current.length > 0) {
            current[0].className = current[0].className.replace(" vcactive", "");
        }

        // Add the active class to the current/clicked button
        this.className += " vcactive";
    });
}

//Weather Visual Buttons
var visualw_btnContainer = document.getElementById("nav-disease");
// Get all buttons with class="btn" inside the container
var vwbtns = visualw_btnContainer.getElementsByClassName("weather-visual");
for (var i = 0; i < vwbtns.length; i++) {
    vwbtns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("vwactive");

        // If there's no active class
        if (current.length > 0) {
            current[0].className = current[0].className.replace(" vwactive", "");
        }

        // Add the active class to the current/clicked button
        this.className += " vwactive";
    });
}


//Reset inputs
function resetValues() {
    var startdate = document.getElementById('startDate')
    var enddate = document.getElementById('endDate')
    $('.collapse').collapse('show');
    $(".select-disease").prop('checked', true);
    $(".disease_individual").prop("disabled", true);
    $(".disease_category").prop("disabled", true);
    $(".default_check").addClass('active').siblings().removeClass('active');
    $("#holiday").addClass('vcactive').siblings().removeClass('vcactive');
    $("#rain").addClass('vwactive').siblings().removeClass('vwactive');
    $(".default_hierarchy").prop("checked",true);
    $("#showmonths").prop('checked', false);
    startdate.disabled = true;
    enddate.disabled = true;
    $('#startDate').val('');
    $('#endDate').val('');
    $("#slider-range").slider({
        values: [init_start_value, init_end_value]
    });
    $("#amount").val(formatDate((new Date($("#slider-range").slider("values", 0))), "yy") +
    " - " + formatDate((new Date($("#slider-range").slider("values", 1))), "yy"));
}

// search function
function search_disease(){

    var input, filter, ul, li, a, i;
    input = document.getElementById("disease-search");
    filter = input.value.toUpperCase();
    div = document.getElementById("all-disease");
    a = div.getElementsByClassName("child-li");
    for (i = 0; i < a.length; i++) {
        if (a[i].innerText.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}