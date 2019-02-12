// Initializing Firebase
var config = {
    apiKey: "AIzaSyA4jsEHUZjkVaugVV-TjylLYIzcbUIlhWw",
    authDomain: "train-scheduler-87aff.firebaseapp.com",
    databaseURL: "https://train-scheduler-87aff.firebaseio.com",
    projectId: "train-scheduler-87aff",
    storageBucket: "",
    messagingSenderId: "264028191849"
  };
  firebase.initializeApp(config);

  var dataRef = firebase.database();

var trainName = "";
var destination = "";
var nextTrainTime = "";
var frequencyMinutes = "";

$("#addTrain").on("click", function(event){
    event.preventDefault();

    trainName = $("#trainName-input").val().trim();
    destination = $("#destination-input").val().trim();
    nextTrainTime = $("#nextTrainTime-input").val().trim();
    frequencyMinutes = $("#frequencyMinutes-input").val().trim();

    console.log("Train Name: " + trainName);
    console.log("Destination: " + destination);
    console.log("Next Train: " , nextTrainTime);
    console.log("Frequency: ", frequencyMinutes);

    dataRef.ref().push({
        trainName: trainName,
        destination: destination,
        nextTrainTime: nextTrainTime,
        frequencyMinutes: frequencyMinutes,
        // dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

dataRef.ref().on("child_added", function(childSnapshot){
    console.log(childSnapshot.val());

    trainName = childSnapshot.val().trainName;
    destination = childSnapshot.val().destination;
    nextTrainTime = childSnapshot.val().nextTrainTime;
    frequencyMinutes = childSnapshot.val().frequencyMinutes;

    var firstTrainTime = moment(nextTrainTime, "HH:mm");
    console.log("time: ", firstTrainTime);

    var currentTime = moment();
    console.log("Time now: ", currentTime);

    var diffTime = currentTime.diff(firstTrainTime, "minutes");
    var tRemainder = diffTime % frequencyMinutes;
    var minutesTillTrain = frequencyMinutes - tRemainder;

    console.log("Minutes: ", diffTime);
    console.log("Minutes to wait: ", tRemainder);
    console.log("Train Arrival in: ", minutesTillTrain);

    var nextArrival = currentTime.add(minutesTillTrain, "minutes");
    var arrivalTime = nextArrival.format("HH:mm");

    console.log("Next Arrival Time: ", nextArrival);
    console.log("Arrival Time: ", arrivalTime);

    $("#newTrain").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequencyMinutes +"</td><td>" + arrivalTime + "</td><td>" + minutesTillTrain + "</td>");
},
    function(errorObject) {
        console.log("Errors handled: ", errorObject.code);
    });


