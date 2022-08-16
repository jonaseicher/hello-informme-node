import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { io } from 'socket.io-client';

const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();
app.use(cors());

const socketListener = new Server(createServer(app));

socketListener.on('connection', (x) => {
  console.log('socketListener.connection:', x);
});

socketListener.on('event', (x) => {
  console.log('socketListener.event:', x);
});

socketListener.on('disconnect', (x) => {
  console.log('socketListener.disconnect:', x);
});

// socketListener.listen(10300);
socketListener.listen(5000);

// const mdmSocket = io('10.160.1.35:5000');
const adtSocket = io('127.0.0.1:10300');

const adt1 =
  'MSH|^~&|medavis RIS|MEDAVIS|PIM|PIM|20220815092229||ADT^A01|99224|P|2.5|||AL|NE||8859/1\nSFT|medavis\nEVN|A01|20220815092229||||20220815092225\nPID|1|666666823^^^MEDAVIS^PI|666666823^^^MEDAVIS^PI||Test^Test||20000101|M|||^^^^^D|||||||||||||||||||N\nPV1|1\nIN1\nIN2|||||O';

adtSocket.emit('ADTMsg', adt1);

// Logging
app.use(
  morgan('short', {
    stream: {
      write(str) {
        console.log(str);
      },
    },
  })
);

// handle requests with content-type: application/json and parse body as json
app.use(express.json());

app.get('/info', (req, res) => {
  res.send('hello from node');
});
// Register endpoints
// routes.registerWith(app);

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Starting server at ${HOST}:${PORT}`);
});
