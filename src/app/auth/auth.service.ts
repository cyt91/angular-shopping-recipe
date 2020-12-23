import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signUp(email: string, password: string): Observable<any> {
    return this.http
      .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDNExxAuQ4Fez4IpaIYBZixeC8OE0DubT8',
        {
          email,
          password,
          returnSecureToken: true
        }
      ).pipe(catchError(errorRes => {
        let errorMsg = 'An unknown error has occured.';
        if (!errorRes.error?.error) {
          return throwError(errorMsg);
        }
        switch (errorRes.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMsg = 'This email already exists.';
            break;

          case 'OPERATION_NOT_ALLOWED':
            errorMsg = 'Password sign in is disabled.';
            break;

          case 'TOO_MANY_ATTEMPTS_TRY_LATER':
            errorMsg = 'Try again later. Too many attempts to sign up.';
            break;

          default:
            break;
        }
        return throwError(errorMsg);
      }));
  }
}
