import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { LoginPageService } from '../login-page.service';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.css']
})
export class PasswordDialogComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  hide:boolean = true;
  resetForm: FormGroup;
  constructor(private fb:FormBuilder, private serviceReset: LoginPageService, @Inject(MAT_DIALOG_DATA) private data:any, private dialogRef:MatDialogRef<PasswordDialogComponent>, private translate:TranslateService) { }

  ngOnInit(): void {
    this.initResetForm();
  }

  initResetForm(){
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(8)]]
    });
    this.resetForm.patchValue(this.data);
  }

  resetPassword(){
    const payload = this.resetForm.value;
    if(this.resetForm.valid){
      this.subs.sink = this.serviceReset.resetPassword(payload).subscribe({
        next: ()=>{
          Swal.fire(
            this.translate.instant("validation.success"),
            this.translate.instant("validation.password"),
            'success'
          ).then(()=>{
            this.dialogRef.close();
          })
        },
        error: (error)=>{
          Swal.fire(
            this.translate.instant("validation.error"),
            error.message,
            'error'
          )
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
