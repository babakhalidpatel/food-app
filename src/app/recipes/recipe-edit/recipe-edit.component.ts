import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as RecipeActions from '../store/recipe.action';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {

  id : number = 0;
  editMode : boolean = false;
  recipeForm : FormGroup = new FormGroup({});
  private storeSub : Subscription;

  constructor(private route : ActivatedRoute,  private router : Router,
    private store : Store<fromApp.AppState>) { }

  ngOnInit(): void {

    this.route.params.subscribe((param : Params) => {
      this.id = +param['id'];
      this.editMode = param['id'] != null;
      this.initForm();
    })
  }

  private initForm(){

    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);
    if(this.editMode){
      this.storeSub = this.store.select('recipes').pipe(map(recipeState=> {
        return recipeState.recipes.find((recipe,index)=>{
          return this.id == index;
        })
      })).subscribe(recipe => {
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;
        if(recipe['ingredients']){
          for(let ingredient of recipe.ingredients){
            recipeIngredients.push(
              new FormGroup({
                'name' : new FormControl(ingredient.name, Validators.required),
                'amount' : new FormControl(ingredient.amount, 
                  [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
              })
            )
          }
        }
      })
    
    }

    this.recipeForm = new FormGroup({
      'name' : new FormControl(recipeName,Validators.required),
      'imagePath' : new FormControl(recipeImagePath, Validators.required),
      'description' : new FormControl(recipeDescription, Validators.required),
      'ingredients' : recipeIngredients
    })
  }

  onSubmit(){

    if(this.editMode){
      // this.recipeSrc.updateRecipe(this.id,this.recipeForm.value);
      this.store.dispatch(new RecipeActions.UpdateRecipe({index : this.id, newRecipe : this.recipeForm.value}))
    }else{
      // this.recipeSrc.addRecipe(this.recipeForm.value);
      this.store.dispatch(new RecipeActions.AddRecipe(this.recipeForm.value))
    }

    this.onCancel();
  }

  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredients(){
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name' : new FormControl(null, Validators.required),
        'amount' : new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo : this.route})
  }

  onDeleteIngredient(index : number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  ngOnDestroy(){
    if(this.storeSub){
      this.storeSub.unsubscribe();
    }
  }



}
