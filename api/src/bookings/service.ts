import { v4 as uuidv4 } from 'uuid'; 
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { BookingRepository } from './repository';
import { ApiSuccessResponse, BookingDTO } from './dto';
import { ErrorHandler } from './helpers';

export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly errorHandler: ErrorHandler
) {}
  
  public async getBookings(): Promise<ApiSuccessResponse<BookingDTO[] | BookingDTO>> {
    try {
        const response: ApiSuccessResponse<BookingDTO[]> = {
            code: StatusCodes.OK,
            data: [],
            message: ReasonPhrases.OK
        };

        const bookingsFound =  await this.bookingRepository.getBookings();
        if(!bookingsFound || !bookingsFound.length) {
            response.code = StatusCodes.NOT_FOUND;
            response.data = [];
            response.message = ReasonPhrases.NOT_FOUND;
            throw new Error(JSON.stringify(response));
        } else {
            response.data = bookingsFound;
        }

        return response;
    } catch (error) {
      return this.errorHandler.handleError(error);
    }
  }

  public async createBooking(booking: BookingDTO): Promise<ApiSuccessResponse<BookingDTO[] | BookingDTO>> {
    try {
      const bookings = await this.bookingRepository.getBookings();

      const conflictingBookings = bookings.filter((currentBooking) => 
        new Date(booking.startTime) < new Date(currentBooking.endTime) &&
        new Date(booking.endTime) > new Date(currentBooking.startTime)
      );
      
      if (conflictingBookings.length > 0) {
        throw new Error(JSON.stringify({
            code: StatusCodes.BAD_REQUEST,
            data: conflictingBookings,
            message: 'Booking time conflict detected. Please choose another time slot.',
          }));
      }

      const newBooking: BookingDTO = {
        ...booking,
        id: uuidv4()
      };
      bookings.push(newBooking);
      this.bookingRepository.saveBookings(bookings);

      return {
        code: StatusCodes.CREATED,
        data: newBooking,
        message: ReasonPhrases.CREATED,
      };
    } catch (error) {
      return this.errorHandler.handleError(error);
    }
  }
}