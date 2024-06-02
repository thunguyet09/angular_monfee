import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { API } from 'src/app/api/api.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetPasswordForm!: FormGroup;
  constructor(private api: API, private router: Router){
    this.resetPasswordForm = new FormGroup({
      current_password: new FormControl('', [Validators.required]),
      new_password: new FormControl('', [Validators.required]),
      repeat_password: new FormControl('', [Validators.required])
    });
  }

  public user: User[] = []
  ngOnInit(){
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    this.api.getUserByToken(token).subscribe((data:any) => {
      this.user = [data]
    })
  }

  visibility = false;
  handleVisibility(event: Event){
    this.visibility = !this.visibility;
    const target = event.target as HTMLElement
    const parent_element = target.parentNode?.parentNode as HTMLElement
    let input_element = parent_element.childNodes[0] as HTMLInputElement

    if(this.visibility){
      input_element.type = 'text'
      target.innerHTML = `visibility`
    }else{
      input_element.type = 'password'
      target.innerHTML = `<span class="material-symbols-outlined">visibility_off</span>`
    }
  }

  matches = true;
  onCurrentPassword(event: Event){
    const target = event.target as HTMLInputElement

    this.user.forEach((res:any) => {
      const obj = {
        id: res._id,
        password: target.value
      }
      this.api.comparePassword(obj).subscribe(
        (data: any) => {
          if (data.message === 'Password matches!') {
            this.matches = true;
            this.resetPasswordForm.patchValue({
              current_password: obj.password
            });
          }
        },
        (error: any) => {
          if(error.status == 400){
            this.matches = false;
          }
        }
      );
    })
  }

  onNewPassword(event: Event){
    const target = event.target as HTMLInputElement
    this.resetPasswordForm.patchValue({
      'new_password': target.value
    })
  }

  confirmPasswordChecked = true;
  onRepeatPassword(event: Event){
    const newPassword = this.resetPasswordForm.get('new_password')?.value
    const target = event.target as HTMLInputElement
    if(target.value == newPassword){
      this.confirmPasswordChecked = true;
      this.resetPasswordForm.patchValue({
        'repeat_password': target.value
      })
    }else{
      this.confirmPasswordChecked = false;
    }
  }

  handleSubmit(){
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const newPassword = this.resetPasswordForm.get('new_password')?.value
    const obj = {
      password: newPassword
    }
    this.user.forEach((res:any) => {
      if(res.token == token && this.confirmPasswordChecked){
        this.api.newPassword(obj, res._id).subscribe((data:any) => {
          if(data.message == 'Password is changed successfuly'){
            this.api.removeToken(res._id).subscribe((res:any) => {
              this.router.navigate(['/'])
            })
          }
        })
      }
    })
  }
}
