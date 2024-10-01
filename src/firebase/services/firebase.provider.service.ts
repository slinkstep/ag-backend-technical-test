import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import admin from 'firebase-admin';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { GlobalLogger } from 'src/logger/global.logger.service';

@Injectable()
export class FirebaseProviderService {
  private firebaseProvider: admin.app.App;
  private initialized = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: GlobalLogger,
  ) {}

  public getFirebase() {
    if (!this.initialized) {
      const credentials = this.configService.get<string>('firebaseCredentials');

      this.firebaseProvider = admin.initializeApp({
        credential: admin.credential.cert(
          JSON.parse(Buffer.from(credentials, 'base64').toString()),
        ),
      });

      this.initialized = true;

      return this.firebaseProvider;
    }

    return this.firebaseProvider;
  }

  public getFirestore(): admin.firestore.Firestore {
    return this.getFirebase().firestore();
  }

  private getFirebaseAuth(): admin.auth.Auth {
    return this.getFirebase().auth();
  }

  public async createUserWithEmailAndPassword(
    email: string,
    password: string,
    displayName: string,
  ): Promise<UserRecord> {
    try {
      const user = await this.getFirebaseAuth().createUser({
        email,
        password,
        displayName,
      });
      this.logger.log(`Firebase user created with UID: ${user.uid}`);
      return user;
    } catch (error) {
      this.logger.error('Failed to create user in auth service', error);

      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-exists':
            throw new ConflictException('Email is already registered.');
          case 'auth/invalid-email':
            throw new BadRequestException('The email address is invalid.');
          case 'auth/invalid-password':
            throw new BadRequestException('The password is invalid.');
          case 'auth/invalid-display-name':
            throw new BadRequestException('The display name is invalid.');
          case 'auth/operation-not-allowed':
            throw new ForbiddenException(
              'Email/password accounts are not enabled.',
            );
          case 'auth/weak-password':
            throw new BadRequestException('The password is too weak.');
          case 'auth/invalid-uid':
            throw new BadRequestException('The provided UID is invalid.');
          case 'auth/uid-already-exists':
            throw new ConflictException('The UID is already in use.');
          case 'auth/invalid-provider-id':
            throw new BadRequestException('The provider ID is invalid.');
          case 'auth/missing-email':
            throw new BadRequestException('The email field is missing.');
          case 'auth/missing-password':
            throw new BadRequestException('The password field is missing.');
          default:
            throw new InternalServerErrorException(
              'An unexpected error occurred while creating the user.',
            );
        }
      }
    }
  }

  public async requestUserPasswordReset(email: string): Promise<string> {
    try {
      return await this.getFirebaseAuth().generatePasswordResetLink(email);
    } catch (error) {
      this.logger.error(
        `Failed to generate password reset: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to generate password reset.',
      );
    }
  }

  public async verifyUserWithEmailAndPassword(email: string, password: string) {
    const firebaseApiKey = this.configService.get<string>('firebaseApiKey');

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`;

    try {
      const response = await axios.post(url, {
        email,
        password,
        returnSecureToken: true,
      });

      return response.data;
    } catch (error) {
      this.logger.error(
        `Firebase signInWithPassword failed for email: ${email}`,
        error.response?.data || error.message,
      );

      if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
        const firebaseErrorMessage = error.response.data.error.message;

        switch (firebaseErrorMessage) {
          case 'EMAIL_NOT_FOUND':
            throw new NotFoundException(
              'No user found with the provided email.',
            );
          case 'INVALID_PASSWORD':
            throw new UnauthorizedException('Incorrect password provided.');
          case 'USER_DISABLED':
            throw new ForbiddenException(
              'This user account has been disabled.',
            );
          case 'INVALID_EMAIL':
            throw new BadRequestException('The email address is invalid.');
          case 'OPERATION_NOT_ALLOWED':
            throw new ForbiddenException('Email/password sign-in is disabled.');
          case 'TOO_MANY_ATTEMPTS_TRY_LATER':
            throw new BadRequestException(
              'Too many failed attempts. Please try again later.',
            );
          case 'MISSING_PASSWORD':
            throw new BadRequestException('The password field is missing.');
          case 'MISSING_EMAIL':
            throw new BadRequestException('The email field is missing.');
          case 'INVALID_LOGIN_CREDENTIALS':
            throw new BadRequestException('Invalid login credentials.');
          case 'INVALID_REQUEST':
            throw new BadRequestException(
              'The request is invalid or malformed.',
            );

          default:
            throw new InternalServerErrorException(
              'An unexpected error occurred during authentication.',
            );
        }
      }
    }
  }
}
