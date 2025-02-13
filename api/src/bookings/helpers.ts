import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { ApiSuccessResponse, BookingDTO } from './dto';

export class ErrorHandler {

    private isApiSuccessResponse(obj: any): obj is ApiSuccessResponse<BookingDTO[]> {
        return (
          obj &&
          typeof obj.code === 'number' &&
          Array.isArray(obj.data) &&
          typeof obj.message === 'string'
        );
      }

    public handleError<T>(error: unknown): ApiSuccessResponse<BookingDTO[] | BookingDTO> {
        let apiError: ApiSuccessResponse<BookingDTO[] | BookingDTO> | null = null;

        try {
            if (error instanceof Error) {
                const parsedError = JSON.parse(error.message);
                if (this.isApiSuccessResponse(parsedError)) {
                apiError = parsedError;
                }
                return parsedError;
            }
            return {
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                data: [],
                message: ReasonPhrases.INTERNAL_SERVER_ERROR
            }
        } catch (parseError) {
            return {
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                data: [],
                message: ReasonPhrases.INTERNAL_SERVER_ERROR
            }
        }
    } 

}