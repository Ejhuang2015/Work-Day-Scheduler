$(document).ready(function () {
// Variables
    // Save data array
    var scheduleSaveData = ["","","","","","","",""];

    // References to Elements in HTML
    const currentDayP = document.querySelector("#currentDay");
    const container = document.querySelector(".container");

// Functions
    // Display today's date
    function applyTodayDate() {
        $(currentDayP).text(dayjs().format("dddd, MMMM D YYYY"));
        // Check to see if date matches last known date
        checkDate();
        // Populate the rows
        addRows();
    }

    // Check to see if today's date matches the last saved date
    function checkDate(){
        // Grab the last known date from storage
        var lastKnownDate = localStorage.getItem("lastDate");
        if (!lastKnownDate){
            return;
        }
        // If today's date does not match the last known date, reset schedule
        if (dayjs().format("dddd, MMMM D YYYY") !== lastKnownDate){
            localStorage.setItem("plannerData", JSON.stringify(scheduleSaveData));
        }
    }

    // Add in today's rows
    function addRows() {
        for (index=0; index < 8; index++){
            // Calculate the hour integer
            var hourFrame = index + 9;

            // Resets the hour integer to fit with a 12 hour system
            if (hourFrame > 12){
                hourFrame = index - 3;
                // Appends the timeblock row
                $(container).append('<div class="row time-block" id=row'+ index +' value=' + index + '></div>');
                // Appends the children columns
                $("#row" + index).append('<div class= "col-md-1 hour" >'+ hourFrame +':00</div >')
                    .append('<div class="col-md-10 description" id="desc' + index + '"></div>')
                    .append('<button class="col-md-1 saveBtn"><img class="icon" src="./assets/floppy-disk.png" alt="https://www.flaticon.com/free-icon/floppy-disk_2983818"></button>');
                // Add Classes based on current time
                addClasses(hourFrame,index,true);
            }
            else {
                // Appends the timeblock row
                $(container).append('<div class="row time-block" id=row'+ index +' value=' + index + '></div>');
                // Appends the children columns
                $("#row" + index).append('<div class= "col-md-1 hour" >'+ hourFrame +':00</div >')
                    .append('<div class="col-md-10 description" id="desc' + index + '"></div>')
                    .append('<button class="col-md-1 saveBtn"><img class="icon" src="./assets/floppy-disk.png" alt="https://www.flaticon.com/free-icon/floppy-disk_2983818"></button>');
                // Add Classes based on current time
                addClasses(hourFrame,index,false);
            }
            // Load current div's saved data
            loadData(index);
        }
    }

    // Add classes to divs based on the current time
    function addClasses(hourBlock,currentDiv,addTwelve){
        var currentHour = dayjs().format("HH");

        // Adds 12 if its PM
        if (addTwelve==true){
            hourBlock = hourBlock + 12;
        }

        // Adds div classes and attributes based on whether the hour block is past, present, or future
        if (hourBlock < currentHour){
            $("#row"+currentDiv).addClass("past");
            $("#desc"+currentDiv).prop("contenteditable", "false");
        }
        else if (hourBlock > currentHour){
            $("#row"+currentDiv).addClass("future");
            $("#desc"+currentDiv).prop("contenteditable", "true");
        }
        else {
            $("#row"+currentDiv).addClass("present");
            $("#desc"+currentDiv).prop("contenteditable", "true");
        }
    }

    // Load saved data for each hour
    function loadData(currentDiv){
        var storedPlannerData = JSON.parse(localStorage.getItem("plannerData"));
        if (!storedPlannerData){
            return;
        }
        else{
            storedPlannerData.forEach((item) =>{
                scheduleSaveData = [...storedPlannerData];
            });
        }
        $("#desc"+currentDiv).text(scheduleSaveData[currentDiv]);
    }

// Handlers
    // Click the save button to store information into the local storage
    $(document).on("click", ".saveBtn", function(){
        // Get hour of the clicked div
        var parentValue = $(this.parentNode).attr("value");
        // Get the newly inserted description of the hour clicked
        var descriptionValue = document.getElementById("desc"+parentValue).textContent;
        // Replace old hour information with new information
        scheduleSaveData[parentValue] = descriptionValue;
        // Store the updated array into local storage
        localStorage.setItem("plannerData", JSON.stringify(scheduleSaveData));
        localStorage.setItem("lastDate", dayjs().format("dddd, MMMM D YYYY"));
    });


// Initialize
    function initMain() {
        applyTodayDate();
    }

    initMain();

}); //End of Script