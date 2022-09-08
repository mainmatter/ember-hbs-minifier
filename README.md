ember-hbs-minifier
==============================================================================

Stripping whitespace out of your Handlebars templates

__Disclaimer:__ This is an experiment and might change in the future. Do not
use this for production yet unless you understand the consequences!

Compatibility
------------------------------------------------------------------------------

* Ember.js v3.20 or above
* Ember CLI v3.20 or above
* Node.js 12 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-hbs-minifier
```

Usage
------------------------------------------------------------------------------

`ember-hbs-minifier` will remove unnecessary text nodes from your templates
and collapse whitespace into single space characters. This is all done
automatically for you (without having to use e.g. `{{~foo~}}`) but is
disabled for certain situations:

- Inside of `<pre></pre>` tags

- Inside of `{{#no-minify}}{{/no-minify}}` blocks
  (these will be stripped from the template)

Please note that this does not work across component/template boundaries.

What happens in particular is:

- Text nodes containing only whitespace are collapsed to `' '`
  (a single space character)

- Leading or trailing text nodes inside of tags or handlebars blocks
  containing only whitespace are removed entirely


### Configuration

If you want to disable the whitespace stripping behavior for other tags,
components, or elements with certain CSS classes you can adjust the default
configuration in your `ember-cli-build.js` file:

```javascript
  let app = new EmberApp({
    'ember-hbs-minifier': {
      skip: {
        classes: [],
        // skip whitespace stripping in `<pre></pre>` tags
        elements: ['pre'], 
        // skip whitespace stripping in `{{#no-minify}}{{/no-minify}}` blocks
        components: ['no-minify'],
      },
    },
  });
```


License
------------------------------------------------------------------------------

ember-hbs-minifier is developed by and &copy;
[Mainmatter GmbH](http://mainmatter.com) and contributors. It is released under the
[MIT License](LICENSE.md).
