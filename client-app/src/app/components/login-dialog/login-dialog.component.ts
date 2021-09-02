import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CompackToastService, TypeToast } from 'ngx-compack';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  // field login/pass
  public userName: string | undefined;
  public password: string | undefined;
  // field phone/code
  public phoneNumber: string | undefined;
  public phoneCode: string | undefined;
  public isPhoneCorrect: boolean = false;
  // http
  private subAuth: Subscription | null | undefined;
  public authIsChecking = false;

  constructor(
    private cts: CompackToastService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<LoginDialogComponent>) { }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.subAuth) {
      this.subAuth.unsubscribe();
      this.subAuth = null;
    }
  }

  logIn() {
    if (this.userName && this.password && !this.authIsChecking) {
      this.authIsChecking = true;
      this.subAuth = this.authService.logIn(this.userName, this.password)
        .subscribe(
          (data) => {
            if (data) {
              this.cts.emitNotife(TypeToast.Success, 'Успешная авторизация');
              this.dialogRef.close(true);
            }
            else
              this.cts.emitNotife(TypeToast.Error, 'Неверный log/pass');
          },
          error => {
            this.cts.emitNotife(TypeToast.Error, error.error?.message ?? 'ошибка');
            this.authIsChecking = false;
          }
        );
    }
  }

  cLoseDialog() {
    this.dialogRef.close(false);
  }

  public SendCodeToPhone() {
    if (this.phoneNumber)
      this.subAuth = this.authService.SendCodeToPhone(this.phoneNumber)
        .subscribe(
          next => {
            this.isPhoneCorrect = true;
          },
          (error: HttpErrorResponse) => {
            this.cts.emitNotife(TypeToast.Error, error.error?.message ?? 'ошибка');
            this.isPhoneCorrect = false;
          }
        );
  }

  public CheckCode() {
    if (this.phoneNumber && this.phoneCode)
      this.subAuth = this.authService.logInByPhone(this.phoneNumber, this.phoneCode)
        .subscribe(
          (data) => {
            if (data) {
              this.cts.emitNotife(TypeToast.Success, 'Авторизация', 'Успешно');
              this.dialogRef.close(true);
            }
            else
              this.cts.emitNotife(TypeToast.Error, 'Авторизация', 'Неверный код');
          },
          error =>
            this.cts.emitNotife(TypeToast.Error, 'Авторизация', 'Ошибка соединения')
        );
  }

}
