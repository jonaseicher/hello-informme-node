import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

const PORT = 5555;
const HOST = '0.0.0.0';

const app = express();

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

app.use(cors());

app.get('/info', (req, res) => {
  res.send('hello from node');
});

app.get('/api/animals', (req, res) => {
  const voices = ['moo', 'bau'];

  res.json(voices);
});

// Register endpoints
// routes.registerWith(app);

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Starting server at ${HOST}:${PORT}`);
});
