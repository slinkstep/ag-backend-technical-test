import {
  Injectable,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FirebaseErrorCode } from '../enums/firebase-error-codes.enum';

@Injectable()
export class FirebaseErrorMapper {
  /**
   * Maps an error code to a NestJS HttpException and throws it.
   * @param errorCode The error code string to map.
   */
  public mapAndThrow(errorCode: string): never {
    switch (errorCode) {
      // Axios/Firebase Authentication Errors
      case FirebaseErrorCode.EMAIL_NOT_FOUND:
        throw new NotFoundException('No user found with the provided email.');
      case FirebaseErrorCode.INVALID_PASSWORD:
        throw new UnauthorizedException('Incorrect password provided.');
      case FirebaseErrorCode.USER_DISABLED:
        throw new ForbiddenException('This user account has been disabled.');
      case FirebaseErrorCode.INVALID_EMAIL:
        throw new BadRequestException('The email address is invalid.');
      case FirebaseErrorCode.OPERATION_NOT_ALLOWED:
        throw new ForbiddenException('Email/password sign-in is disabled.');
      case FirebaseErrorCode.TOO_MANY_ATTEMPTS_TRY_LATER:
        throw new BadRequestException(
          'Too many failed attempts. Please try again later.',
        );
      case FirebaseErrorCode.MISSING_PASSWORD:
        throw new BadRequestException('The password field is missing.');
      case FirebaseErrorCode.MISSING_EMAIL:
        throw new BadRequestException('The email field is missing.');
      case FirebaseErrorCode.INVALID_LOGIN_CREDENTIALS:
        throw new BadRequestException('Invalid login credentials.');
      case FirebaseErrorCode.INVALID_REQUEST:
        throw new BadRequestException('The request is invalid or malformed.');

      // Firebase Admin SDK Errors
      case FirebaseErrorCode.AUTH_EMAIL_ALREADY_EXISTS:
        throw new ConflictException('Email is already registered.');
      case FirebaseErrorCode.AUTH_INVALID_EMAIL:
        throw new BadRequestException('The email address is invalid.');
      case FirebaseErrorCode.AUTH_INVALID_PASSWORD:
        throw new BadRequestException('The password is invalid.');
      case FirebaseErrorCode.AUTH_INVALID_DISPLAY_NAME:
        throw new BadRequestException('The display name is invalid.');
      case FirebaseErrorCode.AUTH_OPERATION_NOT_ALLOWED:
        throw new ForbiddenException(
          'Email/password accounts are not enabled.',
        );
      case FirebaseErrorCode.AUTH_WEAK_PASSWORD:
        throw new BadRequestException('The password is too weak.');
      case FirebaseErrorCode.AUTH_INVALID_UID:
        throw new BadRequestException('The provided UID is invalid.');
      case FirebaseErrorCode.AUTH_UID_ALREADY_EXISTS:
        throw new ConflictException('The UID is already in use.');
      case FirebaseErrorCode.AUTH_INVALID_PROVIDER_ID:
        throw new BadRequestException('The provider ID is invalid.');
      case FirebaseErrorCode.AUTH_MISSING_EMAIL:
        throw new BadRequestException('The email field is missing.');
      case FirebaseErrorCode.AUTH_MISSING_PASSWORD:
        throw new BadRequestException('The password field is missing.');

      // Default case for unknown errors
      default:
        throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }
}
