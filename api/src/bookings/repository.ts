import * as fs from 'fs';
import * as path from 'path';
import { BookingDTO } from './dto';

const BOOKINGS_FILE = path.resolve(__dirname, 'bookings.json');

export class BookingRepository {
  private ensureFileExists(): void {
    if (!fs.existsSync(BOOKINGS_FILE)) {
      fs.writeFileSync(BOOKINGS_FILE, '[]');
    }
  }

  public getBookings(): BookingDTO[] {
    this.ensureFileExists();
    const data = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
    return JSON.parse(data) as BookingDTO[];
  }

  public saveBookings(bookings: BookingDTO[]): void {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
  }
}
