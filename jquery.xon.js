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
		onStart : $.noop,
		onChange : $.noop,
		onComplete : $.noop 
	};

	/**
	 * Global Config API
	 */
	$.xon = function( extend ) {		
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

		//triggered event object
		//for xoff
		if(arr[ 0 ] && arr[ 0 ].handleObj){
			
			fn = arr[ 0 ].handleObj.handler;
			arr[ 0 ].handleObj.handler = fn.xon;

			return arr;
		}

		//when object types
		if ( typeof arr[ 0 ] === "object" ){

			for ( type in arr[ 0 ] ) {
				fn = arr[ 0 ][ type ];
				arr[ 0 ][ type ] = fn.xon || new wrapFn( elem, fn );
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

		arr[ idx ] = fn.xon || new wrapFn( elem, fn );
		return arr;
	}

	function toArray( args ) {
		return Array.prototype.slice.call(args);
	}

	// http://phpjs.org/functions/ucfirst/
	function ucfirst(str) {
		var f;
		str += '';
		f = str.charAt(0).toUpperCase();
		return f + str.substr(1);
	}

	/**
	 * wrapper constructor
	 * wrapFnConstructor, wrapFn, fn등 3개의 인스턴스가 존재함
	 * fn이 사용자 등록 핸들러. wrapFn이 실제 이벤트 핸들러 객체라면 wrapFnConstructor은 wrapFn을 백그라운드 관리 객체
	 */
	var wrapFn = function( elem, fn ) {

		//event prepare scope
		//this -> wrapFn instance
		
		var ins, wrapped;
		ins = this;

		//default props
		ins.isLock = false;
		ins.elem = elem;
		//ins.option = null;
		//ins.el = null;
		//ins.submit = null;

		//real event handler
		wrapped = function( evt ) {
			var xhr, preventDefault;

			//evnt trigger scope
			//this -> origial el, $(this) == elem
			
			if ( !ins.option ) {
				ins.setOption( evt );
			}

			if ( !ins.el ) {
				//if submit -> ins.submit == ins.el
				ins.setEl( evt );
			}

			//throttle
			if ( ins.isLock ) {
				return ;
			}

			ins.lock();
			ins.trigger( 'start', evt );

			//for preventDefault;
			preventDefault = true;

			xhr = fn.call( this, evt, function() {
				preventDefault = false;
			} );


			//ajax와 관련있음으로 기본적으로 preventDefault 한다.
			//그러나 사용자가 원할 경우 기본이벤트 실행할수 있도록 한다.
			if ( preventDefault ) {
				evt.preventDefault();
			}

			if ( xhr && xhr.always ) {

				xhr.always( function() {
					ins.trigger( 'complete', evt );
					ins.unlock();
				} );

			} else { 
				ins.trigger( 'complete', evt );
				ins.unlock();
				return xhr;
			}
		};

		//insert wrapFn for xoff
		//순환참조 일어나지 않을 것 같은뎅 모르겠다. 쉽게 간다.
		fn.xon = wrapped;

		return wrapped;
	};

	//method
	wrapFn.prototype = {
		constructor : wrapFn,

		setEl: function( evt ) {

			var elem, submit, opt;

			elem = this.elem;
			opt = this.option;
			submit = elem.find( ':submit' );

			if ( evt.type === "submit" && submit.length > 0 ) {
				this.el = this.submit = submit;
			} else {
				this.el = elem;
			}
		},

		setOption: function( evt ) {

			if ( evt.data && evt.data.xon ) {
				this.option = $.extend( {}, Config, evt.data.xon );
			} else {
				this.option = Config;
			}
		},

		lock: function() {
			var opt;
			opt = this.option;

			this.isLock = true;
			this.el.attr( opt.offAttr, "true" );

			if ( this.submit && opt.offAttr !== "disabled" ) {
				this.submit.prop( "disabled", true );
			}
		},

		unlock: function() {
			var opt;
			opt = this.option;

			this.isLock = false;
			this.el.removeAttr( opt.offAttr );

			if ( this.submit && opt.offAttr !== "disabled" ) {
				this.submit.prop( "disabled", false );
			}
		},

		trigger: function( cbName, evt ) {
			var opt, cb;

			opt = this.option;
			cb = opt[ 'on' + ucfirst( cbName ) ];

			//registered callback trigger
			opt.onChange.call( this.el, evt );
			cb.call( this.el, evt );
			
			//jquery elem evt trigger
			this.elem.trigger( 'xon:' + cbName );
			this.elem.trigger( 'xon:change' );
		}
	};

	/**
	 * API
	 */
	var Xon = $.fn.xon = function() {
		return this.on.apply( this, repack( this, arguments ) );
	};

	var Xone = $.fn.xone = function() {
		return this.one.apply( this, repack( this, arguments ) );
	};	

	var Xoff = $.fn.xoff = function() {
		return this.off.apply( this, repack( this, arguments ) );
	};

})( window, document, jQuery );