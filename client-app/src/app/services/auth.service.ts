import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginDto } from '../components/model/login-dto';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
import { LoginHttpResponse } from '../model/login-http-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: BehaviorSubject<LoginHttpResponse>;
  private isLogged = new EventEmitter<boolean>();

  constructor(private apiService: ApiService) {

    const token = sessionStorage.getItem('token');
    const id = sessionStorage.getItem('id');

    if (token && id)
      this.user = new BehaviorSubject<LoginHttpResponse>({ token: token, id: +id });
    else
      this.user = new BehaviorSubject<LoginHttpResponse>({ token: null, id: null });

  }

  public getAuthStatus$(): Observable<boolean> {
    return this.isLogged;
  }

  public logIn(login: string, pass: string): Observable<LoginHttpResponse> {
    const httpBody = new LoginDto(login, pass);
    return this.apiService.post<LoginHttpResponse>('auth', httpBody)
      .pipe(
        map((data: LoginHttpResponse) => {
          if (data) {
            if (data.token && data.id) {
              this.user.next({ token: data.token, id: data.id });
              sessionStorage.setItem('token', data.token);
              sessionStorage.setItem('id', data.id.toString());
              this.isLogged.emit(true);
            }
          }
          return data;
        })
      );
  }

  public SendCodeToPhone(phoneNumber: string): Observable<any> {
    const httpBody = {
      phone: phoneNumber
    };
    return this.apiService.post<LoginHttpResponse>('auth/send-sms', httpBody);
  }

  public logInByPhone(phoneNumber: string, phoneCode: string): Observable<LoginHttpResponse> {
    const httpBody = {
      phone: phoneNumber,
      code: phoneCode
    };
    return this.apiService.post<LoginHttpResponse>('auth/check-sms', httpBody)
      .pipe(
        map((data: LoginHttpResponse) => {
          if (data) {
            if (data.token && data.id) {
              this.user.next({ token: data.token, id: data.id });
              sessionStorage.setItem('token', data.token);
              sessionStorage.setItem('id', data.id.toString());
            }
          }
          return data;
        })
      );
  }

  public logOut() {
    this.user = new BehaviorSubject<LoginHttpResponse>({ token: null, id: null });
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('id');
    this.isLogged.emit(false);
  }

  public getAuthorizationToken(): string | null {
    return this.user.getValue().token;
  }

  public checkLogIn(): boolean {
    return !!this.user.getValue().token;
  }

  public getUserId(): number {
    const id = sessionStorage.getItem('id');
    if (id)
      return +id
    return -1;
  }

}
