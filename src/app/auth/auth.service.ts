import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { removeSummaryDuplicates } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new Subject<User>();

  constructor(private http: HttpClient) { }

  signUp(email: string, password: string): Observable<any> {
    return this.http
      .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDNExxAuQ4Fez4IpaIYBZixeC8OE0DubT8',
        {
          email,
          password,
          returnSecureToken: true
        }
      ).pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            resData.expiresIn * 1
          );
        })
      );
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDNExxAuQ4Fez4IpaIYBZixeC8OE0DubT8',
        {
          email,
          password,
          returnSecureToken: true
        }
      ).pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            resData.expiresIn * 1
          );
        })
      );
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number): void {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000 );
    const user = new User(
      email,
      userId,
      token,
      expirationDate
    );
    this.user.next(user);
  }

  private handleError(errorRes: HttpErrorResponse): Observable<any> {
    let errorMsg = 'An unknown error has occured.';
    if (!errorRes.error?.error) {
      return throwError(errorMsg);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_NOT_FOUND':
        errorMsg = 'This email does not exist.';
        break;

      case 'INVALID_PASSWORD':
        errorMsg = 'Password is incorrect.';
        break;

      case 'USER_DISABLED':
        errorMsg = 'This account has been disabled.';
        break;

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
  }
}
