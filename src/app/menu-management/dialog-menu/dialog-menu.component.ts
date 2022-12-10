import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormArray,FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Menu } from 'src/app/model/menu.model';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { MenuManagementService } from '../menu-management.service';

@Component({
  selector: 'app-dialog-menu',
  templateUrl: './dialog-menu.component.html',
  styleUrls: ['./dialog-menu.component.css'],
})
export class DialogMenuComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  private id: any;
  dataMenu: any;
  addNewMenu: boolean = true;
  formMenu: FormGroup;
  allIngredients: any;
  addDataMenu: boolean = true;
  labelStatus = [
    { value: 'publish', viewValue: 'Publish' },
    { value: 'unpublish', viewValue: 'Unpublish' },
  ];

  tempIngred = []

  constructor(
    private fb: FormBuilder,
    private serviceMenu: MenuManagementService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogMenuComponent>,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.serviceMenu.getAllStock().valueChanges.subscribe((resp) => {
      this.allIngredients = resp?.data;
      this.allIngredients = this.allIngredients?.getAllIngredients?.data;
    });

    this.initForm();
    
  }

  initForm() {
    this.formMenu = this.fb.group({
      recipe_name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(100)]],
      image: [''],
      description: ['', [Validators.required, Validators.minLength(30)]],
      status: ['', [Validators.required]],
      ingredients: this.fb.array([]),
    });

    if (this.data) {
      this.id = this.data;
      this.getOnePatchMenu(this.id);
      this.addNewMenu = false;
    } else {
      this.id == null;
      this.addNewIngredients();
    } 

    this.formMenu.get('ingredients').valueChanges.subscribe((res:any)=>{
      res.forEach((element:any)=>{
        if(element.ingredient_id != "" ){
          this.tempIngred.push(element.ingredient_id);
        }
      });
    });
  }

  getOnePatchMenu(id: Menu) {
    this.subs.sink = this.serviceMenu.getOneMenu(id).subscribe((resp) => {
      this.dataMenu = resp.data.getOneRecipes;

      const ingred = this.dataMenu?.ingredients.length;

      for (let i = 0; i < ingred; i++) {
        this.addNewIngredients();
      }

      let tempIngredId = [];

      this.dataMenu.ingredients.forEach((ingre) => {
        tempIngredId.push({
          ingredient_id: ingre.ingredient_id.id,
          stock_used: ingre.stock_used,
        });
      });

      let tempMenu = {
        ...this.dataMenu,
        ingredients: tempIngredId,
      };

      this.formMenu.patchValue(tempMenu);
    });
  }

  get ingredientss(): FormArray {
    return this.formMenu.get('ingredients') as FormArray;
  }

  newIngredients(): FormGroup {
    return this.fb.group({
      ingredient_id: ['', [Validators.required]],
      stock_used: ['', [Validators.required, Validators.min(1)]],
    });
  }

  addNewIngredients() {
    this.ingredientss.push(this.newIngredients());
  }

  onSubmit() {
    const recipes = this.formMenu.value;
    if (this.id) {
      if (this.formMenu.valid) {
        this.subs.sink = this.serviceMenu
          .updateMenu(this.id, recipes)
          .subscribe({
            next: () => {
              Swal.fire({
                title: this.translate.instant('menu-update.title'),
                text: this.translate.instant('menu-update.text'),
                icon: 'success',
                confirmButtonText: this.translate.instant(
                  'menu-update.confrim-btn'
                ),
              }).then(() => {
                this.dialogRef.close();
              });
            },
            error: (error) => {
              if (error.message) {
                Swal.fire({
                  title: this.translate.instant('alert-error.title'),
                  text: error.message,
                  icon: 'error',
                  confirmButtonText: this.translate.instant(
                    'alert-error.confrim-btn'
                  ),
                });
              }
            },
          });
      } else {
        Swal.fire({
          title: this.translate.instant('menu-invalid.title'),
          text: this.translate.instant('menu-invalid.text'),
          icon: 'error',
          confirmButtonText: this.translate.instant('menu-invalid.confrim-btn'),
        });
      }
    } else {
      if (this.formMenu.valid) {
        this.subs.sink = this.subs.sink = this.serviceMenu
          .createNewMenu(recipes)
          .subscribe({
            next: () => {
              Swal.fire({
                title: this.translate.instant('menu-added.title'),
                text: this.translate.instant('menu-added.text'),
                icon: 'success',
                confirmButtonText: this.translate.instant(
                  'menu-added.confrim-btn'
                ),
              }).then(() => {
                this.dialogRef.close();
              });
            },
            error: (error) => {
              if (error.message) {
                Swal.fire({
                  title: this.translate.instant('alert-error.title'),
                  text: error.message,
                  icon: 'error',
                  confirmButtonText: this.translate.instant(
                    'alert-error.confrim-btn'
                  ),
                });
              }
            },
          });
      } else {
        Swal.fire({
          title: this.translate.instant('menu-invalid.title'),
          text: this.translate.instant('menu-invalid.text'),
          icon: 'error',
          confirmButtonText: this.translate.instant('menu-invalid.confrim-btn'),
        });
      }
    }
  }

  deleteIngred(i: number) {
    this.ingredientss.removeAt(i);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
