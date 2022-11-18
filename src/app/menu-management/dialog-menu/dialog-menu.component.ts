import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { MenuManagementService } from '../menu-management.service';

@Component({
  selector: 'app-dialog-menu',
  templateUrl: './dialog-menu.component.html',
  styleUrls: ['./dialog-menu.component.css']
})
export class DialogMenuComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  private id:any;
  dataMenu:any;
  formMenu: FormGroup;
  allIngredients: any;
  addDataMenu:boolean = true;
  labelStatus = [
    { value: 'publish', viewValue: 'Publish' },
    { value: 'unpublish', viewValue: 'Unpublish' },
  ];

  constructor(private fb:FormBuilder, private serviceMenu:MenuManagementService, @Inject(MAT_DIALOG_DATA) public data:any, private dialogRef: MatDialogRef<DialogMenuComponent>) { }

  ngOnInit(): void {
    this.subs.sink = this.serviceMenu.getAllStock().subscribe((resp)=>{
      this.allIngredients = resp.data.getAllIngredients;
      // console.log(this.allIngredients);
    })
    
    this.initForm();
  }

  initForm(){
    this.formMenu = this.fb.group({
      recipe_name: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(1)]],
      image: [''],
      description: [''],
      status: [''],
      ingredients: this.fb.array([]),
    });

    if(this.data){
      this.id = this.data;
      this.getOnePatchMenu(this.id);
    } else {
      this.id == null;
      this.addNewIngredients();
    }
  }

  getOnePatchMenu(id:string){
    this.subs.sink = this.serviceMenu.getOneMenu(id).subscribe((resp)=>{
      this.dataMenu = resp.data.getOneRecipes;
      const ingred = this.dataMenu?.ingredients.length;

      for(let i=0; i<ingred; i++){
        this.addNewIngredients();
      }
      // console.log(this.dataMenu);

      let tempIngredId = [];

      this.dataMenu.ingredients.forEach(ingre => {
        // console.log(ingre);
        tempIngredId.push({
          ingredient_id: ingre.ingredient_id.id, 
          stock_used: ingre.stock_used
        });
      });

      let tempMenu = {
        ...this.dataMenu,
        ingredients : tempIngredId
      };

      // console.log(tempMenu);
      this.formMenu.patchValue(tempMenu);
    });
  }

  get ingredientss(): FormArray{
    return this.formMenu.get('ingredients') as FormArray;
  }

  newIngredients(): FormGroup{
    return this.fb.group({
      ingredient_id: ['', [Validators.required]],
      stock_used: ['', [Validators.required, Validators.min(1)]]
    })
  }

  addNewIngredients(){
    this.ingredientss.push(this.newIngredients());
  }

  onSubmit(){
    const menu = this.formMenu.value;
    if(this.id){
      if(this.formMenu.valid){
        this.subs.sink = this.serviceMenu.updateMenu(this.id, menu.recipe_name, menu.description,menu.image, menu.ingredients, menu.status, menu.recipe).subscribe({
          next:()=>{
            Swal.fire({
              title: "Updated",
              text: "Data Has Been Updated",
              icon: "success",
              confirmButtonText: "Ok"
            }).then(()=>{
              this.serviceMenu.getAllMenu().refetch();
              this.dialogRef.close();
            });
          },
          error:()=>{
            Swal.fire({
              title: "Error!",
              text: "Something Happend!",
              icon: "error",
              confirmButtonText: "OK"
            });
          }
        });
      }else{
        Swal.fire({
          title: "Error!",
          text: "Data Invalid!",
          icon: "error",
          confirmButtonText: "OK"
        });
      };
    }else{
      if(this.formMenu.valid){
        this.subs.sink = this.subs.sink = this.serviceMenu.createNewMenu(menu.recipe_name, menu.description, menu.image,menu.ingredients, menu.status, menu.price).subscribe({
          next:()=>{
            Swal.fire({
              title: "Success",
              text: "Data Has Been Added",
              icon: "success",
              confirmButtonText: "Ok"
            }).then(()=>{
              this.dialogRef.close();
              this.serviceMenu.getAllMenu().refetch();
            });
          },
          error:()=>{
            Swal.fire({
              title: "Error!",
              text: "Something Happend!",
              icon: "error",
              confirmButtonText: "OK"
            });
          }
        });
      }else{
        Swal.fire({
          title: "Error!",
          text: "Data Invalid!",
          icon: "error",
          confirmButtonText: "OK"
        });
      };
    };
  };

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
