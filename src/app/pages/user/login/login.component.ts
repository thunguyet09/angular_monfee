import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { API } from 'src/app/api/api.service';
import { TokenResetPasswordService } from 'src/app/services/token_reset_password.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  constructor(private api: API, private router: Router,
    private tokenResetPaswordService: TokenResetPasswordService){
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, this.emailValidator]),
      password: new FormControl('', [Validators.required]),
    });
  }

  emailValidator(control: any) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(control.value)) {
      return { email: true };
    }
    return null;
  }

  getEmailControl() {
    return this.loginForm.get('email');
  }

  wrongPassword = false;
  handleSubmit(){
    this.api.postLogin(this.loginForm.value).subscribe((data:any) => {
      localStorage.setItem('user', JSON.stringify(data))
      this.tokenResetPaswordService.setToken(data.access_token)
      this.tokenResetPaswordService.setRefreshToken(data.refresh_token)
      setTimeout(() => {
        this.router.navigate(['/'])
      }, 2000)
    },
    (error: any) => {
      if(error.status == 400){
        this.wrongPassword = true;
      }
    }
    )
  }

  emailField(event: Event){
    const target = event.target as HTMLInputElement
    this.loginForm.patchValue({
      'email': target.value
    })
  }

  passwordField(event: Event){
    const target = event.target as HTMLInputElement
    this.loginForm.patchValue({
      'password': target.value
    })
  }
}
