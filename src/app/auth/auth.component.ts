import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component'
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {

    isLoginMode: boolean = true;
    isLoading = false;
    error: string = null;
    subscription: Subscription;
    storeSub : Subscription;
    @ViewChild(PlaceHolderDirective, { static: false }) alertHost: PlaceHolderDirective;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromApp.AppState>) { }

    ngOnInit() {
        this.storeSub = this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;
            if (this.error) {
                this.showErrorAlert(this.error);
            }
        })
    }

    onSwithMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        this.isLoading = true;
        if (!form.valid) {
            return;
        }

        const { email, password } = form.value;

        if (this.isLoginMode) {
            this.store.dispatch(new AuthActions.LoginStart({ email, password }))
        } else {
            this.store.dispatch(new AuthActions.SignUpStart({ email, password }))
        }
        form.reset();

    }

    onHandleError() {
        this.store.dispatch(new AuthActions.ClearError());
    }

    private showErrorAlert(message: string) {
        // const alertCmp = new AlertComponent();
        const alertCompFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();

        const componentRef = hostViewContainerRef.createComponent(alertCompFactory);
        componentRef.instance.message = message;
        this.subscription = componentRef.instance.close.subscribe(() => {
            this.subscription.unsubscribe();
            hostViewContainerRef.clear();
        });

    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        if (this.storeSub) {
            this.storeSub.unsubscribe();
        }
    }
}