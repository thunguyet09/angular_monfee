import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm!: FormGroup;

  ngOnInit(){
  }
  constructor(private formBuilder: FormBuilder) {
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
    console.log(this.registerForm.get('password')?.value);
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

  public confirmPasswordChecked = false;
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
}
