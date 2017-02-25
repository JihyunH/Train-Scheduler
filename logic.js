// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCMDhCTley_-shjl9HMelmuh0LWR5c_rS8",
    authDomain: "train-schedule-30a1b.firebaseapp.com",
    databaseURL: "https://train-schedule-30a1b.firebaseio.com",
    storageBucket: "train-schedule-30a1b.appspot.com",
    messagingSenderId: "967116315680"
  };
  firebase.initializeApp(config);


//create Firebase database variable
var database = firebase.database();

//create variables 
var trainName;
var destination;
var firstTrainTime;
var frequency;

$("#add-train-btn").on("click", function(event){
event.preventDefault();
trainName =	$("#train-name-input").val().trim();
destination = $("#train-destination-input").val().trim();
firstTrainTime = $("#first-train-time-input").val().trim();
frequency = $("#frequency-input").val().trim();


//add moment.js to parse the firstTrainTime 
database.ref().push({
	trainName: trainName,
	destination: destination,
	firstTrainTime: firstTrainTime,
	frequency: frequency
});
$("input").val("");

database.ref().on("child_added", function(childSnapshot) {

  var first = childSnapshot.val().firstTrainTime;
  var firstTimeConverted = moment(first, "hh:mm").subtract(1, "years");
  var frequency = childSnapshot.val().frequency;
  var diffTime = moment().diff(moment(firstTimeConverted, 'h:mm a'), 'minutes');
  console.log(diffTime);
  var minutesUntilNextTrain = diffTime % frequency;
  var nextTrainTime = moment().add(minutesUntilNextTrain, 'minutes').format("hh:mm");

  // console.log(childSnapshot.val().trainName);
  // console.log(childSnapshot.val().destination);
  // console.log(childSnapshot.val().firstTrainTime);
  // console.log(childSnapshot.val().frequency);

//create variables for each individual child added 
var newRow = $("<tr>");
var name = $("<td>").text(childSnapshot.val().trainName).appendTo(newRow);
var destination = $("<td>").text(childSnapshot.val().destination).appendTo(newRow);
var frequency = $("<td>").text(childSnapshot.val().frequency).appendTo(newRow);
var nextArrival = $("<td>").text(nextTrainTime).appendTo(newRow); 
var minutesAway = $("<td>").text(minutesUntilNextTrain).appendTo(newRow);

newRow.appendTo("tbody");

//create new variables for taking in the input of first train time 
var newFirstTrainTime = childSnapshot.val().firstTrainTime; 
var splitFirstTrainTime = newFirstTrainTime.split(':');
var firstTrainHour = parseInt(splitFirstTrainTime[0]);
var firstTrainMinutes = parseInt(splitFirstTrainTime[1]);

// console.log("The time of the first train is " + firstTrainHour + ": " + firstTrainMinutes);

});
});