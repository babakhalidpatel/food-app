import { Component, OnInit, Input} from '@angular/core';
import { Recipe } from '../../recipes.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.scss']
})
export class RecipeItemComponent implements OnInit {

  @Input() recipe  = new Recipe('','','',[]);
  @Input() index : number = 0;


  ngOnInit(): void {
  }


}
