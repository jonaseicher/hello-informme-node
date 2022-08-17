var hl7 = require('simple-hl7');

const sendPort = process.env.SEND_PORT || 10300;
const listenPort = process.env.LISTEN_PORT || 5000;

///////////////////SERVER/////////////////////
var app = hl7.tcp();

app.use(function (req, res, next) {
  //req.msg is the HL7 message
  console.log('****** message received *****');
  console.log(req.msg.log());
  next();
});

app.use(function (req, res, next) {
  //res.ack is the ACK
  //acks are created automatically

  //send the res.ack back
  console.log('****** sending ack *****');
  res.end();
});

app.use(function (err, req, res, next) {
  //error handler
  //standard error middleware would be
  console.log('****** ERROR *****');
  console.log(err);
  var msa = res.ack.getSegment('MSA');
  msa.setField(1, 'AR');
  res.ack.addSegment('ERR', err.message);
  res.end();
});

//Listen on port 7777
app.start(listenPort); //optionally pass encoding here, app.start(1234, 'latin-1');
console.log(`started listening on port ${listenPort}`);
///////////////////SERVER/////////////////////

///////////////////CLIENT/////////////////////
var client = hl7.Server.createTcpClient('localhost', sendPort);

//create a message
var msg = new hl7.Message(
  'EPIC',
  'EPICADT',
  'SMS',
  '199912271408',
  'CHARRIS',
  ['ADT', 'A04'], //This field has 2 components
  '1817457',
  'D',
  '2.5'
);

setInterval(() => {
  console.log(`****** sending ADT message to localhost:${sendPort} *****`);
  client.send(msg, function (err, ack) {
    if (err) {
      console.log('****** error when sending *****');
      console.log(err);
      return;
    }
    console.log('****** ack received *****');
    console.log(ack.log());
  });
}, 5000);
///////////////////CLIENT/////////////////////
