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
automatically for you (without having to use e.g. `{{~foo~}}`) but is
disabled for certain situations:

- Inside of `<pre></pre>` tags

- Inside of `{{#no-minify}}{{/no-minify}}` blocks
  (these will be stripped from the template)

Note that this does not work across component/template boundaries.

What happens in particular is:

- Text nodes containing only whitespace are collapsed to `' '`
  (a single space character)

- Leading or trailing text nodes inside of tags or handlebars blocks
  containing only whitespace are removed entirely


License
------------------------------------------------------------------------------
ember-hbs-minifier is licensed under the [MIT License](LICENSE.md).
