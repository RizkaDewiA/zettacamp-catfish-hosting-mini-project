import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { RegisterPageService } from './register-page.service';

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
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(8)]]
    })
  }

  onSubmit(){
    const payload = this.registerForm.value;
    if(this.registerForm.valid){
      Swal.fire({
        title: this.translate.instant("register.title-1"),
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: this.translate.instant("cart-dialog.cancel-btn"),
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.translate.instant("register.confrim-btn")
      }).then((result)=>{
        if(result.isConfirmed){
          this.subs.sink = this.serviceRegister.createNewUser(payload).subscribe({
            next: (resp) => {
              if(resp) {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.translate.instant("register.title-2"),
                  showConfirmButton: true,
                }).then(()=>{
                  this.router.navigate(['/login-page']);
                });
              }
            },
            error: (error)=>{
                Swal.fire(
                  this.translate.instant("other.text-2"),
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
