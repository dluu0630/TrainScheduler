// Initialize Firebase
var config = {
    apiKey: "AIzaSyCo8SG2q4nwgQ2wBFYpED_Adlni6yMuSsE",
    authDomain: "train-scheduler-469c5.firebaseapp.com",
    databaseURL: "https://train-scheduler-469c5.firebaseio.com",
    projectId: "train-scheduler-469c5",
    storageBucket: "",
    messagingSenderId: "914249165349"
};
firebase.initializeApp(config);

var database = firebase.database();

// Button to add train
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grab user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainTime = moment($("#train-time-input").val().trim(), "HH:mm").format("HH:mm");
    var trainFrequency = $("#frequency-input").val().trim();


    // Create local "temporary" obj for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency
    };

    // Push train data to database
    database.ref().push(newTrain);

    // Log everything to console
    console.log("Name: " + newTrain.name);
    console.log("Destination: " + newTrain.destination);
    console.log("First Time: " + newTrain.time);
    console.log("Frequency: " + newTrain.frequency);


    // Clear text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#train-time-input").val("");
    $("#frequency-input").val("");

    // prevent submit if not fully filled out
    return false;

});

// Create Firebase event for adding train to database and a row in html when user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    // Store everything into a variable
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().time;
    var trainFrequency = childSnapshot.val().frequency;

    console.log("trainName: " + trainName);
    console.log("trainDesination: " + trainDestination);
    console.log("trainTime: " + trainTime);
    console.log("trainFrequency: " + trainFrequency);

    // Moment.js methods for time calls and calculations
    var currentTime = moment("HH:mm");
    console.log("Current Time: " + currentTime);

    // Changed to hh:mm format. subtract a year to make sure it comes before current time.
    var trainTimePretty = moment(trainTime, "hh:mm");

    // Difference between now and time of first train subtracting current time from first train time.
    var diffTime = moment().diff(moment(trainTimePretty), "minutes");

    // Time apart
    var remainderTime = diffTime % trainFrequency;

    // Minutes until next train
    var trainMinutesAway = trainFrequency - remainderTime;

    // Calculate next train time
    var trainNext = moment().add(trainMinutesAway, "minutes");

    var nextArrival = moment(trainNext).format("hh:mm a");

    
    console.log("Difference in time: " + diffTime);
    console.log("Remainder: " + remainderTime);
    console.log("Next arrival: " + moment(trainNext).format("hh:mm"));

    // Add train data into table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + " minutes" +
      "</td><td>" + nextArrival + "</td><td>" + trainMinutesAway + " minutes" + "</td></tr>");

    

}, function(errorObject) {

    //Print any errors
    console.log("The read failed: " + errorObject.code);


});