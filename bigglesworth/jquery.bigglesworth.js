/**
 * Mr. Bigglesworth
 * Why must I be surrounded by frickin' idiots?
 *
 * @author Micky Hulse
 * @link http://mky.io
 * @docs https://github.com/mhulse/jquery-bigglesworth
 * @copyright Copyright (c) 2014 Micky Hulse.
 * @license Released under the Apache License, Version 2.0.
 * @version 1.0.0
 * @date 2014/01/19
 */

/* jshint -W083, unused: vars */

// https://github.com/christian-fei/Simple-Jekyll-Search/blob/master/simpleJekyllSearch.js
// https://github.com/alexpearce/alexpearce.github.com/blob/master/assets/js/alexpearce.js
// http://stackoverflow.com/a/11335081/922323
// http://stackoverflow.com/a/722732/922323
// http://stackoverflow.com/a/14889628/922323

//----------------------------------

// Notes to self:
//console.profile('profile foo');
// ... code here ...
//console.profileEnd('profile foo');
// ... or:
// console.time('timing foo');
// ... code here ...
// console.timeEnd('timing foo');

//----------------------------------

(function($, window) {
	
	/**
	 * Function-level strict mode syntax.
	 *
	 * @see rgne.ws/XcZgn8
	 */
	
	'use strict';
	
	//--------------------------------------------------------------------------
	//
	// Local "globals":
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Javascript console.
	 *
	 * @see rgne.ws/12p2bvl
	 */
	
	var console = window.console || { log : $.noop, warn : $.noop },
	
	/**
	 * The plugin namespace.
	 */
	
	NS = 'bigglesworth',
	
	//--------------------------------------------------------------------------
	//
	// Defaults/settings:
	//
	//--------------------------------------------------------------------------
	
	defaults = {
		
		results           : '#' + NS + '_results',                     // Target results element.
		resultsTemplate   : '<p><a href="{ uri }">{ title }</a></p>', // Results HTML "template".
		resultsNo         : '#' + NS + '_results-no',                  // Target "no" results element.
		resultsNoTemplate : '<p>Nothing recent found.</p>',            // No results HTML template.
		feed              : 'search.json',                             // The search data file.
		limit             : 5,                                         // Result limit.
		buffer            : 300,                                       // Search buffer.
		onInit            : $.noop,                                    // Callback on plugin initialization.
		onAfterInit       : $.noop,                                    // Callback after plugin initialization.
		onResult          : $.noop,                                    // Callback when result added.
		onRemove          : $.noop,                                    // Callback when result removed.
		onZilch           : $.noop                                     // Callback for no results.
		
	}, // defaults
	
	//--------------------------------------------------------------------------
	//
	// Public methods:
	//
	//--------------------------------------------------------------------------
	
	methods = {
		
		/**
		 * Init constructor.
		 *
		 * @type { function }
		 * @param { object } opts Options object literal.
		 * @this { object.jquery }
		 * @return { object.jquery } Returns target object(s) for chaining purposes.
		 */
		
		init : function(options) {
			
			//----------------------------------
			// Loop & return each this:
			//----------------------------------
			
			return this.each(function() {
				
				//----------------------------------
				// Declare, hoist and initialize:
				//----------------------------------
				
				var $this = $(this),        // Target object.
				    data  = $this.data(NS), // Namespace instance data.
				    settings;               // Settings object.
				
				//----------------------------------
				// Data?
				//----------------------------------
				
				if ( ! data) {
					
					//----------------------------------
					// Initialize:
					//----------------------------------
					
					settings = $.extend(true, {}, defaults, options, $this.data(NS + 'Options')); // Recursively merge defaults, options and data attribute options.
					
					//----------------------------------
					// Namespaced instance data:
					//----------------------------------
					
					$this.data(NS, {
						
						init      : false,                 // Plugin initialization flag.
						settings  : settings,              // Merged plugin settings.
						target    : $this,                 // Target element plugin has been initialized on (assumed to be a form `input` element).
						form      : $this.closest('form'), // The `input`'s parent `form`.
						results   : $(settings.results),   // Results target element.
						resultsNo : $(settings.resultsNo), // No results target element.
						matches   : [],                    // Container for matched results for `query`.
						query     : '',                    // Search terms.
						json      : null                   // The parsed data returned from JSON feed.
						
					});
					
					//----------------------------------
					// Easy access:
					//----------------------------------
					
					data = $this.data(NS);
					
				}
				
				//----------------------------------
				// Data initialization check:
				//----------------------------------
				
				if ( ! data.init) {
					
					//----------------------------------
					// Call main:
					//----------------------------------
					
					_main(data);
					
				} else {
					
					//----------------------------------
					// Ouch!
					//----------------------------------
					
					console.warn('jQuery.%s thinks it\'s already initialized on %o.', NS, this);
					
				}
				
			});
			
		}, // init
		
		/**
		 * Removes plugin from element.
		 *
		 * @type { function }
		 * @this { object.jquery }
		 * @return { object.jquery } Returns target object(s) for chaining purposes.
		 */
		
		destroy : function() {
			
			//----------------------------------
			// Loop & return each this:
			//----------------------------------
			
			return this.each(function() {
				
				//----------------------------------
				// Declare, hoist and initialize:
				//----------------------------------
				
				var $this = $(this),
				    data  = $this.data(NS);
				
				//----------------------------------
				// Data?
				//----------------------------------
				
				if (data) {
					
					$this // ... hot chaining action -->
					
					//----------------------------------
					// Namespaced instance data:
					//----------------------------------
					
					.removeData(NS) // -->
					
					//----------------------------------
					// Namespaced events:
					//----------------------------------
					
					.off('focus.' + NS) // -->
					
					.off('keyup.' + NS) // -->
					
					//----------------------------------
					// Parent form:
					//----------------------------------
					
					.closest('form') // -->
					
					//----------------------------------
					// Namespaced events:
					//----------------------------------
					
					.off('submit.' + NS); // Done!
					
				}
				
			});
			
		} // destroy
		
	}, // methods
	
	//--------------------------------------------------------------------------
	//
	// Private methods:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Called after plugin initialization.
	 *
	 * @private
	 * @type { function }
	 * @param { object } data Parent data object literal.
	 */
	
	_main = function(data) {
		
		//----------------------------------
		// Plugin initialization flag:
		//----------------------------------
		
		data.init = true;
		
		//----------------------------------
		// Callback:
		//----------------------------------
		
		data.settings.onInit.call(data.target, data);
		
		//----------------------------------
		// Check for "result" elements:
		//----------------------------------
		
		if (data.results.length && data.resultsNo.length) {
			
			//----------------------------------
			// Wait for first "focus" event:
			//----------------------------------
			
			data.target
				.one('focus.' + NS, function() {
					
					//----------------------------------
					// Now, load the JSON data:
					//----------------------------------
					
					$
						.getJSON(data.settings.feed, function(obj) {
							
							//----------------------------------
							// Cache JSON data:
							//----------------------------------
							
							data.json = obj;
							
							//----------------------------------
							// "Register" search functionality:
							//----------------------------------
							
							_register(data);
							
						})
						.fail(function(jqxhr, textStatus, error) {
							
							//----------------------------------
							// If JSON fails to load:
							//----------------------------------
							
							console.log('jQuery.%s thinks the JSON request failed for %o because: "%s, %s".', NS, data.target, textStatus, error);
							
						});
				
				});
			
			//----------------------------------
			// Didable default form behaviour:
			//----------------------------------
			
			data.form
				.on('submit.' + NS, function($e) {
					
					$e.preventDefault();
					
				});
			
		} else {
			
			//----------------------------------
			// Ouch!
			//----------------------------------
			
			console.warn('jQuery.%s can\'t find either a "results" (%o) or "resultsNo" (%o) elements for %o.', NS, data.results, data.resultsNo, data.target);
			
		}
		
		//----------------------------------
		// Callback:
		//----------------------------------
		
		data.settings.onAfterInit.call(data.target, data);
		
	},
	
	/**
	 * Handles search functionality.
	 *
	 * @private
	 * @type { function }
	 * @param { object } data Parent data object literal.
	 */
	
	_register = function(data) {
		
		//----------------------------------
		// Declare, hoist and initialize:
		//----------------------------------
		
		var timer;
		
		//----------------------------------
		// Listen for keyboard input:
		//----------------------------------
		
		data.target.on('keyup.' + NS, function($e) {
			
			//----------------------------------
			// Cache search term(s):
			//----------------------------------
			
			data.query = $.trim($(this).val());
			
			//----------------------------------
			// Buffer time between keystrokes:
			//----------------------------------
			
			clearInterval(timer);
			timer = setTimeout(function() {
				
				//----------------------------------
				// Has the "ENTER" key been pressed?
				//----------------------------------
				
				if ($e.which === 13) {
					
					//----------------------------------
					// Do we have results?
					//----------------------------------
					
					if (data.matches.length) {
						
						//----------------------------------
						// Yes, so navigate to first result:
						//----------------------------------
						
						window.location = data.matches[0].uri; // On ENTER, goes to first result's "url".
						
					} else {
						
						//----------------------------------
						// Otherwise, allow form to submit:
						//----------------------------------
						
						data.form[0]
							.submit();
						
					}
					
				}
				
				//----------------------------------
				// Do we have search term(s)?
				//----------------------------------
				
				if (data.query.length) {
					
					//----------------------------------
					// Yup, so spit out the results:
					//----------------------------------
					
					_write(
						data,
						_search(data) // Return results of `_search()` back to `_write()`.
					);
					
				} else {
					
					//----------------------------------
					// No, so clear the matched results:
					//----------------------------------
					
					data.matches = [];
					
					//----------------------------------
					// Remove "result" HTML:
					//----------------------------------
					
					$.fn[NS].nuke(data);
					
				}
				
			}, data.settings.buffer); // Buffer time.
			
		});
		
	}, // _register
	
	/**
	 * Searches JSON data for query.
	 *
	 * @private
	 * @type { function }
	 * @param { object } data Parent data object literal.
	 * @return { object } Matched results.
	 */
	
	_search = function(data) {
		
		//----------------------------------
		// Declare, hoist and initialize:
		//----------------------------------
		
		var obj,
		    i,
		    l;
		
		//----------------------------------
		// Re-initialize matches:
		//----------------------------------
		
		data.matches = [];
		
		//----------------------------------
		// Loop over JSON entries:
		//----------------------------------
		
		for (i = 0, l = data.json.length; i < l; i++) {
			
			//----------------------------------
			// Determine current entry:
			//----------------------------------
			
			obj = data.json[i];
			
			//----------------------------------
			// Recursively traverse entry:
			//----------------------------------
			
			if (_traverse(obj, data.query)) {
				
				//----------------------------------
				// Push match to matches object:
				//----------------------------------
				
				data.matches.push(obj);
				
			}
			
		}
		
		//----------------------------------
		// Return matches object:
		//----------------------------------
		
		return data.matches;
		
	}, // _search
	
	/**
	 * Determines which "result" should display.
	 *
	 * @private
	 * @type { function }
	 * @param { object } data Parent data object literal.
	 * @param { object } matches Matched data.
	 */
	
	_write = function(data, matches) {
		
		//----------------------------------
		// Declare, hoist and initialize:
		//----------------------------------
		
		var i,
		    l;
		
		//----------------------------------
		// Remove "result" HTML:
		//----------------------------------
		
		$.fn[NS].nuke(data);
		
		//----------------------------------
		// Results?
		//----------------------------------
		
		if (matches && matches.length) {
			
			//----------------------------------
			// Yup, loop over each result:
			//----------------------------------
			
			for (i = 0, l = matches.length; (i < l) && (i < data.settings.limit); i++) {
				
				//----------------------------------
				// Format result:
				//----------------------------------
				
				$.fn[NS].format(data, matches[i]);
				
			}
			
		} else {
			
			//----------------------------------
			// Display "no results" message:
			//----------------------------------
			
			$.fn[NS].zilch(data);
			
		}
		
	}, // _write
	
	/**
	 * Recursively traverses object for string.
	 *
	 * @private
	 * @type { function }
	 * @param { object } obj Traversable javascript object.
	 * @param { string } str Search term to find in object.
	 * @return { boolean }
	 */
	
	_traverse = function(obj, str) {
		
		//----------------------------------
		// Declare, hoist and initialize:
		//----------------------------------
		
		var flag = false,
		    key;
		
		//----------------------------------
		// Begin loop:
		//----------------------------------
		
		for (key in obj) {
			
			//----------------------------------
			// Is `key` a direct prop. of obj?
			//----------------------------------
			
			if (obj.hasOwnProperty(key)) {
				
				//----------------------------------
				// Have we found a string match?
				//----------------------------------
				
				if ((typeof obj[key] === 'string') && (obj[key].toLowerCase().indexOf(str.toLowerCase()) != -1)) {
					
					//----------------------------------
					// Yes, so throw a truthy flag:
					//----------------------------------
					
					flag = true;
					
					//----------------------------------
					// Break the current loop:
					//----------------------------------
					
					break; // Outta here!
					
				} else if ((obj[key] !== null) && (typeof obj[key] === 'object')) {
					
					//----------------------------------
					// It's another object, so recurse:
					//----------------------------------
					
					flag = _traverse(obj[key], str); // Returns truthy boolean if resutl is found, so we can ... 
					
					if (flag) {
						
						//----------------------------------
						// ... break the current loop:
						//----------------------------------
						
						break; // Phew! :)
						
					}
					
				}
				
			}
			
		}
		
		//----------------------------------
		// Let calling script utilize bool:
		//----------------------------------
		
		return flag;
		
	};
	
	//--------------------------------------------------------------------------
	//
	// Method calling logic:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Boilerplate plugin logic.
	 *
	 * @constructor
	 * @see rgne.ws/OvKpPc
	 * @type { function }
	 * @param { string } method String method identifier.
	 * @return { method } Calls plugin method with supplied params.
	 */
	
	$.fn[NS] = function(method) {
		
		if (methods[method]) {
			
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			
		} else if ((typeof method == 'object') || ( ! method)) {
			
			return methods.init.apply(this, arguments);
			
		} else {
			
			$.error('jQuery.%s thinks that %s doesn\'t exist', NS, method);
			
		}
		
	}; // $.fn[NS]
	
	//--------------------------------------------------------------------
	
	/**
	 * Formats the output of a result.
	 *
	 * @type { function }
	 */
	
	$.fn[NS].format = function(data, obj) {
		
		//----------------------------------
		// Combine result and template:
		//----------------------------------
		
		var item = data.settings.resultsTemplate.replace(/\{(.*?)\}/g, function(match, property) {
			
			//----------------------------------
			// Return property if it exists:
			//----------------------------------
			
			return obj[$.trim(property)];
			
		});
		
		//----------------------------------
		// Callback:
		//----------------------------------
		
		data.settings.onResult.call(data.target, obj, item, data);
		
		//----------------------------------
		// Add formatted result to DOM:
		//----------------------------------
		
		data.results.append(item);
		
	}; // $.fn[NS].format
	
	//--------------------------------------------------------------------
	
	/**
	 * Displays no result message.
	 *
	 * @type { function }
	 */
	
	$.fn[NS].zilch = function(data) {
		
		//----------------------------------
		// Callback:
		//----------------------------------
		
		data.settings.onZilch.call(data.target, data);
		
		//----------------------------------
		// Add "no results" template to DOM:
		//----------------------------------
		
		data.resultsNo.append(data.settings.resultsNoTemplate);
		
	}; // $.fn[NS].zilch
	
	//--------------------------------------------------------------------
	
	/**
	 * Removes result from output.
	 *
	 * @type { function }
	 */
	
	$.fn[NS].nuke = function(data) {
		
		//----------------------------------
		// Loop over "result" objects:
		//----------------------------------
		
		$.each([data.results, data.resultsNo], function() {
			
			//----------------------------------
			// Declare, hoist and initialize:
			//----------------------------------
			
			var $this = $(this),
			    $children = $this.children();
			
			//----------------------------------
			// Do children exist?
			//----------------------------------
			
			if ($children.length) {
				
				//----------------------------------
				// Yup, so callback:
				//----------------------------------
				
				data.settings.onRemove.call(data.target, $this, $children, data);
				
				//----------------------------------
				// ... and remove HTML from DOM:
				//----------------------------------
				
				$children.remove();
				
			}
			
		});
		
	}; // $.fn[NS].nuke
	
}(jQuery, window)); // Booyah!
