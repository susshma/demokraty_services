var ACCOUNTSID = 'ACad93f3fb907e8978c8b9566958af559e';
var AUTHTOKEN = "c9660377f6bb1fbc20f91b8b830fa51f";
var twilio = require('twilio'),
client = twilio(ACCOUNTSID, AUTHTOKEN);

var Firebase = require('firebase');
var firebaseUrl = "https://demokraty.firebaseio.com/polllist";
usersRef = new Firebase(firebaseUrl);

  // client.sendMessage({
  //     to:'+14023019137',
  //     from:'+14024014879',
  //     body:'Supppp!!!!' },
  //   function( err, data ) {
  //       console.log(err)
  //   });

var express = require('express'),
bodyParser = require('body-parser'),
app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {

    function in_object(object, value)
    {
        for (var val in object) {
          if (object[val] === value) {
              return true;
          }
        }
        return false;
    }

    res.send("Wowzaaaaa");
    var firebaseRef = new Firebase(firebaseUrl + "/AJS77");
    //console.log(firebaseRef.child('name'));
    // var response = "tes";

    firebaseRef.once("value", function(snapshot) {
      console.log(snapshot);
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
    });
});

app.post('/message', function (req, res) {
    var resp = new twilio.TwimlResponse();
    console.log(req.body.Body);
    console.log(req.body.From);
    var response_array = req.body.Body.split("-");
    var received_number = req.body.From;
    var poll_id = response_array[0];
    var vote = response_array[1] - 1;
    var response ="";

    var polllistRef = new Firebase(firebaseUrl + "/" + poll_id);
    polllistRef.once("value", function(snapshot) {
      var received_numbers = snapshot.val().received_numbers || {};
        var number_exists = in_object(received_numbers, received_number);
        if (number_exists) {
            response = "Dude you already voted !!!"
        } else {
            polllistRef.child('received_numbers').push(received_number);
            polllistRef.child('voteoptions').child(vote).set({'votes': snapshot.val().voteoptions[vote].votes + 1 })
            response = "Thank you for you vote."
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


// Download the Node helper library from twilio.com/docs/node/install
// These vars are your accountSid and authToken from twilio.com/user/account
//
// var client = require('twilio')(accountSid, authToken);
//
// client.messages.list(function(err, data) {
//     data.messages.forEach(function(message) {
//         console.log(message.body);
//     });
// });
