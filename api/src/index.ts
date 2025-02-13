import cors from 'cors';
import express from 'express';
import bookings from './bookings/controller';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
}));

app.use('', bookings);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
