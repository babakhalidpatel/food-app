import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import { map } from 'rxjs/operators';
import * as RecipeActions from '../recipes/store/recipe.action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent  {

  private subscription : Subscription;
  isAuthenticated = false;
  constructor(private store : Store<fromApp.AppState>){}

  ngOnInit(){
    this.subscription = this.store.select('auth').pipe(map(authState => authState.user)).subscribe(user => {
      this.isAuthenticated = !!user;
      console.log(!user,!!user)
    })
  }

  onSaveData(){
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }

  onFetchData(){
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

  onLogout(){
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
