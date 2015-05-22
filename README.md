# use-import
> Imports modules by name instead of by filepath

Tired of dealing with lengthy relative file paths in your `require` statements? This module gives your project files access to the `use` function, enabling you to import modules by name rather than by filepath. Module names are configured either via a JSON file placed in the project's root directory or via an object passed in at application startup.

## Installation

```sh
npm install use-import --save
```

## Configuration

To configure your project's names, create a new file in your project's root directory called **use.json**. Within this file, map out the modules' names to their respective filepaths:

```javascript
{
    // all key-value pairs in this file should follow the format of
    // "name": "filepath." Like so:

    "MyClass": "./src/data/MyClass",
    "MyOtherClass": "./src/model/MyOtherClass"

    // all file paths should be expressed relative to the project's 
    // root directory
}
```

(If this seems like a hassle to you, you may want to take a look at [projectjs](https://github.com/tinwatchman/projectjs). Note that `use-import` will also accept configuration in the form of a *project.json* file.)

For another way to handle configuration, see [In-Code Configuration](#in_code_configuration) below.

## Usage

Add the following code to the top of your project's main script or entry point:

```javascript
// This call is REQUIRED at the start of the application
// in order to make `use-import` work when using a use.json 
// file for configuration!
var use = require('use-import').load();
```

Note that `use.load` only needs to be called *once* in a project. From that point on, you can (and should) require the use function normally in any of your project files, like so:

```javascript
var use = require('use-import');
```

The `use` function acts as a wrapper around `require`, allowing you to request modules by name or shorthand alias rather than having to bother with filepaths.

```javascript
// so instead of having to write something like this...
var MyClass = require('../../data/MyClass');
// ... you can simply refer to the module by name
var use = require('use-import');
var MyClass = use('MyClass');
```

<a name="in_code_configuration"></a>
## Optional: In-Code Configuration

As an additional option, instead of creating and loading a use.json file at runtime, you can also pass in a name-filepath map in your project's entry point, instead of calling `use.load`:

```javascript
// make this call in your entry point or start script INSTEAD of calling use.load as described above.
var use = require('use-import').config({
    "MyClass": "./src/data/MyClass",
    "MyOtherClass": "./src/model/MyOtherClass"
});
```

## Credits and Licensing

Created by [Jon Stout](http://www.jonstout.net). Licensed under [the MIT license](http://opensource.org/licenses/MIT).
