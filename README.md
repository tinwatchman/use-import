# use-import
> Imports modules by name instead of by filepath

Tired of dealing with lengthy relative file paths in your `require` statements? This module gives your project files access to the global `use` function, enabling you to import modules by name rather than by filepath. Names can then be configured via a JSON file placed in the project's root directory.

## Installation

```sh
npm install use-import --save
```

## Usage

Add the following code to the top of your project's main script or entry point:

```javascript
require('use-import');
```

From that point on, your project files will have access to the `use` function. `use` acts as a wrapper around `require`, allowing you to request modules by name rather than having to bother with filepaths.

```javascript
// so instead of having to write something like this...
var MyClass = require('../../data/MyClass');
// ... you can simply refer to the module by name
var MyClass = use('MyClass');
```

## Configuration

To configure your project's names, create a new file in your project's root directory called **use.json**. Within this file, map out the modules' names to their respective filepaths:

```javascript
{
    // all key-value pairs in this file should follow the format of
    // "name": "filepath." Like so:

    "MyClass": "./src/data/MyClass",
    "MyOtherClass": "./src/model/MyOtherClass"

    // all file paths need to be expressed relative to the project's 
    // root directory
}
```

(If this seems like a hassle to you, you may want to take a look at  )
