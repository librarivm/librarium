import { Exception } from '@adonisjs/core/exceptions';

export default class InvalidCredentialsException extends Exception {
  static status: number = 401;
  static code: string = 'E_INVALID_CREDENTIALS';
  static message: string = 'Invalid credentials.';
}
