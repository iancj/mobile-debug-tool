/*
 * mob-debug.js
 * by iancj 2015-05-07
 * https://github.com/iancj/mobile-debug-tool
 * mobile web console debug tool
**/

;(function(window,document){
	var MobDebug={};

	MobDebug.version="1.0.1";

	MobDebug.cssUrl="mob-debug.css";
	
	MobDebug._console=null;

	loadStylesheet(MobDebug.cssUrl);//load style sheet

	//get template to html
	Function.prototype.getMultiLine=function(){
		var str=new String(this);
		str=str.substring(str.indexOf("/*")+2,str.indexOf("*/"));
		return str;
	}

	//mobdebug template
	var t=function(){
		/*<section id="mobDebug" class="hello bdbox">
			<ul class="ctrl">
				<li class="j-debug-console">Console</li>
				<li class="j-debug-refresh">Refresh</li>
				<li class="j-debug-hide">Hide</li>
			</ul>
		</section>

		<seciton id="mobDebug-console" class="bdbox">
			<input type="text" id="mobDebug-command" class="bdbox" placeholder="Please enter command line">
		</seciton>
		
		<a href="javascript:;" id="mobDebug-show" style="display:none;"></a>*/
	}

	//initialize
	var init=function(){
		var $debug=S("#mobDebug"),
			$debugConsole=S("#mobDebug-console");

		//insert debug tool to body
		if(!$debug.length) {
			var $wrap=document.createElement("section");
			$wrap.className="mobDebug-wrap";
			$wrap.innerHTML=t.getMultiLine();
			S("body").appendChild($wrap);

			$debug=S("#mobDebug",$wrap);
			$debugConsole=S("#mobDebug-console",$wrap);
		}

		var $btn_console=S(".j-debug-console",$debug),
			$btn_refresh=S(".j-debug-refresh",$debug),
			$btn_hide=S(".j-debug-hide",$debug),
			$btn_show=S("#mobDebug-show",$wrap),
			$ip_command=S("#mobDebug-command",$debugConsole);

		//refresh page
		$btn_refresh.addEventListener("click",function(){
			window.location.reload();
		},false);

		//show the debug tool
		$btn_show.addEventListener("click",function(){
			hide.apply($btn_show);
			show.apply($debug);
			show.apply($debugConsole);
		},false);

		//hide the debug tool
		$btn_hide.addEventListener("click",function(){
			show.apply($btn_show);
			hide.apply($debug);
			hide.apply($debugConsole);
		},false);

		//show or hide the console panel
		$btn_console.addEventListener("click",function(){
			var curDisplay=$debugConsole.style.display;

			(curDisplay=="block" || curDisplay=="") ? hide.apply($debugConsole) : show.apply($debugConsole);
		},false);

		//get commmand line and execute
		$ip_command.addEventListener("keyup",function(e){
			if(e.which==13){
				MobDebug.eval(this.value);
				this.value="";
			}
		},false);

		//override console
		console.log = (function() {
	    	var log = console.log;

		    return function(exception) {
		        if (typeof exception.stack !== 'undefined') {
		            log.call(console, exception.stack);
		        } else {
		            log.apply(console, arguments);
		        }

		        MobDebug._console("log",Array.prototype.slice.call(arguments));
		    }
		})();

		console.error = (function() {
	    	var error = console.error;

		    return function(exception) {
		        if (typeof exception.stack !== 'undefined') {
		            error.call(console, exception.stack);
		        } else {
		            error.apply(console, arguments);
		        }

		        MobDebug._console("error",Array.prototype.slice.call(arguments));
		    }
		})();

		MobDebug._console=function(type,logsArr){
			var fragment=document.createDocumentFragment();

			logsArr.forEach(function(val){
				var val=handleObject(val),
					ele=document.createElement("p"),
					text=document.createTextNode(val);

				ele.appendChild(text);
				ele.className="info info-"+type.toString().toLowerCase();
				fragment.appendChild(ele);
			});

			$debugConsole.insertBefore(fragment,$ip_command);
			$debugConsole.scrollTop=$debugConsole.scrollHeight;
		}

		MobDebug.eval=function(command){
			var text;
	        var error;
	        try {
	            text = window.eval(command);
	        } catch (e) {
	            text = e.message;
	            error = true;
	        }
	        if (JSON && JSON.stringify) {
	            try {
	                text = JSON.stringify(text);
	            } catch (e) {
	                text = e.message;
	                error = true;
	            }
	        }
	        
	        if(error) console.error(text)
		}
	};

	//simple selector
	function S(selector,parentsNode){
		parentsNode ? parentsNode=parentsNode : parentsNode=document;
		var ele=parentsNode.querySelectorAll(selector);
		if(ele.length==1) ele=ele[0];
		return ele;
	}

	//show element
	function show(){
		this.style.display="block";
	}

	//hide element
	function hide(){
		this.style.display="none";
	}

	//load style sheet
	function loadStylesheet(url){
		var sheet=document.createElement("link");
		sheet.rel="stylesheet";
		sheet.type="text/css";
		sheet.href=url;
		document.head.appendChild(sheet);
	}

	//object to string handler
	function handleObject(obj){
		var type=Object.prototype.toString.call(obj).toLowerCase();

		switch(type){
			case "[object string]":return obj;break;
			case "[object array]":
			case "[object number]":
			case "[object boolean]":
			case "[object touchlist]":
			case "[object touch]":
			case "[object object]":return JSON.stringify(obj);break;
		}
	}

	//exports
	MobDebug.start=init;

	// CommonJS
	if ( typeof module === "object" && typeof module.exports === "object" ) {
	    module.exports = MobDebug;
	} else {
	    window.MobDebug = MobDebug;
	}
})(window,document);