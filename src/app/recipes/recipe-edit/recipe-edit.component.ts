import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params.id;
      this.editMode = params.id != null;
      this.initForm();
    });
  }

  private initForm(): void {
    let recipeName = '';
    let recipeDescription = '';
    let recipeImagePath = '';
    const recipeIngredients =  new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeDescription = recipe.description;
      recipeImagePath = recipe.imagePath;
      if (recipe.ingredients) {
        for (const ingredient of recipe.ingredients) {
          recipeIngredients.push(new FormGroup({
            name: new FormControl(ingredient.name),
            amount: new FormControl(ingredient.amount)
          }));
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName),
      imagePath: new FormControl(recipeImagePath),
      description: new FormControl(recipeDescription),
      ingredients: recipeIngredients
    });
  }

  onSubmit(): void {
    console.log(this.recipeForm);
  }

  onAddIngredient(): void {
    this.controls.push(new FormGroup({
      name: new FormControl(),
      amount: new FormControl()
    }));
  }

  get controls(): AbstractControl[] { // a getter!
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

}
