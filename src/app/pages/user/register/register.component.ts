import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { API } from 'src/app/api/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm!: FormGroup;

  ngOnInit(){}
  constructor(private api: API) {
    this.registerForm = new FormGroup({
      full_name: new FormControl('', [Validators.required, Validators.maxLength(15)]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirm_password: new FormControl('', [Validators.required]),
      createdDate: new FormControl('')
    });
  }

  passwordField(event: Event){
    const target = event.target as HTMLInputElement
    this.registerForm.patchValue({
      'password': target.value
    })
  }

  usernameField(event: Event){
    const target = event.target as HTMLInputElement
    this.registerForm.patchValue({
      'full_name': target.value
    })
  }

  emailField(event: Event){
    const target = event.target as HTMLInputElement
    this.registerForm.patchValue({
      'email': target.value
    })
  }

  public confirmPasswordChecked = true;
  confirmPasswordField(event: Event){
    const target = event.target as HTMLInputElement
    this.registerForm.patchValue({
      'confirm_password': target.value
    })

    const password = this.registerForm.get('password')?.value
    const confirm_password = this.registerForm.get('confirm_password')?.value
    if(password !== confirm_password){
      this.confirmPasswordChecked = false;
    }else{
      this.confirmPasswordChecked = true;
    }
  }

  handleSubmit(){
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    const day = currentDate.getDate()
    const hour = currentDate.getHours()
    const minute = currentDate.getMinutes()
    let formatDate:string;
    if(minute < 10 && hour < 10){
        formatDate = year + '-' + month + '-' + day + " " + "0" + hour + ":" + "0" + minute
    }else if(hour < 10){
        formatDate = year + '-' + month + '-' + day + " " + "0"+ hour + ":" + minute
    }else if(minute < 10){
        formatDate = year + '-' + month + '-' + day  + " " + hour + ":" + "0" + minute
    }else{
        formatDate = year + "-" + month + "-" + day + " " + hour + ":" + minute
    }
    this.registerForm.patchValue({
      'createdDate': formatDate
    })
    if(this.confirmPasswordChecked){
      this.api.postRegister(this.registerForm.value).subscribe((res:any) => {
        const dialog_content = document.getElementById('dialogContent') as HTMLElement
        const dialogText = document.querySelector('.dialogText') as HTMLElement
        const dialogIcon = document.querySelector('#dialogContent > span') as HTMLElement
        dialog_content.style.display = 'flex'
        dialog_content.style.backgroundColor = '#6B8A47'
        dialogText.textContent = 'Đăng kí thành công'
        dialogIcon.innerHTML = `<span class="material-symbols-outlined">check</span>`
        setTimeout(() => {
          dialog_content.style.display = 'none'
        }, 2000)
      })
    }else{
      console.log('false')
    }
  }
}
