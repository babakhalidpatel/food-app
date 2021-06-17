import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {

  ingredients : Observable<{ingredients : Ingredient[]}>;
  private subscription : Subscription = new Subscription();


  constructor(
    private store : Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.shoppingListService.getIngredients();
    // this.subscription = this.shoppingListService.ingredientsChanged.subscribe((ingredient : Ingredient[]) => {
    //   this.ingredients = ingredient;
    // })
  }

  onEditItem(index : number){
    // this.shoppingListService.startedEditing.next(index);

    this.store.dispatch(new ShoppingListActions.StartEdit(index))
  }

  ngOnDestroy(){
    // this.subscription.unsubscribe();
  }


}
