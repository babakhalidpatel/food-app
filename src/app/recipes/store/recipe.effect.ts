import { Actions, Effect, ofType } from '@ngrx/effects';

import * as RecipeActions from './recipe.action';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipes.model';
import { Injectable } from '@angular/core';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class RecipeEffect{

    @Effect()
    fetchRecipes = this.action$.pipe(
        ofType(RecipeActions.FETCH_RECIPES),
        switchMap(()=>{
        return this.http
        .get<Recipe[]>(
            'https://recipe-book-by-khalid-default-rtdb.firebaseio.com/recipes.json'
            )
        }),
        map(recipes => {
            return recipes.map(recipe => {
                return { ...recipe, ingredients: recipe?.ingredients ? recipe?.ingredients : [] }
            })
        }),
        map(recipes => {
            return new RecipeActions.SetRecipes(recipes);
        })
    );

    @Effect({dispatch:false})
    storeRecipes = this.action$.pipe(
        ofType(RecipeActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData,recipesState])=>{
            return this.http.put('https://recipe-book-by-khalid-default-rtdb.firebaseio.com/recipes.json',
            recipesState.recipes)
        })
    )





    constructor(private action$:Actions, private http : HttpClient, private store : Store<fromApp.AppState>){}
}