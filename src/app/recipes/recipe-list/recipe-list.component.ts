import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();
  recipes: Recipe[] = [
    new Recipe('Test Recipe', 'this is a simple test', 'https://www.cookingclassy.com/wp-content/uploads/2019/05/fiesta-rice-recipe-7.jpg'),
    new Recipe('Another Test Recipe', 'this is another simple test', 'https://www.cookingclassy.com/wp-content/uploads/2019/05/fiesta-rice-recipe-7.jpg'),
    new Recipe('Third Test Recipe', 'this is a third test', 'https://www.cookingclassy.com/wp-content/uploads/2019/05/fiesta-rice-recipe-7.jpg')
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onRecipeSelected(recipeElem: Recipe): void {
    this.recipeWasSelected.emit(recipeElem);
  }

}
