export enum FirebaseErrorCode {
  // Axios/Firebase Authentication Errors
  EMAIL_NOT_FOUND = 'EMAIL_NOT_FOUND',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  USER_DISABLED = 'USER_DISABLED',
  INVALID_EMAIL = 'INVALID_EMAIL',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
  TOO_MANY_ATTEMPTS_TRY_LATER = 'TOO_MANY_ATTEMPTS_TRY_LATER',
  MISSING_PASSWORD = 'MISSING_PASSWORD',
  MISSING_EMAIL = 'MISSING_EMAIL',
  INVALID_LOGIN_CREDENTIALS = 'INVALID_LOGIN_CREDENTIALS',
  INVALID_REQUEST = 'INVALID_REQUEST',

  // Firebase Admin SDK Errors
  AUTH_EMAIL_ALREADY_EXISTS = 'auth/email-already-exists',
  AUTH_INVALID_EMAIL = 'auth/invalid-email',
  AUTH_INVALID_PASSWORD = 'auth/invalid-password',
  AUTH_INVALID_DISPLAY_NAME = 'auth/invalid-display-name',
  AUTH_OPERATION_NOT_ALLOWED = 'auth/operation-not-allowed',
  AUTH_WEAK_PASSWORD = 'auth/weak-password',
  AUTH_INVALID_UID = 'auth/invalid-uid',
  AUTH_UID_ALREADY_EXISTS = 'auth/uid-already-exists',
  AUTH_INVALID_PROVIDER_ID = 'auth/invalid-provider-id',
  AUTH_MISSING_EMAIL = 'auth/missing-email',
  AUTH_MISSING_PASSWORD = 'auth/missing-password',
}
