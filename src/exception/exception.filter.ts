import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { EntityNotFoundError, TypeORMError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const status = exception instanceof HttpException ? exception.getStatus() : 500;
    let status;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else if (exception instanceof TypeORMError) {
      status = 404;
    }

    let message;
    if (exception instanceof TypeORMError) {
      if (exception instanceof EntityNotFoundError) {
        message = { message: '존재하지 않는 entity입니다' };
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    } else {
      message = 'Internal server error';
    }
    // message = exception instanceof Error ? exception.message : 'Internal server error';

    // 로깅
    this.logger.error(exception);

    response.status(status).json(message);
  }
}
