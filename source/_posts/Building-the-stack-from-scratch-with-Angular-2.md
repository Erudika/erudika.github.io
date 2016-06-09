layout: post
title: Building the stack from scratch with Angular 2
date: 2016-06-09 14:37:12
tags: [angular, para, tutorial, typescript]
author: alex@erudika.com
comments: true
img: img7.jpg
---

In this tutorial we're going to build a simple single-page application with **Angualar 2**. This is intended for 
developers unfamiliar with 2 or having some experience with AngularJS 1. First of all, I got **Visual Studio Code** 
installed on my machine and it's running on Linux. I chose VS Code because we'll be working with **TypeScript** 
mostly and it has great support for it, but you can code in your favourite IDE as well. Next, I've decided to save 
some time and clone the excellent Angular 2 starter kit by [Minko Gechev](https://github.com/mgechev) called 
**'angular2-seed'**. For that you'll also need **Git**, **Node.js** and **npm**.

<!-- more -->

![](https://www.erudika.com/assets/img/blogpost_media5.png)

## Step 0 (frontend)

- Get [Visual Studio Code](https://code.visualstudio.com/Download)
- Get [Git](https://git-scm.com/downloads)
- Get [Node.js with npm](https://nodejs.org/en/download/)
- Clone ['angular2-seed'](https://github.com/mgechev/angular2-seed)
- Open the project in the VS Code editor

```bash
git clone --depth 1 https://github.com/mgechev/angular2-seed.git angular2-para
cd angular2-para
# install the project's dependencies
npm install
# watches your files and uses livereload by default
npm start
```

Next - **the backend**. Here, I could write a simple backend in Node.js and Express but I'm lazy so I chose not to.
Instead, I'm going to use **Para** for my backend and I'm not going to write *any* code on the server. If you are 
new to Para, it's a general-purpose backend framework/server written in Java. It will save me a lot of time and effort  
because it has a nice JSON API for our app to connect to. To run the server you're going to need a Java runtime.

## Step 0 (backend)

- Get [Java](http://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html)
- Get [Para](http://www.paraio.org/)
- Start the server in a separate terminal:

```bash
# run Para
java -jar para-x.y.z.war
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

# Step 1 - API access

Let's create an app for storing recipes - a recipe manager. Our goal will be to build just the basic CRUD functionality,
without adding extra features like authentication and login pages. By default the backend is secured and only signed
requests are allowed, but for the purpose of this tutorial we're going to add a new permmission to allow all requests to 
just one specific resource - `/v1/recipes`.

Go to [console.paraio.org](http://console.paraio.org) and enter the credentials that you saved in the beginning. Also
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

![](/assets/img/rman_1.png)

# Step 2 - CRUD recipes

Now let's go back to our frontend and edit the 'Home' component under `src/client/app/+home`. We want to edit the HTML
code a little bit in `home.component.html`:

```html
<h1>My Recipes &nbsp; 
    <button (click)="clearForm() && showForm = true" [hidden]="showForm">Add</button>
</h1>
<form (submit)="addRecipe()" [hidden]="!showForm">
  <div>
    <input [(ngModel)]="newName" placeholder="Title">
  </div>
  <br>
  <div>
    <textarea [(ngModel)]="newRecipe" rows="10" cols="33" placeholder="Recipe"></textarea>
  </div>
  <button type="submit">
    <span *ngIf="editMode">Save</span>
    <span *ngIf="!editMode">Add</span>
  </button>
  &nbsp;
  <a href="#" (click)="showForm = false">Close</a>
</form>
```

I've added the "Add" button which shows the form where we can write a recipe (controlled by `showForm`), a textarea,
and a close button. Notice how the text value of the "Add" button changes to "Save" when we're in edit mode. Coming 
from Angular 1, you'll notice the weird `[(ngModel)]` syntax - it's a two-way binding (single brackets is one-way).
Similarly, `*ngIf` is just shorthand for `[ngIf]`. 

Also, I chose to set a new title in the header section in `src/client/app/shared/toolbar/toolbar.component.html`:
```html
<h1>Recipe Manager <code><small>v1.0.0</small></code></h1>
<more></more>
```

Let's edit the `NameListService` which is part of the starter project and rename it to `RecipesService`. You'll have 
to rename all occurances of the class and also rename the folder `src/client/app/shared/name-list`. In the code for 
`home.component.ts` we'll add a new field `newRecipe: string` to hold the recipe text and the whole this should 
look like this:

```ts
export class HomeComponent {
    newName: string;
    newRecipe: string;
    constructor(public recipeService: RecipeService) {}

    addName(): boolean {
      this.recipeService.add(this.newName);
      this.newName = '';
      return false;
    }
}
```

Now we're going to focus on that `addName()` method. First rename it to `addRecipe()` and include the new field when the
service is called:

```ts
addRecipe(): boolean {
    this.recipeService.add(this.newName, this.newRecipe);
    this.newName = '';
    this.newRecipe = '';
    return false;
}
```
Let's also add the method for listing recipes `listRecipes()` and call it upon initialization:

```ts
ngOnInit() {
    this.listRecipes();
}
listRecipes() {
    this.recipeService.get().subscribe((data:any) => {
        this.recipesList = data.items;
    });
}
```

Now we have to modify the `RecipeService` class to allow for another parameter `text`. Let's also add the code 
for making the `POST` request to the backend: 
```ts
// URL of our public resource '/recipes'
private RECIPES_RESOURCE = "http://localhost:8080/v1/recipes";

add(name: string, text: string): Observable<any> {
    if (!name || !text) { return Observable.of(null); }
    let recipe:any = { name: name, text: text };
    return this.http.post(this.RECIPES_RESOURCE, JSON.stringify(recipe), this.options)
        .map((response: Response) => response.json());
}
```

Going back to the component code in `home.component.ts`, we have to subscribe to the `Observable` returned by 
`recipeService.add()` and get back the list of recipes when they arrive.
```ts
this.recipeService.add(this.newName, this.newRecipe).subscribe((data: any) => {
    // response might be null or empty
    if (data) {
        this.recipesList.unshift(data);
    }
});
```

Finally, we'll add to `home.component.html` the markup for listing all available recipes, and also a box which appears
when there are no recipes to show:
```html
<ul>
  <div class="empty-box" *ngIf="recipesList && recipesList.length == 0" [hidden]="showForm">
    No recipes to show.
  </div>
  <li *ngFor="let recipe of recipesList" class="recipe-box">
    <h3>{{recipe.name}}</h3>
    <hr>
    <div>{{recipe.text}}</div>
    <br>
    <button href="#" (click)="editRecipe(recipe)" class="small">edit</button> &nbsp;
    <a href="#" (click)="removeRecipe(recipe.id)" class="red right">remove</a>
  </li>
</ul>
```

There are two click events here - one for editing and one for deleting recipes. Let's add the styling for 
`.recipe-box` and `.empty-box` later in `home.component.css`:

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
In `main.css` I've also added a few more tweaks to the CSS:
```css
input, textarea {
  border: 1px solid #106cc8;
  font-size: 14px;
  outline: none;
  padding: 8px;
}
button:hover { background-color: #28739e; }
button.small { font-size: 12px; height: 30px; }
.red { color: indianred; }
.right { float: right; }
.center { text-align: center; }
```

![](/assets/img/rman_2.png)

So, we should now we able to add recipes and after we click "Add" the form should be cleared and closed. 
For this let's add the following code in `home.component.ts` to reset the state of the form:
```ts
clearForm(): boolean {
    this.showForm = false;
    this.editMode = false;
    this.recipeId = null;
    this.newName = '';
    this.newRecipe = '';
    return true;
}
```

![](/assets/img/rman_3.png)

The variable `recipeId` will keep the value of the `id` when a recipe is being edited. When "Save" is clicked this
`id` is passed to the service and the backend so it won't create a new object, just update an existing one.
 
Let's add more methods in our `recipeService` for updating and deleting recipes. 
```ts
edit(id: any, name: string, text: string) {
    if (!id) { return; }
    let recipe:any = { name: name, text: text };
    this.http.patch(this.RECIPES_RESOURCE + "/" + id, JSON.stringify(recipe), this.options).toPromise();
}

remove(id: string) {
    if (!id) { return; }
    this.http.delete(this.RECIPES_RESOURCE + "/" + id, this.options).toPromise();
}
```

Nothing special here, except the `.toPromise()` in the end which converts an `Observable` to `Promise` and executes
it rigth away. We're issuing these requests and we don't care about the results because we can update the UI 
instantly, without having to wait for the request to finish. 

In `home.component.ts` we'll modify the code for `addRecipe()` to also edit a recipe when `recipeId` is set. 
```ts
addRecipe(): boolean {
    if (this.recipeId) {
        this.recipesList.map((el) => {
            if (el.id == this.recipeId) {
                el.name = this.newName;
                el.text = this.newRecipe;
            }
        });
        this.recipeService.edit(this.recipeId, this.newName, this.newRecipe);
    } else {
        this.recipeService.add(this.newName, this.newRecipe).subscribe((data: any) => {
            if (data) {
                this.recipesList.unshift(data);
            }
        });
    }
    this.clearForm();
    return false;
}

editRecipe(recipe: any) {
    this.editMode = true;
    this.showForm = true;
    this.recipeId = recipe.id;
    this.newName = recipe.name;
    this.newRecipe = recipe.text;
}

removeRecipe(id: string) {
    this.recipeService.remove(id);
    this.recipesList = this.recipesList.filter((el) => el.id !== id);
    this.clearForm();
}
```

The methods `editRecipe()` and `removeRecipe()` are relatively straightforward - when editing, we set the mode in 
`editMode = true` and we show the form, when removing we just filter the array `recipesList` and we discard the 
deleted recipe if it matches the `id`.

![](/assets/img/rman_4.png)

So far, so good. We can now add, edit and remove recipes but they aren't very pretty and the formating of the text 
is lost. In the next step we'll make it possible to write the recipe text in Markdown and then render it in HTML.  

# Step 3 - Markdown support

First of all, let's install `marked` - a nice JavaScript parser for Markdown:
```bash
npm install marked --save
typings install dt~marked --global --save
```
Then we import it in `home.component.ts` as `import *  as  marked from 'marked';`. Finally we'll add a simple method
called `md2html()` which will be used in our template.
```ts
md2html(text: string) {
    return marked(text || "");
}
```
In our HTML template we change the line `<div>{{recipe.text}}</div>` like this:
```html
<div [innerHTML]="md2html(recipe.text)"></div>
```
Now we render the text to HTML on the client and this allows us to write beautiful recipes like this:

![](/assets/img/rman_5.png)

# Step 4 - Search

Final touch - recipe search. We'll use the built-in full-text search in Para. In `recipe.service.ts`:
```ts
search(q: string): Observable<string[]> {
    return this.http.get(this.RECIPES_RESOURCE + "?q=" + q)
        .map((response: Response) => response.json());
}
```
And in `home.component.ts`:
```ts
// a variable to keep the search query
q: string;
search(): boolean {
    this.recipeService.search(this.q || "*").subscribe((data:any) => {
      if (data.items) {
        this.recipesList = data.items;
      }
    });
    return false;
}
```
Finally, we add the search box in the template below the heading:
```html
<h1>My Recipes &nbsp; <button ...>Add</button></h1>
<div>
  <form (submit)="search()" [hidden]="showForm">
    <input type="text" [(ngModel)]="q" placeholder="Search">
  </form>
</div>
```

And we're done! The final result of our **Recipe Manager 1.0.0** 
(check out [the live demo](http://albogdano.github.io/angular2-para/)):

![](/assets/img/rman_6.png)

## Summary

Learning Angular 2 takes some time as it introduces a lot of architectural changes and new syntax. 
Writing in TypeScript feels fresh and more like writing in a real statically typed language like C# or Java, 
rather than a dynamic language like JS. The `import` syntax was a bit hard for me to get used to, especially 
with all the different files I had to navigate through. In general, the exprience of writing Angular 2 apps is
great - the syntax is clean, the app is well structured and the error messages are clear and understandable.   

**Things we did:**

- wrote a few fancy AJAX calls to our backend API using observables
- wired a bunch of simple TypeScript code between a component and a service
- wrote some good old HTML and CSS
- imported an external library with npm an typings

**Things we didn't do:**

- write *any* backend code
- define the "recipe" data type on the server or in a database

The code for this tutorial is on GitHub at [albogdano/angular2-para](https://github.com/albogdano/angular2-para). 
I've deployed the same code to GitHub pages as a [live demo](http://albogdano.github.io/angular2-para/) which 
is powered by our [cloud-based Para service](https://paraio.com).

 *Have questions or suggestions? Chat with us [on Gitter](https://gitter.im/Erudika/para)!*

