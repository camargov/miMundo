// GLOBAL VARIABLES FOR COMPLETION BAR
const inProgressWidth = 0;
const barWidth = 250;
const barHeight = 20;
const barColorBackground = "#00A5CF";
const barColorInProgress = "#7AE582";

// GLOBAL VARIABLES FOR GOALS
let visitedNum = 0;
let goalNum = 14;
let completeTypeGoal = 0;

// GLOBAL VARIABLES FOR MAP
let visitedColor = "#7AE582";
let notVisitedColor = "#00A5CF";
let outlineColor = "#FFFFFF";
let countries = [
    {name: "Argentina", mapSelected: false, goalSelected: false},
    {name: "Bolivia", mapSelected: false, goalSelected: false},
    {name: "Brazil", mapSelected: false, goalSelected: false},
    {name: "Chile", mapSelected: false, goalSelected: false},
    {name: "Colombia", mapSelected: false, goalSelected: false},
    {name: "Ecuador", mapSelected: false, goalSelected: false},
    {name: "Falkland_1", mapSelected: false, goalSelected: false},
    {name: "Falkland_2", mapSelected: false, goalSelected: false},
    {name: "French_Guiana", mapSelected: false, goalSelected: false},
    {name: "Guyana", mapSelected: false, goalSelected: false},
    {name: "Paraguay", mapSelected: false, goalSelected: false},
    {name: "Peru", mapSelected: false, goalSelected: false},
    {name: "Suriname", mapSelected: false, goalSelected: false},
    {name: "Uruguay", mapSelected: false, goalSelected: false},
    {name: "Venezuela", mapSelected: false, goalSelected: false}
];

// ---------------------------------------------------------------------------------
// SET-UP: COMPLETION BARS

// Creating the completion bar for the number country goal
const numGoalSVG = d3.select("#number_goal_bar")
    .append("svg")
    .attr("width", barWidth)
    .attr("height", barHeight);

let numGoalBar = numGoalSVG.append("rect")
    .attr("width", barWidth)
    .attr("height", barHeight)
    .attr("fill", barColorBackground);

let numGoalProgress = numGoalSVG.append("rect")
    .attr("width", inProgressWidth)
    .attr("height", barHeight) 
    .attr("fill", barColorInProgress);


// Creating the completion bar for the type of country goal
const typeGoalSVG = d3.select("#country_type_goal_bar")    
    .append("svg")
    .attr("width", barWidth)
    .attr("height", barHeight);

let typeGoalBar = typeGoalSVG.append("rect")
    .attr("width", barWidth)
    .attr("height", barHeight)
    .attr("fill", barColorBackground);

let typeGoalProgress = typeGoalSVG.append("rect")
    .attr("width", inProgressWidth)
    .attr("height", barHeight) 
    .attr("fill", barColorInProgress);

// ---------------------------------------------------------------------------------
// INTERACTIONS THAT DEAL WITH TRAVERSING THE ARRAY OF COUNTRIES

countries.forEach(function(d) {
    // calling the function to check when a country is clicked
    countryClicked(d);

    // updating the checkboxes when they are clicked
    updateCheckboxes(d);
});
// ---------------------------------------------------------------------------------
// MAP INTERACTION

// Changing the color of the visited and non-visited countries
function countryClicked(d) {
    let selector = `#${d.name}`;

    d3.select(selector).on("click", function() {
        if (!d.mapSelected) {
            // updating the number of visited countries
            visitedNum++;
            // The case of the falkland islands which are represented by two shapes
            if (selector === "#Falkland_1" || selector === "#Falkland_2") {
                d3.select("#Falkland_1").attr("fill", visitedColor);
                d3.select("#Falkland_2").attr("fill", visitedColor);
                d3.select("#flag_Falkland_1").style("opacity", 1);
                countries[6].mapSelected = true;
                countries[7].mapSelected = true;
            }
            else {
                d3.select(this).attr("fill", visitedColor);
                d3.select(`#flag_${d.name}`).style("opacity", 1);
                d.mapSelected = true;
            }
        }
        else {
            // updating the number of visited countries
            visitedNum--;
            // The case of the falkland islands
            if (selector === "#Falkland_1" || selector === "#Falkland_2") {
                d3.select("#Falkland_1").attr("fill", notVisitedColor);
                d3.select("#Falkland_2").attr("fill", notVisitedColor);
                d3.select("#flag_Falkland_1").style("opacity", 0);
                countries[6].mapSelected = false;
                countries[7].mapSelected = false;
            }
            else {
                d3.select(this).attr("fill", notVisitedColor);
                d3.select(`#flag_${d.name}`).style("opacity", 0);
                d.mapSelected = false;
            }
        }

        // updates the completion bar for the number-of-countries goal
        updateNumGoal();

        // calling the function to keep track of the country checkboxes
        updateTypeGoal();
    });
}
// ---------------------------------------------------------------------------------
// CUSTOMIZATION INTERACTION - MAP FILL COLORS

// When the user selects a color for countries visited
d3.select("#visited_color").on("input", function() {
    // changing the visited color
    visitedColor = d3.select(this).property("value");
    // updating the colors of the countries that have been visited
    countries.forEach(function(d) {
        if (d.mapSelected) {
            let selector = `#${d.name}`
            d3.select(selector).attr("fill", visitedColor);
        }
    });
});

// When the user selects a color for countries not visited
d3.select("#not_visited_color").on("input", function() {
    // changing the not-visited color
    notVisitedColor = d3.select(this).property("value");
    // updating the colors of the countries that have not been visited
    countries.forEach(function(d) {
        if (!d.mapSelected) {
            let selector = `#${d.name}`
            d3.select(selector).attr("fill", notVisitedColor);
        }
    });
});
// ---------------------------------------------------------------------------------
// CUSTOMIZATION INTERACTION - MAP OUTLINE COLOR

// When the user selects the world avatar 
d3.select("#none_outline_option").on("input", function() {
    changeOutlineColor("none");
});

// When the user selects the suitcase avatar
d3.select("#outline_color_option").on("input", function() {
    changeOutlineColor(outlineColor);
});

// When the user selects the airplane avatar
d3.select("#outline_color").on("input", function() {
    outlineColor = d3.select(this).property("value");
    if (d3.select("#outline_color_option").property("checked")) {
        changeOutlineColor(outlineColor);
    }
});

// Function to change the avatar image
function changeOutlineColor(color) {
    countries.forEach(function(d) {
        let selector = `#${d.name}`;
        d3.select(selector).attr("stroke", color);
        d3.select(selector).attr("stroke-width", 3);
    });
}
// ---------------------------------------------------------------------------------
// GOALS INTERACTION - NUMBER GOAL

// When the user inputs a number for how many countries they'd like to visit
d3.select("#visit_number_goal").on("input", function() {
    goalNum = d3.select(this).property("value");
    updateNumGoal();
});

// Updates the completion bar's width for the number-of-countries goal 
function updateNumGoal() {
    let width = Math.round((visitedNum / goalNum) * barWidth);
    numGoalProgress.attr("width", width);
    d3.select("#updated_message_num").html(`I have visited ${visitedNum} out of ${goalNum} countries`);
}
// ---------------------------------------------------------------------------------
// GOALS INTERACTION - COUNTRY-TYPE GOAL

// Updates when a country is checked
function updateCheckboxes(d) {
    let selector = `#checkbox_${d.name}`;
    
    d3.select(selector).on("input", function() {
        d.goalSelected = !d.goalSelected;
        if (d.goalSelected) {
            completeTypeGoal++;
        }  
        else {
            completeTypeGoal--;
        }
        // updates the completion bar for this goal
        updateTypeGoal();
    });
}

// Updates the completion bar of the checkbox goal
function updateTypeGoal() {
    let progress = 0;
    let width = 0;

    // checking the number of countries that meets the goal of the user
    countries.forEach(function(d) {
        if (d.mapSelected && d.goalSelected) {
            progress++;
        }
    });

    // updating the width of the in-progress bar
    if (progress != 0 && completeTypeGoal != 0) {
        width = Math.round((progress / completeTypeGoal) * barWidth);
    }
    typeGoalProgress.attr("width", width);
    d3.select("#updated_message_type").html(`I have visited ${progress} out of ${completeTypeGoal} countries on my list`);
}
