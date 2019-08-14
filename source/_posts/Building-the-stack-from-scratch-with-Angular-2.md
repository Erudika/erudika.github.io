layout: post
title: Building a full stack application from scratch with Angular
date: 2016-06-09 14:37:12
tags: [angular, para, tutorial, typescript]
author: alex@erudika.com
comments: false
img: img7.jpg
---

**UPDATE:** This article and its associated code have been updated for Angular 8.x. The same article is also [available for React](http://www.erudika.com/blog/2019/08/14/Building-a-full-stack-application-from-scratch-with-React/).

In this tutorial we're going to build a simple single-page application with **Angular** (v8 and above). This is intended
for developers unfamiliar with the new framework or having some experience with AngularJS. First of all, I got
**Visual Studio Code** installed on my machine and it's running on Linux. I chose VS Code because we'll be working with
**TypeScript** mostly and it has great support for it, but you can code in your favourite IDE as well.
Originally, the code in this article was based on the excellent Angular 2 Seed project by [Minko Gechev](https://github.com/mgechev)
That project is now deprecated in favor of Angular CLI and the code here has been migrated to use the new official build
tool for Angular. You'll also need to have **Git**, **Node.js** and **npm** installed.

<!-- more -->

![](https://erudika.com/assets/img/blogpost_media5.png)

## Step 0 (frontend)

- Get [Visual Studio Code](https://code.visualstudio.com/Download)
- Get [Git](https://git-scm.com/downloads)
- Get [Node.js with npm](https://nodejs.org/en/download/)
- Install ['Angular CLI'](https://cli.angular.io/) with `npm install -g @angular/cli`
- Open the project in the VS Code editor

```bash
npm install -g @angular/cli
ng new angular-para
cd angular-para
# install the project's dependencies
npm install
# watches your files and does live reload
ng serve
```

Next - **the backend**. Here, I could write a simple backend in Node.js and Express but I'm lazy so I chose not to.
Instead, I'm going to use **Para** for my backend and I'm not going to write *any* code on the server. If you are
new to Para, it's a general-purpose backend framework/server written in Java. It will save me a lot of time and effort
because it has a nice JSON API for our app to connect to. To run the server you're going to need a Java runtime.

## Step 0 (backend)

- Get [Java](https://jdk.java.net/12/)
- Get [Para](https://paraio.org/)
- Start the server in a separate terminal:

```bash
# run Para
java -jar para-x.y.z.jar
```

Now, check if Para is running - open your browser and go to `http://localhost:8080/v1`. You should see a response like
this:

```json
{
  "info" : "Para - a backend for busy developers.",
  "version" : "x.y.z"
}
```
We haven't got access keys to the server yet, so let's go ahead and do that, open:
```
http://localhost:8080/v1/_setup
```
Save the credentials to a file, we'll need them later to access the backend API.

## Step 1 - API access

Let's create an app for storing recipes - a recipe manager. Our goal will be to build just the basic CRUD functionality,
without adding extra features like authentication and login pages. By default the backend is secured and only signed
requests are allowed, but for the purpose of this tutorial we're going to add a new permission to allow all requests to
just one specific resource - `/v1/recipes`.

Go to [console.paraio.org](https://console.paraio.org) and enter the credentials that you saved in the beginning. Also
click the cog icon to edit the API endpoint and set it to `http://localhost:8080`. Click 'Connect'.

Next, go to 'App' on the left and edit the root app called `para`. You'll see a section for resource permissions and
there you will write a simple permission definition in JSON:

```json
{
  "*": {
    "recipes": ["*", "?"]
  }
}
```

This defines a single permission that allows `* - everyone` to access `/v1/recipes` using a list of allowed methods,
in this case `* - all HTTP methods` and `? - anonymous access` is allowed. Thus, we're essentially making this resource
publicly available. Click 'Save Changes'.

![](https://erudika.com/assets/img/rman_1.png)

## Step 2 - CRUD recipes

Let's create a new frontend component called "home" with the command `ng generate component home`.
Now let's edit the 'home' component under `src/app/home`. In particular, we want to edit the HTML code in `home.component.html`:

```html
<h1>My Recipes &nbsp; <button (click)="newRecipeForm()">Add</button></h1>
<div>
  <form (submit)="search()">
    <input type="text" [(ngModel)]="q" name="searchText" placeholder="Search">
  </form>
</div>
<ul>
	<!-- TODO: add box showing "no recipes found" -->
  <li *ngFor="let recipe of recipesList; let i = index" class="recipe-box">
    <div [hidden]="editedRecipes.get(recipe.id) || (!recipe.id && createMode)">
      <h3>{{recipe.name}}</h3>
      <hr>
      <div [innerHTML]="md2html(recipe.text)"></div>
      <br>
      <button href="#" (click)="editRecipe(recipe)">edit</button> &nbsp;
      <a href="#" (click)="removeRecipe(recipe.id)" class="red right">remove</a>
    </div>
    <div [hidden]="(recipe.id || !createMode) && !editedRecipes.get(recipe.id)">
      <form (submit)="addRecipe(recipe)">
        <div>
          <input [(ngModel)]="recipe.name" placeholder="Title" [name]="'name' + i">
        </div>
        <br>
        <div>
          <textarea [(ngModel)]="recipe.text" rows="10" cols="33" placeholder="Recipe" [name]="'text' + i"></textarea>
        </div>
        <button type="submit">
          <span *ngIf="createMode">Add</span>
          <span *ngIf="!createMode">Save</span>
        </button>
        &nbsp;
        <a href="#" (click)="closeForm(recipe.id)">Close</a>
      </form>
    </div>
  </li>
</ul>
```

I've added the "Add" button which shows the form where we can write a recipe (controlled by `newRecipeForm()`), a textarea,
and a close button. Notice how the text value of the "Add" button changes to "Save" when we're in edit mode. Coming
from AngularJS, you'll notice the weird `[(ngModel)]` syntax - it's a two-way binding (single brackets is one-way).
Similarly, `*ngIf` is just shorthand for `[ngIf]`.

Let's create a new "core" module and 2 new components inside it - the "toolbar" and "navbar".
```
ng generate module core
ng generate component core/toolbar
ng generate component core/navbar
```

Also, I chose to set a new title in the header section in `src/app/core/toolbar/toolbar.component.html`:
```html
<h1>Recipe Manager <code><small>v{{version}}</small></code></h1>
<div class="more"></div>
```

Let's create a new service to talk to our Para backend and fetch recipes. Let's call it `RecipesService`.
```
ng generate service recipe
```
The service file should be located in `src/app/recipe.service.ts`. We'll modify the file `recipe.service.ts` to allow for
another parameter `text` in the `add()` method. Let's also add the code for making the `POST` request to the backend:

```ts
import { environment as Config } from 'src/environments/environment';

@Injectable()
export class RecipeService {
	private appID = 'app:myapp';
	private RECIPES_RESOURCE = Config.API + '/v1/recipes';

	add(name: string, text: string) {
		if (!name || !text) { return of(null); }
		const recipe: any = { name: name, text: text };
		return this.http.post(this.RECIPES_RESOURCE, JSON.stringify(recipe), this.options);
	}
}
```
The `Config` object is actually imported from `src/environments/environment.ts` where we have a JS object containing all
the configuration properties for our project. That file replaced with `environment.prod.ts` when we compile the project
for production use.

In the code for `home.component.ts` we'll add a few fields to manage the recipes. The start of that component should look
like this:

```ts
@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit {
  recipesList: Array<any>;
  createMode = false;
  q: string;
  editedRecipes: Map<string, boolean>;

  constructor(public recipeService: RecipeService) {
    this.editedRecipes = new Map<string, boolean>();
    this.recipesList = new Array();
  }

  addRecipe(): boolean { }
}
```

Now we're going to focus on that `addRecipe()` method so let's implement it:

```ts
addRecipe(recipe: any) {
	this.recipeService.add(recipe.name, recipe.text)
		.subscribe((data: any) => {
			if (data) {
				if (this.createMode) {
					const first = this.recipesList.shift();
					this.recipesList.unshift(data);
					this.recipesList.unshift(first);
				} else {
					this.recipesList.unshift(data);
				}
			}
		});
	this.closeForm(recipe.id);
}
```
Let's also add the method for listing recipes `listRecipes()` and call it upon initialization:

```ts
ngOnInit() {
	this.listRecipes();
}

listRecipes() {
	this.recipeService.get()
		.subscribe((data: any) => {
			this.recipesList = data.items;
		});
}
```

You'll notice that in `home.component.ts`, we subscribe to the `Observable` returned by
`recipeService.add()` and get back the list of recipes when they arrive.
```ts
this.recipeService.add(this.newName, this.newRecipe).subscribe((data: any) => {
    // response might be null or empty
    if (data) {
        this.recipesList.unshift(data);
    }
});
```

In `home.component.html` we loop over the `recipesList` of all available recipes, and also a box which appears
when there are no recipes to show:
```html
<ul>
  <div class="empty-box" *ngIf="recipesList && recipesList.length == 0">
    No recipes to show.
  </div>
  <li *ngFor="let recipe of recipesList" class="recipe-box">
    ...
  </li>
</ul>
```

Let's add the styling for `.recipe-box` and `.empty-box` later in `home.component.css`:

```css
.recipe-box {
  display: inline-table;
  width: 300px;
  margin: 30px 30px 0 -7px;
  padding: 20px;
  border: 1px solid #106cc8;
}
.empty-box {
  height: 200px;
  width: 100%;
  padding: 1.5em 0 1em 0;
  font-size: 3em;
  color: #ccc;
  border: 3px dashed;
  text-align: center;
}
```
In `src/styles.css` I've also added a few more tweaks to the CSS:
```css
input, textarea {
  border: 1px solid #106cc8;
  font-size: 14px;
  height: 40px;
  outline: none;
  padding: 8px;
}
button {
  background-color: #106cc8;
  border-style: none;
  color: rgba(255, 255, 255, 0.87);
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  height: 40px;
  padding: 8px 18px;
  text-decoration: none;
}
button:hover { background-color: #28739e; }
button.small { font-size: 12px; height: 30px; }
.red { color: indianred; }
.right { float: right; }
.center { text-align: center; }
```

![](https://erudika.com/assets/img/rman_2.png)

So, we should now we able to add recipes and after we click "Add" the form should be cleared and closed.
For this let's add a couple of methods in `home.component.ts` - one to initialize the form and one to reset the
state of the form:
```ts
newRecipeForm() {
	if (!this.createMode) {
		this.recipesList.unshift({name: '', text: ''});
		this.createMode = true;
	}
}

closeForm(recipeId: string) {
	if (recipeId) {
		this.editedRecipes.set(recipeId, false);
	} else if (this.createMode) {
		this.recipesList.shift();
		this.createMode = false;
	}
}
```

![](https://erudika.com/assets/img/rman_3.png)

The variable `recipeId` will keep the value of the `id` when a recipe is being edited. When "Save" is clicked this
`id` is passed to the service and the backend so it won't create a new object, just update an existing one.
We're issuing these requests and we don't care about the results because we can update the UI
instantly, without having to wait for the request to finish.

```ts
editRecipe(recipe: any) {
	this.editedRecipes.set(recipe.id, true);
}

removeRecipe(id: string) {
	this.recipeService.remove(id).subscribe();
	this.recipesList = this.recipesList.filter((el) => el.id !== id);
}
```

Let's also add similar methods in our `RecipeService` for updating and deleting recipes. The methods `editRecipe()` and
`removeRecipe()` are relatively straightforward - when editing, we switch to edit mode and we show the form, when
removing we just filter the array `recipesList` and we discard the deleted recipe if it matches the `id`.

```ts
edit(id: string, name: string, text: string) {
	if (!id) { return of(null); }
	const recipe: any = { name: name, text: text };
	return this.http.patch(this.RECIPES_RESOURCE + '/' + id, JSON.stringify(recipe), this.options);
}

remove(id: string) {
	if (!id) { return of(null); }
	return this.http.delete(this.RECIPES_RESOURCE + '/' + id, this.options);
}
```

In `home.component.ts` we'll modify the code for `addRecipe()` to also edit a recipe when `recipe.id` is set.
```ts
addRecipe(recipe: any) {
	if (recipe && recipe.id) {
		this.recipeService.edit(recipe.id, recipe.name, recipe.text).subscribe();
	} else {
		this.recipeService.add(recipe.name, recipe.text)
			.subscribe((data: any) => {
				if (data) {
					if (this.createMode) {
						const first = this.recipesList.shift();
						this.recipesList.unshift(data);
						this.recipesList.unshift(first);
					} else {
						this.recipesList.unshift(data);
					}
				}
			});
	}
	this.closeForm(recipe.id);
}
```

![](https://erudika.com/assets/img/rman_4.png)

We can now add, edit and remove recipes but they aren't very pretty and the formatting of the text
is lost. In the next step we'll make it possible to write the recipe text in Markdown and then render it in HTML.

## Step 3 - Markdown support

First of all, let's install `showdown` - a nice JavaScript parser for Markdown:
```bash
npm install showdown --save
npm install @types/showdown --save-dev
```
Then we import it in `home.component.ts`:
```
import { Converter } from 'showdown';
```
Finally we'll implement a simple method called `md2html()` which will be used in our template.
```ts
md2html(text: string): string {
	return new Converter().makeHtml(text || '');
}
```
In our HTML template we call it like this:
```html
<div [innerHTML]="md2html(recipe.text)"></div>
```
Now we render the text to HTML on the client and this allows us to write beautiful recipes like this:

![](https://erudika.com/assets/img/rman_5.png)

## Step 4 - Full-text search

The final feature left is the recipe search box. We'll use the built-in full-text search in Para. In `recipe.service.ts`:
```ts
search(q: string) {
	return this.http.get(this.RECIPES_RESOURCE + '?q=' + q, this.options);
}
```
And in `home.component.ts`:
```ts
search(): boolean {
	this.recipeService.search(this.q || '*').subscribe((data: any) => {
		if (data.items) {
			this.recipesList = data.items;
		}
	});
	return false;
}
```
Finally, we add the search box in the template below the heading:
```html
<h1>My Recipes &nbsp; <button (click)="newRecipeForm()">Add</button></h1>
<div>
  <form (submit)="search()">
    <input type="text" [(ngModel)]="q" name="searchText" placeholder="Search">
  </form>
</div>
```

And we're done! Here's final result of our **Recipe Manager**
(check out [the live demo](http://albogdano.github.io/angular2-para/)):

![](https://erudika.com/assets/img/rman_6.png)

## Final touches

You can see the result in your browser by running `ng serve`. Optionally, you can make this web application "progressive"
(PWA) by adding the package `@angular/pwa` with `ng add @angular/pwa`. This will create a `manifest.json` and make the
page available offline. Our code now passes the Lighthouse audit with flying colors!

![](https://erudika.com/assets/img/rman_7.png)

All that is left is to build the project for production and deploy it:
```
ng build --prod --base-href /angular2-para/
# git push origin master
```

## Summary

Learning Angular takes some time as it introduces a lot of architectural changes and new syntax.
Writing in TypeScript feels fresh and more like writing in a modern statically typed language like C# or Java,
rather than a dynamic language like JS. The `import` syntax was a bit hard for me to get used to, especially
with all the different files I had to navigate through. In general, the experience of writing Angular apps with the help
of the new Angular CLI tool is great - the scaffolding just works, the build process is fast and painless,
the TypeScript syntax is clean, the app is well structured and the error messages are clear and understandable.

**Things we did:**

- generated a new project from scratch with Angular CLI
- wrote a few fancy AJAX calls to our backend API
- wired a bunch of simple TypeScript code between a component and a service
- wrote some good old HTML and CSS
- imported an external library with npm an typings

**Things we didn't do:**

- didn't write *any* backend code for CRUD operations on recipes
- didn't define a schema for the "recipe" type on the server side

The complete code for this tutorial is on GitHub at [albogdano/angular2-para](https://github.com/albogdano/angular2-para).
I've deployed the same code to GitHub pages as a [live demo](http://albogdano.github.io/angular2-para/) which
is powered by our [cloud-based Para service](https://paraio.com).

 *Have questions or suggestions? Chat with us [on Gitter](https://gitter.im/Erudika/para)!*

