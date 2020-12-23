import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService) {}

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) { return; }
    const { email, password } = form.value;
    this.isLoading = true;
    if (this.isLoginMode) {

    } else {
      this.authService
        .signUp(email, password)
        .subscribe(response => {
          console.log(response);
          this.isLoading = false;
        }, error => {
          console.error(error);
          this.error = 'An error occured';
          this.isLoading = false;
        });
    }

    form.reset();
  }

}
