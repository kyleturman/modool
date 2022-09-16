# Modool
__/ˈMädjo͞ol/__. A very simple framework for sprinkling in some Javascript magic onto your HTML.

This framework is meant to be quick, small (currently 5kb~ before gzip), and used for basic Javascript needs, where you don't need to write a complete Single Page App, but instead need some things to move and slight interactivity to happen.

**[View Example Code Here &rarr;](https://github.com/kyleturman/modool-example)**


## Installation and usage
Want to give it a whirl? Rad! You can find examples linked here, but generally there are 3 parts to how to install and use Modool in your project. It's especially easy if you're using Webpack.

### 1. Install the package from GitHub
```
npm i --save https://github.com/kyleturman/modool
```

### 2. Write your HTML

A Modool module is contained to the HTML block that is is called on. To set the Modool use the element `data-modool='module_name'`. This can also be referenced in your module class under the `element` property.

Modool finds the elements in your HTML via the data attribute `data-modool-el='element_name'`. This will convert it to be used in your module under the `elements` property like `this.elements.element_name`. Because if this **all element names need to be snake or camel case** to access them.

```html
<div data-modool='my_module'>
    <button data-modool-el='button'>Click</button>
    <div>You clicked the button <span data-module-el='click_count'>0</span></div>
</div>
```

### 3. Write your Modool

Just write a class that extends the `Module` base class and override the lifecycle methods or create methods of your own to use. It's really just a fancy wrapper that allows you to access events and DOM elements more easily, so make it whatevery you want!

```js
import Modool from 'modool'

export default class YourModule extends Modool {
    init() {
       this.click_count = parseInt(this.elements.click_count);
    }

    events() {
        return {
            'click button': (event) => {
                this.incrementClickCount();
            }
        }
    }

    incrementClickCount() {
        this.click_count++;
        this.elements.click_count.innerText = this.click_count;
    }
}
```

### 3. Initialize Modools

You can initialize all of your Modool files in a main index file manually or dyamically by using Webpack.

**Manually**: Just initialize a new instance of the class you made that extends Modool and pass in the name you set for the `data-modool` attribute in your HTML.

```js
// index.js
import YourModule from './YourModule'
const your_module = new YourModule('your_module')
```

**Webpack**: If you want to use some Webpack magic, the ModoolLoader will take any file you have in the specified directory and load it as a module that matches any is stored under `window.__modool_modules[modool_name]`. This makes it easy to just add `data-modool='new_module'` and create a file called `new_module.js` in my modules folder and it just works!
```
ExampleProject/
    src/
        index.js
        modules/
            my_module.js
```

```js
// index.js
import { ModoolLoader } from 'modool'
const modool_context = require.context('./modules', false, /\.js$/);
ModoolLoader.load(modool_context);
```

```js
// modules/my_module.js
class MyModule extends Modool {
    init() {
       console.log('It just works!')
    }
}
```

```html
<div data-modool='my_modool'>...</div>
```


## Lifescycle methods and properties
There are three overridable methods you can use that hook into the lifecycle of a Modool module.
| Method | Description |
|---|---|
| init() | Function called whenever module is first loaded. |
| events() | Function that should return an object of functions with the key being formated as a string with the name of the event and the element you want to reference `'click element_name'`. If you want to add an event to the window, just use `window` instead of the name of the element. |
| destroy() | When an object needs to be unloaded or reloaded dynamically, you can use this to capture a destroy method. Make sure you include `this.#destroyEvents()` if you override (there might be a better way to do this, accepting PRs). |

There's also a couple properties you can access right from the class under `this`.
| Property | Description |
|---|---|
| element | The HTML element that `data-modool` is added to. |
| elements | Object that contains each `data-modool-el` inside of parent `data-modool` with the passed name of the element as the key and HTML element. If you use the same name on multiple elements, it will collect them all as an array. |


## Development
If you're looking to develop it a bit more, feel free to fork and send a PR and I'll try and take a gander. The goal of this is to be as minimal as possible, so only added basic things around accessing DOM elements and managing events more easily. Maybe there's something more though that would be beneficial or a better, more simplier way this could be accomplished. Who's to say! 

To run the development, just use the script:
```
npm run dev
```

Then when you're done run:
```
npm run build
```
