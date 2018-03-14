ember-hbs-minifier
==============================================================================

Stripping whitespace out of your Handlebars templates

__Disclaimer:__ This is an experiment and might change in the future. Do not
use this for production yet unless you understand the consequences!

Installation
------------------------------------------------------------------------------

```
ember install ember-hbs-minifier
```

Usage
------------------------------------------------------------------------------

`ember-hbs-minifier` will remove unnecessary text nodes from your templates
and collapse whitespace into single space characters. This is all done
automatically for you (without having to use e.g. `{{~foo~}}`).


Here is the default configuration.

#### ember-cli-build.js
```javascript

  'ember-hbs-minifier': {
    skip: {
      classes: [],
      elements: ['pre'], //Inside of `<pre></pre>` tags are skipped.
      components: ['no-minify'] //Inside of `{{#no-minify}}{{/no-minify}}` blocks are skipped. You can provide your own config here say, contact-details, 'address-section'
    }
  }
```

Note:

- This does not work across component/template boundaries.

- `no-minify` wrappers are stripped from the template.

What happens in particular is:

- Text nodes containing only whitespace are collapsed to `' '`
  (a single space character)

- Leading or trailing text nodes inside of tags or handlebars blocks
  containing only whitespace are removed entirely


License
------------------------------------------------------------------------------

ember-hbs-minifier is developed by and &copy;
[simplabs GmbH](http://simplabs.com) and contributors. It is released under the
[MIT License](LICENSE.md).
