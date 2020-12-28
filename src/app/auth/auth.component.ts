import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) { return; }
    const { email, password } = form.value;
    this.isLoading = true;
    let authObs: Observable<AuthResponseData>;

    authObs = this.isLoginMode ? this.authService.login(email, password) : this.authService.signUp(email, password);

    authObs.subscribe(responseData => {
      console.log(responseData);
      this.isLoading = false;
      this.router.navigate(['./recipes']);
    }, errorMsg => {
      console.error(errorMsg);
      this.error = errorMsg;
      this.isLoading = false;
    });

    form.reset();
  }

  onHandleError(): void {
    this.error = null;
  }

}
