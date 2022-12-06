import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import { LoginPageService } from './login-page.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ValidationDialogComponent } from './validation-dialog/validation-dialog.component';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  loginreload:boolean = true;
  loginForm: FormGroup;
  hide:boolean = true;
  currentLanguage = 'en';
  srcImages: string = 'https://cdn-icons-png.flaticon.com/512/323/323329.png';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private serviceLogin: LoginPageService,
    private translate: TranslateService,
    private dialog:MatDialog
  ) { 
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.loginreload = false;
    }, 500);
    this.initFormGroup();
  }

  initFormGroup(){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(8)]]
    })
  }

  forgotPassword(){
    const dialogRefVal = this.dialog.open(ValidationDialogComponent, {
       width: '400px',
       height: '260px'
    });

    dialogRefVal.afterClosed().subscribe((resp)=>{
      if(resp.data != null){
        this.dialog.open(PasswordDialogComponent, {
          data:resp.data,
          width: '500px',
          height: '350px'
        });
      }
    })
  }

  onSubmit(){
    const payload = this.loginForm.value;
    // console.log(payload.email);
    if(this.loginForm.valid){
      this.subs.sink = this.serviceLogin.loginUser(payload.email, payload.password).subscribe({
        next: (resp) => {
          if(resp) {
            this.router.navigate(['main-page']).then(()=>{
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Welcome Back ' + payload.email.substring(0, payload.email.lastIndexOf("@")).toUpperCase(),
                showConfirmButton: false,
                timer: 1500
              })
            });
          }
        },
        error: (error)=>{
          if(error.message == "user tidak ditemukan atau email salah"){
            Swal.fire(
              'Your Email Not Found',
              'Check Again Your Email',
              'error'
            )
          }else if(error.message == "cek kembali email dan password ada yang salah"){
            Swal.fire(
              'Your Email & Password Wrong',
              'Check Again Your Email & Password',
              'error'
            )
          } else {
            console.log(error.message)
            Swal.fire(
              'Something Happend!',
              error.message,
              'error'
            )
          }
        }
      });
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
