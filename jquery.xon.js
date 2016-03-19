/*!
 * jQuery.xon.js 
 * sertion@innorix.com
 * https://github.com/skt-t1-byungi/jQuery.xon
 */
(function( win, doc, $ ){

	'use strict';

	//Global Config
	var Config = {
		offAttr : "disabled",
	};

	/**
	 * Global Config API
	 */
	$.xon = function ( extend ) {		
		if( extend ){
			$.extend( Config, extend );
		}
		return Config;
	};

	/**
	 * functions
	 */
	function repack( elem, args ) {
		var arr, type, fn, idx;

		arr = toArray( args );

		//when object types
		if ( typeof arr[ 0 ] === "object" ){

			for ( type in arr[ 0 ] ) {
				fn = arr[ 0 ][ type ];
				arr[ 0 ][ type ] = new wrapFn( elem, fn );
			}
			return arr;
		}

		//find event handler
		idx = arr.length;
		while ( --idx >= 0 ) {
			if ( typeof arr[ idx ] === "function" ) {
				fn = arr[ idx ];
				break;
			}
		}

		if ( !fn ) {
			return arr;
		}

		arr[ idx ] = new wrapFn( elem, fn );
		return arr;
	}

	function toArray( args ) {
		return Array.prototype.slice.call(args);
	}

	/**
	 * wrapper constructor
	 */
	var wrapFn = function ( elem, fn ) {

		//event prepare scope
		//this -> wrapFn instance
		
		var ins;
		ins = this;

		//default props
		ins.isLock = false;
		//ins.config = null;
		//ins.el = null;
		//ins.submit = null;

		//real event handler
		return function ( evt ) {
			var xhr;

			//evnt trigger scope
			//this -> origial el, $(this) == elem
			
			if ( !ins.config ) {
				ins.setConf( evt );
			}

			if ( !ins.el ) {
				//if submit -> ins.submit == ins.el
				ins.setEl( elem );
			}

			//throttle
			if ( ins.isLock ) {
				return ;
			}

			ins.lock();
			xhr = fn.call( this, evt );

			if ( xhr && xhr.always ) {

				if( !evt.isDefaultPrevented() ){
					evt.preventDefault();
				}

				xhr.always( function() {
					ins.unlock();
				} );

			} else { 
				ins.unlock();
				return xhr;
			}
		};
	};

	//method
	wrapFn.prototype = {
		constructor : wrapFn,

		setEl: function ( elem ) {

			var submit, conf;

			conf = this.config;
			submit = elem.find(':submit');

			if ( submit.length > 0 ) {
				this.el = this.submit = submit;
			} else {
				this.el = elem;
			}
			
			this.el.attr( conf.offAttr, "true" );
		},

		setConf: function ( evt ) {

			if ( evt.data && evt.data.xon ) {
				this.config = $.extend( {}, Config, evt.data.xon );
			} else {
				this.config = Config;
			}
		},

		lock: function ( el ) {
			var conf;
			conf = this.config;

			this.isLock = true;
			this.el.attr( conf.offAttr, "true" );

			if ( this.submit && conf.offAttr !== "disabled" ) {
				this.submit.prop( "disabled", true );
			}
		},

		unlock: function ( el ) {
			var conf;
			conf = this.config;

			this.isLock = false;
			this.el.removeAttr( conf.offAttr );

			if ( this.submit && conf.offAttr !== "disabled" ) {
				this.submit.prop( "disabled", false );
			}
		}
	};

	/**
	 * API
	 */
	var Xon = $.fn.xon = function() {
		return this.on.apply( this, repack( this, arguments ) );
	};

})( window, document, jQuery );