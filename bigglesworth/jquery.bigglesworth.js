/**
 * Mr. Bigglesworth
 * Why must I be surrounded by frickin' idiots?
 *
 * @author Micky Hulse
 * @link http://mky.io
 * @docs https://github.com/mhulse/bigglesworth
 * @copyright Copyright (c) 2014 Micky Hulse.
 * @license Released under the Apache License, Version 2.0.
 * @version 0.1.0
 * @date 2014/01/18
 */

/* jshint -W083, unused: vars */

// @todo create input field using JS.
// https://github.com/christian-fei/Simple-Jekyll-Search/blob/master/simpleJekyllSearch.js
// https://github.com/alexpearce/alexpearce.github.com/blob/master/assets/js/alexpearce.js
// http://stackoverflow.com/a/11335081/922323
// http://stackoverflow.com/a/722732/922323
// http://stackoverflow.com/a/14889628/922323
(function($, window, document, undefined) {
	
	'use strict';
	
	var console = window.console || { log : $.noop, warn : $.noop },
	
	NS = 'bigglesworth',
	
	defaults = {
		
		results : '#' + NS + '_results',
		resultsTemplate : '<p><a href="{ href }">{ title }</a></p>',
		resultsNo : '#' + NS + '_results-no',
		resultsNoTemplate : '<p>Oh shucks, nothing found :(</p>',
		feed : 'search.json',
		limit : 5,
		buffer : 300,
		onInit : $.noop,
		onAfterInit : $.noop,
		onBeforeAdd      : $.noop,                              // Before reveal animation begins.
		onAdd            : $.noop,                              // After reveal animation ends.
		onBeforeRemove      : $.noop,                              // Before hide animation begins.
		onRemove            : $.noop                               // After hide animation ends.
		
	},
	
	methods = {
		
		init : function(options) {
			
			return this.each(function() {
				
				var $this = $(this),
				    data  = $this.data(NS),
				    settings;
				
				if ( ! data) {
					
					settings = $.extend(true, {}, defaults, options, $this.data(NS + 'Options'));
					
					$this.data(NS, {
						
						init      : false,
						settings  : settings,
						target    : $this,
						form      : $this.closest('form'),
						results   : $(settings.results),
						resultsNo : $(settings.resultsNo),
						matches   : [],
						json      : null
						
					});
					
					data = $this.data(NS);
					
				}
				
				if ( ! data.init) {
					
					_main(data);
					
				} else {
					
					console.warn('jQuery.' + NS, 'thinks it\'s already initialized on', this);
					
				}
				
			});
			
		},
		
		destroy : function() {
			
			return this.each(function() {
				
				var $this = $(this),
				    data  = $this.data(NS);
				
				if (data) {
					
					$this.removeData(NS);
					
					// ...
					
				}
				
			});
			
		}
		
	},
	
	_main = function(data) {
		
		data.init = true;
		
		data.settings.onInit.call(data.target);
		
		if (data.results.length && data.resultsNo.length) {
			
			data.target
				.one('focus', function() {
					
					$
						.getJSON(data.settings.feed, function(obj) {
							
							data.json = obj;
							
							_register(data);
							
						})
						.fail(function(jqxhr, textStatus, error) {
							
							console.log('jQuery.%s thinks the JSON request failed for %o because: "%s, %s".', NS, data.target, textStatus, error);
							
						});
				
				});
			
			data.form
				.submit(function($e) {
					
					$e.preventDefault();
					
				});
			
		} else {
			
			console.warn('jQuery.%s can\'t find either a "results" (%o) or "resultsNo" (%o) elements for %o.', NS, data.results, data.resultsNo, data.target);
			
		}
		
		data.settings.onAfterInit.call(data.target);
		
	},
	
	_register = function(data) {
		
		var timer;
		
		data.target.on('keyup', function($e) {
			
			var q = $.trim($(this).val());
			
			clearInterval(timer);
			timer = setTimeout(function() {
				
				if ($e.which === 13) {
					
					if (data.matches.length) {
						
						window.location = data.matches[0].href; // On ENTER, goes to first result's "url".
						
					} else {
						
						data.form[0]
							.submit();
						
					}
					
				}
				
				if (q.length) {
					
					_write(
						data,
						_search(data, q)
					);
					
				} else {
					
					data.matches = [];
					
					$.fn[NS].nuke(data);
					
				}
				
			}, data.settings.buffer); // Buffer time.
			
		});
		
	},
	
	_search = function(data, str) {
		
		var obj,
		    i,
		    l;
		
		data.matches = [];
		
		for (i = 0, l = data.json.length; i < l; i++) {
			
			obj = data.json[i];
			
			if (_traverse(obj, str)) {
				
				data.matches.push(obj);
				
			}
			
		}
		
		return data.matches;
		
	},
	
	_write = function(data, m) {
		
		var i,
		    l;
		
		$.fn[NS].nuke(data);
		
		if (m && m.length) {
			
			for (i = 0, l = m.length; (i < l) && (i < data.settings.limit); i++) {
				
				$.fn[NS].format(data, m[i]);
				
			}
			
		} else {
			
			$.fn[NS].zilch(data);
			
		}
		
	},
	
	_traverse = function(obj, str) {
		
		var flag = false,
		    key;
		
		for (key in obj) {
			
			if (obj.hasOwnProperty(key)) {
				
				if ((typeof obj[key] === 'string') && (obj[key].toLowerCase().indexOf(str.toLowerCase()) != -1)) {
					
					flag = true;
					
					break;
					
				} else if ((obj[key] !== null) && (typeof obj[key] === 'object')) {
					
					flag = _traverse(obj[key], str);
					
					if (flag) {
						
						break;
						
					}
					
				}
				
			}
			
		}
		
		return flag;
		
	};
	
	$.fn[NS] = function(method) {
		
		if (methods[method]) {
			
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			
		} else if ((typeof method == 'object') || ( ! method)) {
			
			return methods.init.apply(this, arguments);
			
		} else {
			
			$.error('jQuery.' + NS + ' thinks that ' + method + ' doesn\'t exist');
			
		}
		
	};
	
	$.fn[NS].format = function(data, obj) {
					
		var item = data.settings.resultsTemplate.replace(/\{(.*?)\}/g, function(match, property) {
			
			return obj[$.trim(property)];
			
		});
		
		data.results.append(item);
		
	};
	
	$.fn[NS].nuke = function(data) {
		
		data.results
			.children()
			.remove();
		
		data.resultsNo
			.children()
			.remove();
		
	};
	
	$.fn[NS].zilch = function(data) {
		
		data.resultsNo.append(data.settings.resultsNoTemplate);
		
	};
	
}(jQuery, window, document));
