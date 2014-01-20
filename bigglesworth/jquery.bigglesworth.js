/**
 * Mr. Bigglesworth
 * Why must I be surrounded by frickin' idiots?
 *
 * @author Micky Hulse
 * @link http://mky.io
 * @docs https://github.com/mhulse/jquery-bigglesworth
 * @copyright Copyright (c) 2014 Micky Hulse.
 * @license Released under the Apache License, Version 2.0.
 * @version 1.1.0
 * @date 2014/01/19
 */

/* jshint -W083, unused: vars */

// https://github.com/christian-fei/Simple-Jekyll-Search/blob/master/simpleJekyllSearch.js
// https://github.com/alexpearce/alexpearce.github.com/blob/master/assets/js/alexpearce.js
// http://stackoverflow.com/a/11335081/922323
// http://stackoverflow.com/a/722732/922323
// http://stackoverflow.com/a/14889628/922323

//----------------------------------

// @todo Is there a better way to handle on/off classes?

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
		
		result           : '#' + NS + '_result',                     // Target "result" element.
		resultTemplate   : '<p><a href="{ uri }">{ title }</a></p>', // HTML "template" for "result" element.
		resultNo         : '#' + NS + '_result-no',                  // Target "no result" element.
		resultNoTemplate : '<p>Nothing recent found.</p>',           // HTML template for "no result".
		classOn          : NS + '_on',                               // Class applied to parent element when "result" exists.
		classOff         : NS + '_off',                              // Class applied to parent element when "result" does not exist.
		feed             : 'search.json',                            // The "search" data file.
		limit            : 5,                                        // Limit of "result" output.
		buffer           : 300,                                      // Buffer "search" output.
		onInit           : $.noop,                                   // Callback on plugin initialization.
		onAfterInit      : $.noop,                                   // Callback after plugin initialization.
		onResult         : $.noop,                                   // Callback when a "result" has been added.
		onRemove         : $.noop,                                   // Callback when a "result" has been removed.
		onZilch          : $.noop                                    // Callback when search query returns no "result".
		
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
						
						init     : false,                 // Plugin initialization flag.
						settings : settings,              // Merged plugin settings.
						target   : $this,                 // Target element plugin has been initialized on (assumed to be a form `input` element).
						form     : $this.closest('form'), // The `input`'s parent `form`.
						result   : $(settings.result),    // Target element "result".
						resultNo : $(settings.resultNo),  // Target element "no result".
						matches  : [],                    // Container for `query`'s matched "result".
						query    : '',                    // Search terms.
						json     : null                   // The parsed data returned from JSON feed.
						
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
				
				var data = $(this).data(NS);
				
				//----------------------------------
				// Data?
				//----------------------------------
				
				if (data) {
					
					data.target // ... hot chaining action -->
					
					//----------------------------------
					// Namespaced instance data:
					//----------------------------------
					
					.removeData(NS) // -->
					
					//----------------------------------
					// Remove classes:
					//----------------------------------
					
					.removeClass(data.settings.classOff) // -->
					
					.removeClass(data.settings.classOn) // -->
					
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
					
					.off('submit.' + NS); // Done with target.
					
					//----------------------------------
					// Remove classes:
					//----------------------------------
					
					data.result // Take "result" jQuery object ...
						.add(data.resultNo) // ... add the "no result" jQuery object ...
						.removeClass(data.settings.classOn) // ... and remove ...
						.removeClass(data.settings.classOff); // ... classes. :)
					
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
		
		if (data.result.length && data.resultNo.length) {
			
			//----------------------------------
			// Add class:
			//----------------------------------
			
			data.result
				.add(data.resultNo)
				.addClass(data.settings.classOff);
			
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
			
			console.warn('jQuery.%s can\'t find either a "result" (%o) or "resultNo" (%o) elements for %o.', NS, data.result, data.resultNo, data.target);
			
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
					// Do we have a "result"?
					//----------------------------------
					
					if (data.matches.length) {
						
						//----------------------------------
						// Yes. Navigate to first "result":
						//----------------------------------
						
						window.location = data.matches[0].uri; // On ENTER, goes to first "result"'s "uri".
						
					} else {
						
						//----------------------------------
						// Otherwise, allow form to submit:
						//----------------------------------
						
						data.form[0]
							.submit(); // Go!
						
					}
					
				}
				
				//----------------------------------
				// Do we have search term(s)?
				//----------------------------------
				
				if (data.query.length) {
					
					//----------------------------------
					// Yup, so spit out the "result":
					//----------------------------------
					
					_write(
						data,
						_search(data) // Return "result" of `_search()` back to `_write()`.
					);
					
				} else {
					
					//----------------------------------
					// Juggle classes ...
					//----------------------------------
					
					data.result // Take "result" jQuery object ...
						.add(data.resultNo) // ... add the "no result" jQuery object ...
						.removeClass(data.settings.classOn) // ... add one class ...
						.addClass(data.settings.classOff); // ... and remove the other class.
					
					//----------------------------------
					// No. Clear the matched "result":
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
	 * @return { object } Matched "result".
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
	 * @param { function } callback Optional callback method.
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
		// Do we have a "result"?
		//----------------------------------
		
		if (matches && matches.length) {
			
			//----------------------------------
			// Yup, loop over each "result":
			//----------------------------------
			
			for (i = 0, l = matches.length; (i < l) && (i < data.settings.limit); i++) {
				
				//----------------------------------
				// Format "result":
				//----------------------------------
				
				$.fn[NS].format(data, matches[i]);
				
			}
			
			//----------------------------------
			// Juggle classes:
			//----------------------------------
			
			data.result
				.removeClass(data.settings.classOff)
				.addClass(data.settings.classOn);
			
			data.resultNo
				.removeClass(data.settings.classOn)
				.addClass(data.settings.classOff);
			
		} else {
			
			//----------------------------------
			// Display "no result" message:
			//----------------------------------
			
			$.fn[NS].zilch(data);
			
			//----------------------------------
			// Juggle classes:
			//----------------------------------
			
			data.result
				.removeClass(data.settings.classOn)
				.addClass(data.settings.classOff);
			
			data.resultNo
				.removeClass(data.settings.classOff)
				.addClass(data.settings.classOn);
			
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
	 * Format the output of a "result".
	 *
	 * @type { function }
	 */
	
	$.fn[NS].format = function(data, obj) {
		
		//----------------------------------
		// Combine "result" and template:
		//----------------------------------
		
		var item = data.settings.resultTemplate.replace(/\{(.*?)\}/g, function(match, property) {
			
			//----------------------------------
			// Return property if it exists:
			//----------------------------------
			
			return obj[$.trim(property)]; // @todo Allow for nesting?
			
		});
		
		//----------------------------------
		// Callback:
		//----------------------------------
		
		data.settings.onResult.call(data.target, obj, item, data);
		
		//----------------------------------
		// Add formatted "result" to DOM:
		//----------------------------------
		
		data.result.append(item);
		
	}; // $.fn[NS].format
	
	//--------------------------------------------------------------------
	
	/**
	 * Displays "no result" message.
	 *
	 * @type { function }
	 */
	
	$.fn[NS].zilch = function(data) {
		
		//----------------------------------
		// Callback:
		//----------------------------------
		
		data.settings.onZilch.call(data.target, data);
		
		//----------------------------------
		// Add template to DOM:
		//----------------------------------
		
		data.resultNo.append(data.settings.resultNoTemplate);
		
	}; // $.fn[NS].zilch
	
	//--------------------------------------------------------------------
	
	/**
	 * Removes "result" from output.
	 *
	 * @type { function }
	 */
	
	$.fn[NS].nuke = function(data) {
		
		//----------------------------------
		// Loop over objects:
		//----------------------------------
		
		$.each([data.result, data.resultNo], function() {
			
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
				
				$children.remove(); // https://github.com/mhulse/jquery-bigglesworth/issues/12
				
			}
			
		});
		
	}; // $.fn[NS].nuke
	
}(jQuery, window)); // Booyah!
