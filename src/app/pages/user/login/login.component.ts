import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { API } from 'src/app/api/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  constructor(private api: API, private router: Router){
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  wrongPassword = false;
  handleSubmit(){
    this.api.postLogin(this.loginForm.value).subscribe((data:any) => {
      localStorage.setItem('user', JSON.stringify(data))
      const dialog_content = document.getElementById('dialogContent') as HTMLElement
      const dialogText = document.querySelector('.dialogText') as HTMLElement
      const dialogIcon = document.querySelector('#dialogContent > span') as HTMLElement
      dialog_content.style.display = 'flex'
      dialog_content.style.backgroundColor = '#6B8A47'
      dialogText.textContent = 'Login successful'
      dialogIcon.innerHTML = `<span class="material-symbols-outlined">check</span>`
      setTimeout(() => {
        dialog_content.style.display = 'none'
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
