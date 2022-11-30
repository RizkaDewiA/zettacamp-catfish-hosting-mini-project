import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { LoginPageService } from '../login-page/login-page.service';
import { RegisterPageService } from './register-page.service';
import { UserNameValidator } from './username.validator';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  private subs = new SubSink();
  registerreload:boolean = true;
  registerForm: FormGroup;
  hide:boolean = true;
  currentLanguage = 'en';
  srcImages: string = 'https://cdn-icons-png.flaticon.com/512/323/323329.png';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private serviceRegister: RegisterPageService,
    private translate: TranslateService
  ) { 
    translate.addLangs(['en', 'id']);
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.registerreload = false;
    }, 500);
    this.initFormGroup();
  }

  initFormGroup(){
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      // userName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8), UserNameValidator.noWhiteSpace]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(8)]]
    })
  }

  onSubmit(){
    const payload = this.registerForm.value;
    if(this.registerForm.valid){
      Swal.fire({
        title: 'Do You Want To Create Account ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, create account '
      }).then((result)=>{
        if(result.isConfirmed){
          this.subs.sink = this.serviceRegister.createNewUser(payload).subscribe({
            next: (resp) => {
              if(resp) {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'You Account Has Been Create, You Can Login Now',
                  showConfirmButton: true,
                }).then(()=>{
                  this.router.navigate(['/login-page']);
                });
              }
            },
            error: (error)=>{
                Swal.fire(
                  'Something Happend!',
                  error.message,
                  'error'
                )
            }
          });
        }
      })
    }
  }

  changeLanguage(lang:any) {
    if (lang === 'en') {
      this.translate.use('id');
      this.currentLanguage = 'id';
      this.srcImages = "https://cdn-icons-png.flaticon.com/512/3053/3053985.png";
    } else {
      this.translate.use('en');
      this.currentLanguage = 'en';
      this.srcImages = "https://cdn-icons-png.flaticon.com/512/323/323329.png";
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
