import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { LoadingSpinner } from './loading-spinner/loading-spinner.component';
import { PlaceHolderDirective } from './placeholder/placeholder.directive';
import { DropdownDirective } from './dropdown.directive';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations : [
        AlertComponent,
        LoadingSpinner,
        PlaceHolderDirective,
        DropdownDirective
    ],

    imports :[CommonModule],
    exports : [
        AlertComponent,
        LoadingSpinner,
        PlaceHolderDirective,
        DropdownDirective,
        CommonModule
    ]
    
})
export class SharedModule{

}