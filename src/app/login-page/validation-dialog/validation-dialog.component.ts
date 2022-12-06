import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { LoginPageService } from '../login-page.service';

@Component({
  selector: 'app-validation-dialog',
  templateUrl: './validation-dialog.component.html',
  styleUrls: ['./validation-dialog.component.css']
})
export class ValidationDialogComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  validationForm:FormGroup;
  constructor(private fb:FormBuilder, private serviceValidation:LoginPageService, private dialogRef:MatDialogRef<ValidationDialogComponent>, private translate:TranslateService) { }

  ngOnInit(): void {
    this.initValidationForm();

  }

  initValidationForm(){
    this.validationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onValidation(){
    const payload = this.validationForm.value;
    if(this.validationForm.valid){
      this.subs.sink = this.serviceValidation.checkValidation(payload.email).subscribe({
        next: (resp)=>{
          Swal.fire(
            this.translate.instant("validation.success"),
            this.translate.instant("validation.email"),
            'success'
          ).then(()=>{
            let valResp = resp?.data?.getOneUser[0];
            this.dialogRef.close({data:valResp});
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

  onCancel(){
    this.dialogRef.close({data:null});
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
