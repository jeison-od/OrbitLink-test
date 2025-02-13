import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { Router, Request, Response } from 'express';
import { BookingService } from './service';
import { BookingRepository } from './repository';
import { ErrorHandler } from './helpers';

const bookings = Router();
const bookingService = new BookingService(new BookingRepository(), new ErrorHandler());

bookings.get('/', async (req: Request, res: Response) => {
    const response = await bookingService.getBookings();
    res.status(response.code).json( response.code == StatusCodes.OK ? response.data: response);
});

bookings.post('/bookings', async (req: Request, res: Response) => {
  const { meetingName, startTime, endTime } = req.body;
  if (!meetingName || !startTime || !endTime) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Missing required fields' });
  }
  const response = await bookingService.createBooking(req.body);
  res.status(response.code).json( response.code == StatusCodes.OK ? response.data: response);
});

export default bookings;
