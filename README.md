# Mr. Bigglesworth

[![Mr. Bigglesworth](bigglesworth.gif)](http://youtu.be/oNKWA7jn_KY?t=40s)

<a href="http://gruntjs.com/" title="Built with Grunt"><img src="https://cdn.gruntjs.com/builtwith.png" alt="Built with Grunt" align="right"></a>

**Why must I be surrounded by frickin' idiots?**

---

## About

A simple "instant search" plugin, powered by jQuery.

### Inspired by:

* **[Simple-Jekyll-Search](https://github.com/christian-fei/Simple-Jekyll-Search)** ... **BIG UPS** goes out to [@christian-fei](https://github.com/christian-fei)!
* [Simple Jekyll Searching](https://alexpearce.me/2012/04/simple-jekyll-searching/)
* [Fulltext Search on Jekyll Site](http://blog.comperiosearch.com/blog/2012/06/27/make-an-instant-search-application-using-json-ajax-and-jquery/)
* [jekyll-lunr-js-search](https://github.com/slashdotdash/jekyll-lunr-js-search)

## Demo

Click or scan:

[![qr code](http://chart.apis.google.com/chart?cht=qr&chl=https://github.com/mhulse/jquery-bigglesworth/&chs=240x240)](http://mhulse.github.com/jquery-bigglesworth/demo/)

**Source:** [jquery.bigglesworth.js](https://raw.github.com/mhulse/jquery-bigglesworth/gh-pages/bigglesworth/jquery.bigglesworth.js) | [jquery.bigglesworth.min.js](https://raw.github.com/mhulse/jquery-bigglesworth/gh-pages/bigglesworth/jquery.bigglesworth.min.js)

## Installation

There are several ways to install this code:

1. Download as a [`zip`](https://github.com/mhulse/jquery-bigglesworth/archive/gh-pages.zip).
1. Clone it: `$ git clone https://github.com/mhulse/jquery-bigglesworth.git`.
1. Fork it and clone: `$ git clone git@github.com:USERNAME/jquery-bigglesworth.git`.
1. Just grab the relevant [JS](https://raw.github.com/mhulse/jquery-bigglesworth/gh-pages/bigglesworth/jquery.bigglesworth.js) ([uglified](https://raw.github.com/mhulse/jquery-bigglesworth/gh-pages/bigglesworth/jquery.bigglesworth.min.js)) files.
1. Using [Bower](http://bower.io/): `$ bower install https://github.com/mhulse/jquery-bigglesworth.git`.

## Usage

Setting up Mr. Bigglesworth is simple ...

### Markup:

The basic markup should consist of a `<form>` with a (search) `<input>`:

```html
<form id="search" class="form" method="get" action="http://www.google.com/search" role="search">
	
	<input type="hidden" name="sitesearch" value="mysite.com">
	
	<label><span>Search:</span> <input id="bigglesworth" type="search" name="q" placeholder="Search &hellip;" autocomplete="off"></label>
	
	<ul id="bigglesworth_result"></ul>
	
	<div id="bigglesworth_result-no"></div>
	
</form>
```

**Note:** When there are no results, or if the search term(s) isn't found found, the form's default action will be used upon submission; in the above example, a simple [Google site search](https://developers.google.com/search-appliance/documentation/46/xml_reference#request_parameters) will be called.

### Styling:

The search elements, and results, can be styled as you see fit; check out the [demo page](http://mhulse.github.com/jquery-bigglesworth/demo/) for a complete working example.

### JSON:

This plugin utilizes JSON data; here's a simple example:

```json
[{
  "title" : "When Mr. Bigglesworth gets upset... people DIE!",
  "uri" : "/when-mr-bigglesworth-gets-upset-people-die/"
},{
  "title" : "It's frickin' freezing in here, Mr. Bigglesworth.",
  "uri" : "/its-frickin-freezing-in-here-mr-bigglesworth/",
}]
```

The structure of your JSON _can_ be more complex than the above; for a more robust example, see the demo's [search.json](https://github.com/mhulse/jquery-bigglesworth/blob/gh-pages/demo/search.json).

### Javascript:

Put [jQuery](http://jquery.com/) on your page:

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
```

... and link to the plugin:

```html
<script src="jquery.bigglesworth.min.js"></script>
```

Next, Bigglesworth can be instantiated like so:

```html
<script>
	
	$(document).ready(function() {
		
		$('#bigglesworth').bigglesworth();
		
	});
	
</script>
```

Here's an example with all the options:

```html
$('#bigglesworth').bigglesworth({
	results           : '#bigglesworth_result',
	resultsTemplate   : '<p><a href="{ uri }">{ title }</a></p>',
	resultsNo         : '#bigglesworth_result-no',
	resultsNoTemplate : '<p>Nothing recent found.</p>',
	feed              : 'search.json',
	limit             : 5,
	buffer            : 300,
	onInit            : function(data) { console.log('onInit:', $(this), data); },
	onAfterInit       : function(data) { console.log('onAfterInit:', $(this), data); },
	onResult          : function(obj, item, data) { console.log('onResult:', $(this), obj, item, data); },
	onRemove          : function(el, children, data) { console.log('onRemove:', $(this), el, children, data); },
	onZilch           : function(data) { console.log('onZilch:', $(this), data); }
});
```

… where:

Option | Description | Default
:-- | :-- | :--
`results` | Target results element. | `'#bigglesworth_result'`
`resultsTemplate` | Results HTML "template". | `'<p><a href="{ uri }">{ title }</a></p>'`
`resultsNo` | Target "no" results element. | `'#bigglesworth_result-no'`
`resultsNoTemplate` | No results HTML template. | `'<p>Nothing recent found.</p>'`
`classOn` | Class applied to result when results exist. | `'bigglesworth_on'`
`classOff` | Class applied to result when results do not exist. | `'bigglesworth_off'`
`feed` | The search data file. | `'search.json'`
`limit` | Result limit. | `5`
`buffer` | Search buffer. | `300`
`onInit` | Callback on plugin initialization. | `$.noop`
`onAfterInit` | Callback after plugin initialization. | `$.noop`
`onResult` | Callback when result added. | `$.noop`
`onRemove` | Callback when result removed. | `$.noop`
`onZilch` | Callback for no results. | `$.noop`

### Advanced:

1. All options can be overidden via an [HTML5 data attribute](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes) named `data-bigglesworth-options`; the value of this attribute **must** be valid [JSON](http://json.org/) syntax.

 For example:

 ```html
 <input id="bigglesworth" type="search" name="q" placeholder="Search &hellip;" autocomplete="off" data-bigglesworth-options='{ "feed" : "/search.json" }'>
 ```

 **Note** the nesting order of the single (`'`) and double (`"`) quotes.

1. Format each result using the `format` method.

 Example:

 ```js
 $.fn.bigglesworth.format = function(data, obj) {
 	
 	data.results.append(
 		'<li>' +
 			obj.date.month + ' ' + obj.date.day + ', ' + obj.date.year + ' | ' +
 			'<a href="' + obj.uri + '">' +
 				obj.title +
 			'</a>' +
 		'</li>'
 	);
 	
 };
 ```

 This will give you more freedom to format your results however you see fit; this feature is useful if you have nested structures in your JSON data.

1. Like above, the "no results" output can also be fully customized.

 Example:

 ```js
 $.fn.bigglesworth.zilch = function(data) {
 	
 	data.resultsNo.append(
 		'<p>' +
 			'Nothing recent found.' +
 			'<br>' +
 			'<a id="submit" href="#">Search google instead?</a>' +
 		'</p>'
 	);
 	
 	$('#submit').on('click', function($e) {
 		
 		$e.preventDefault();
 		
 		data.form[0].submit();
 		
 	});
 	
 };
 ```

 In the above example, I've added a link to ask users if they want to continue searching via Google.

1. Add "results" and "no results" elements using javascript.

 Example:

 ```js
 var $ul = $('<ul>', { id : 'bigglesworth_result' }),
 $div = $('<div>', { id : 'bigglesworth_result-no' }),
 $search = $('#bigglesworth');
 
 $search
 	.closest('label')
 	.after($div, $ul);
 
 $search.bigglesworth();
 ```

 Doing the above makes it so those extraneous elements aren't lingering if javascript is disabled.

[Check out the demo page](http://mhulse.github.com/jquery-bigglesworth/demo/) for working examples of the aforementioned features.

## Contributing

Please read the [CONTRIBUTING.md](https://github.com/mhulse/jquery-bigglesworth/blob/gh-pages/CONTRIBUTING.md).

## Feedback

[Bugs? Constructive feedback? Questions?](https://github.com/mhulse/jquery-bigglesworth/issues/new?title=Your%20code%20sucks!&body=Here%27s%20why%3A%20)

## Changelog

* [v1.1.0 milestones](https://github.com/mhulse/jquery-bigglesworth/issues?direction=desc&milestone=2&page=1&sort=updated&state=open)
* [v1.0.0 milestones](https://github.com/mhulse/jquery-bigglesworth/issues?direction=desc&milestone=1&page=1&sort=updated&state=open)

## [Release history](https://github.com/mhulse/jquery-bigglesworth/releases)

* 2014-01-19   [v1.1.0](https://github.com/mhulse/jquery-bigglesworth/releases/tag/v1.1.0)   More hooks.
* 2014-01-19   [v1.0.0](https://github.com/mhulse/jquery-bigglesworth/releases/tag/v1.0.0)   Ready for prime time.
* 2014-01-16   [v0.1.0](https://github.com/mhulse/jquery-bigglesworth/releases/tag/v0.1.0)   Hello world!

---

#### LEGAL

Copyright &copy; 2014 [Micky Hulse](http://mky.io)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in compliance with the License. You may obtain a copy of the License in the LICENSE file, or at:

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

<img width="20" height="20" align="absmiddle" src="https://github.global.ssl.fastly.net/images/icons/emoji/octocat.png" alt=":octocat:" title=":octocat:" class="emoji">
