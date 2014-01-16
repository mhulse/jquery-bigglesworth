/* jshint -W083, unused: vars */

// @todo create input field using JS.
// https://github.com/christian-fei/Simple-Jekyll-Search/blob/master/simpleJekyllSearch.js
// https://github.com/alexpearce/alexpearce.github.com/blob/master/assets/js/alexpearce.js
// http://stackoverflow.com/a/11335081/922323
(function($, window, document, undefined) {
	
	'use strict';
	
	var console = window.console || { log : $.noop, warn : $.noop },
	
	NS = 'bigglesworth',
	
	defaults = {
		
		results : '#results',
		feed : 'search.json',
		template : '<p><a href="{ href }">{ title }</a></p>',
		zilch : '<p>Oh shucks<br/><small>Nothing found :(</small></p>',
		buffer : 300,
		onInit : $.noop,
		onAfterInit : $.noop
		
	},
	
	methods = {
		
		init : function(options) {
			
			return this.each(function() {
				
				var $this = $(this),
				    data  = $this.data(NS),
				    settings;
				
				if ( ! data) {
					
					settings  = $.extend(true, {}, defaults, options, $this.data(NS + 'Options'));
					
					$this.data(NS, {
						
						init     : false,
						settings : settings,
						target   : $this,
						results  : $(settings.results),
						matches  : [],
						json     : null
						
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
		
		if (data.results.length) {
			
			data.target
				.one('focus', function() {
					
					$
						.getJSON(data.settings.feed, function(obj) {
							
							data.json = obj;
							
							_registerEvent(data);
							
						})
						.fail(function(jqxhr, textStatus, error) {
							
							console.log('jQuery.%s thinks the JSON request failed for %o because: "%s, %s".', NS, data.target, textStatus, error);
							
						});
				
				})
				.closest('form')
				.submit(function($e) {
					
					$e.preventDefault();
					
				});
			
		} else {
			
			console.warn('jQuery.' + NS, 'can\'t find a "results" element for', data.target);
			
		}
		
		data.settings.onAfterInit.call(data.target);
		
	},
	
	_registerEvent = function(data) {
		
		var timer;
		
		data.target.on('keyup', function($e) {
			
			var q = $.trim($(this).val());
			
			clearInterval(timer);
			timer = setTimeout(function() {
				
				if ($e.which === 13) {
					
					if (data.matches) {
						
						window.location = data.matches[0].href; // On ENTER, goes to first result's "url".
						
					}
					
				}
				
				if (q.length) {
					
					_writeMatches(
						data,
						_performSearch(data, q)
					);
					
				} else {
					
					_clearSearchResults(data);
					
				}
				
			}, data.settings.buffer); // Buffer time.
			
		});
		
	},
	
	_performSearch = function(data, str) {
		
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
	
	_writeMatches = function(data, m) {
		
		var i,
		    l;
		
		_clearSearchResults(data);
		
		if (m && m.length) {
			
			for (i = 0, l = m.length; (i < l) && (i < 10); i++) { // 10 = limit.
				
				$.fn[NS].format(data, m[i]);
				
			}
			
		} else {
			
			$.fn[NS].zilch(data);
			
		}
		
	},
	
	// http://stackoverflow.com/a/722732/922323
	// http://stackoverflow.com/a/14889628/922323
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
		
	},
	
	_clearSearchResults = function(data) {
		
		data.results.children().remove();
		
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
		
		data.results.append(
			
			data.settings.template.replace(/\{(.*?)\}/g, function(match, property) {
				
				return obj[$.trim(property)];
				
			})
			
		);
		
	};
	
	$.fn[NS].zilch = function(data) {
		
		data.results.append(data.settings.zilch);
		
	};
	
}(jQuery, window, document));
