;(function(window,document){
	var MobDebug={};
	MobDebug.version="1.0.0";
	MobDebug.cssUrl="mob-debug.css";
	MobDebug._console={};//实现自身的console

	loadStylesheet(MobDebug.cssUrl);//加载样式

	//获取html模板
	Function.prototype.getMultiLine=function(){
		var str=new String(this);
		str=str.substring(str.indexOf("/*")+2,str.indexOf("*/"));
		return str;
	}

	//重载chrome的console.log
	console.log = (function() {
    	var log = console.log;

	    return function(exception) {
	        if (typeof exception.stack !== 'undefined') {
	            log.call(console, exception.stack);
	        } else {
	            log.apply(console, arguments);
	        }

	        MobDebug._console.log.apply(this,arguments);
	    }
	})();

	//定义模板
	var t=function(){
		/*<section id="mobDebug" class="hello bdbox">
			<ul class="ctrl">
				<li class="j-debug-console">控制台</li>
				<li class="j-debug-refresh">刷新</li>
				<li class="j-debug-hide">隐藏</li>
			</ul>
		</section>

		<seciton id="mobDebug-console" class="bdbox">
		</seciton>
		
		<a href="javascript:;" id="mobDebug-show" style="display:none;"></a>*/
	}

	//初始化
	var init=function(){
		var $debug=S("#mobDebug"),
			$debugConsole=S("#mobDebug-console");

		//如果没有debug工具则插入dom
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
			$btn_show=S("#mobDebug-show",$wrap);

		//刷新
		$btn_refresh.addEventListener("click",function(){
			window.location.reload();
		},false);

		//显示控制栏
		$btn_show.addEventListener("click",function(){
			hide.apply($btn_show);
			show.apply($debug);
			show.apply($debugConsole);
		},false);

		//隐藏控制栏
		$btn_hide.addEventListener("click",function(){
			show.apply($btn_show);
			hide.apply($debug);
			hide.apply($debugConsole);
		},false);

		//显示or隐藏控制台
		$btn_console.addEventListener("click",function(){
			var curDisplay=$debugConsole.style.display;

			(curDisplay=="block" || curDisplay=="") ? hide.apply($debugConsole) : show.apply($debugConsole);
		},false);

		//实现自身的console.log
		MobDebug._console.log=function(){
			var logsArr=Array.prototype.slice.call(arguments);
			var fragment=document.createDocumentFragment();

			logsArr.forEach(function(log){
				var log=handleObject(log),
					ele=document.createElement("p"),
					text=document.createTextNode(log);

				ele.appendChild(text);
				ele.className="info";
				fragment.appendChild(ele);
			});

			$debugConsole.appendChild(fragment);
		}
	};

	//简单选择器
	function S(selector,parentsNode){
		parentsNode ? parentsNode=parentsNode : parentsNode=document;
		var ele=parentsNode.querySelectorAll(selector);
		if(ele.length==1) ele=ele[0];
		return ele;
	}

	//显示
	function show(){
		this.style.display="block";
	}

	//隐藏
	function hide(){
		this.style.display="none";
	}

	//加载样式
	function loadStylesheet(url){
		var sheet=document.createElement("link");
		sheet.rel="stylesheet";
		sheet.type="text/css";
		sheet.href=url;
		document.head.appendChild(sheet);
	}

	//处理自身输出对象的格式
	function handleObject(obj){
		var type=Object.prototype.toString.call(obj).toLowerCase();

		switch(type){
			case "[object string]":return obj;break;
			case "[object array]":
			case "[object object]":return JSON.stringify(obj);break;
		}
	}

	MobDebug.start=init;

	// CommonJS
	if ( typeof module === "object" && typeof module.exports === "object" ) {
	    module.exports = MobDebug;
	} else {
	    window.MobDebug = MobDebug;
	}
})(window,document);