import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import admin from 'firebase-admin';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { GlobalLogger } from 'src/logger/global.logger.service';
import { FirebaseErrorMapper } from './firebase.error.map.service';

@Injectable()
export class FirebaseProviderService {
  private firebaseProvider: admin.app.App;
  private initialized = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: GlobalLogger,
    private readonly firebaseErrorMapper: FirebaseErrorMapper,
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

  public getFirestoreAdmin(): typeof admin.firestore {
    return admin.firestore;
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
        this.firebaseErrorMapper.mapAndThrow(error.code);
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

        this.firebaseErrorMapper.mapAndThrow(firebaseErrorMessage);
      }
    }
  }
}
