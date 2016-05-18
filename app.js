var config = require('./config');
var twilio = require('twilio');
client = twilio(config.twilio.accountSid, config.twilio.authToken);

var Firebase = require('firebase');
var firebaseUrl = "https://demokraty.firebaseio.com/polllist";

var express = require('express'),
bodyParser = require('body-parser'),
app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/message', function (req, res) {
    var resp = new twilio.TwimlResponse();

    var response_array = req.body.Body.split("-");
    var received_number = req.body.From;
    var poll_id = response_array[0];
    var vote = response_array[1] - 1;
    var response ="";

    var polllistRef = new Firebase(firebaseUrl + "/" + poll_id);
    polllistRef.once("value", function(snapshot) {
        if (snapshot.val()){
            var received_numbers = snapshot.val().received_numbers || {};
            var number_exists = in_object(received_numbers, received_number);
            if (number_exists) {
                response = "Dude you already voted !!!"
            } else {
                if (snapshot.val().voteoptions[vote]) {
                    var name = snapshot.val().voteoptions[vote];
                    polllistRef.child('received_numbers').push(received_number);
                    polllistRef.child('voteoptions').child(vote).set({'votes': snapshot.val().voteoptions[vote].votes + 1, 'name':name.name })
                    response = "Thank you for you vote."
                } else {
                    response = "Your vote option is invalid."
                }
            }
        } else {
            response = "The voting code is invalid, Please check and retry."
        }
        var resp = new twilio.TwimlResponse();
        resp.message(response);
        res.writeHead(200, {
          'Content-Type':'text/xml'
        });
        res.end(resp.toString());
    });
});

var server = app.listen(3002, function() {
  console.log('Listening on port %d', server.address().port);
});

function in_object(object, value)
{
    for (var val in object) {
      if (object[val] === value) {
          return true;
      }
    }
    return false;
}

app.get('/', function (req, res) {

    res.send("Wowzaaaaa");
    var firebaseRef = new Firebase(firebaseUrl + "/2190");
    firebaseRef.once("value", function(snapshot) {
      console.log(snapshot.val());
      if (snapshot.val() !== null){
          var received_numbers = snapshot.val().received_numbers || {};
          var response = "";
          var id = "1";
            var number_exists = in_object(received_numbers, "+14023019140");
            if (number_exists) {
                console.log("Dude you already voted");
            } else {
                firebaseRef.child('received_numbers').push("+14023019140")
                firebaseRef.child('voteoptions').child(id).set({'votes': snapshot.val().voteoptions[id].votes + 1 })
                console.log("Thank you for you vote");
                response ="Dude you already voted";
            }
        } else {
            response="You have an incorrect polling code";
            console.log("You have an incorrect polling code")
        }
    });
});
