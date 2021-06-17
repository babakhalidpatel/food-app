import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipes.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {

  public recipes: Recipe[];
  subscription = new Subscription();


  constructor(private router : Router,
    private route : ActivatedRoute, private store : Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.store
    .select('recipes')
    .pipe(map(recipeState => recipeState.recipes))
    .subscribe((recipe) => {
      this.recipes = recipe;
    });
  }

  onNewRecipe(){
    this.router.navigate(['new'],{relativeTo : this.route})
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }


}
