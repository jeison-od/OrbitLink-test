import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export interface BookingDTO {
    id: string;
    meetingName: string;
    startTime: string;
    endTime: string;
  }

export interface ApiSuccessResponse <T> {
    code: StatusCodes,
    data: T,
    message: ReasonPhrases
  }