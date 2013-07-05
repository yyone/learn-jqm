(function($) {
	// ウィジェットの定義
	$.widget( "mobile.dynamicimage", $.mobile.widget, {
		options: {
			margin: 0, width: 100
		},
		
		_create: function() {
			this._loadURL();
		},
		
		// プライベートメソッド
		_loadURL: function() {
			// this.elementは対象のimg要素を表す

			var url; // サービスURL
			url = "http://src.sencha.io/";
			
			var parameters = "";
			if(!isNaN(this.options.width)) {
				parameters += this.options.width;
			}
			if((!isNaN(this.options.margin)) && this.options.margin > 0) {
				parameters += "-" + this.options.margin;
			}
			if(parameters.length > 0) {
				url += parameters + "/";
			}
			
			// Sencha.io Srcでは絶対にURLを指定する必要がある
			var originalUrl = $(this.element).jqmData("src");
			if(originalUrl.length > 1) {
				var newUrl = "";
				if($.mobile.path.isAbsoluteUrl(originalUrl)) {
					// 変換の必要はない
					newUrl = originalUrl;
				} else {
					// 相対URLを絶対URLに変換
					var baseUrl = $.mobile.path.parseUrl(location.href);
					var baseUrlWithoutScript = baseUrl.protocol + "//" + baseUrl.host + baseUrl.directory;
					newUrl = $.mobile.path.makeUrlAbsolute(originalUrl, baseUrlWithoutScript);
				}
				
				url += newUrl;
				
				$(this.element).attr("src", url);
			}
		},
		
		// パブリックメソッド
		enable: function() {
			// ウィジェットを有効化
			$(this.element).attr('disabled', '');
		},
		disable: function() {
			// ウィジェットを無効化
			$(this.element).removeAttr('disabled');
		},
		refresh: function() {
			// ウィジェットの表示を更新
			this._loadURL();
		},
	});
	// ここまでウィジェットの定義
	
	// 自動初期化のコード
	$(document).bind("pagecreate", function(event) {
		// 該当するロールを持つ要素を探し、ウィジェットのコンストラクタを用意する
		$(event.target).find("img:jqmData(role='dynamic-image')").dynamicimage();
	});
}(jQuery));
