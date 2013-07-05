var data;

$(document).bind("mobileinit", function() {
	
	if(navigator.standalone!=undefined) {
		// iOSデバイス上で実行されています。
		// フルスクリーン表示されているか否かをチェックします。
		if(!navigator.standalone) {
			showIOSInvitation();
		}
	}
	
	// セッション一覧のページが表示される際に、最新のデータをチェックします。
	$("#sessions").live("pageshow", function() {
		
		if(window.localStorage!=undefined) {
			// HTML5のWeb Strogeを利用できます
			if(window.localStorage.getItem("data")!=undefined &&
			   window.localStorage.getItem("data")!=null) {
				//更新をチェックする前に、まずオフラインのデータを読み込む
				showSessions(window.localStorage.getItem("data"));
				$("#console").html("データの更新をチェック中");
			} else {
				// ストレージにデータがキャッシュされていない
				$("#console").html("セッションのデータをダウンロード中・・・");
			}
		} else {
			// HTML5のストレージに非対応。JSONデータを毎回ダウンロードする
			$("#console").html("セッションのデータをダウンロード中・・・");
		}
		
		loadSessionsAjax();
	});
});

function showIOSInvitation() {
	setTimeout(function() {
		// アプリケーションがすべてダウンロードされるまでの間、インストール方法の説明は非表示にする
		$("#install").hide();
		// iOS向けに、ホーム画面への追加方法を表示
		$.mobile.changePage($("#ios"), {transition: "slideup", changeHash: false});
	}, 100);
	
	// HTML5のオフラインAPIで提供されるイベントを利用し、適切な情報を表示する
	if (window.applicationCache!=undefined) {
		window.applicationCache.addEventListener('checking', function() {
			$("#consoleInstall").html("バージョンをチェック中");
		});

		window.applicationCache.addEventListener('downloading', function() {
			$("#consoleInstall").html("アプリケーションのダウンロード中。お待ちください・・・");
		});

		window.applicationCache.addEventListener('cached', function() {
			$("#consoleInstall").html("アプリケーションのダウンロード完了");
			$("#install").show();
		});

		window.applicationCache.addEventListener('updateready', function() {
			$("#consoleInstall").html("アプリケーションのダウンロード完了");
			$("#install").show();
		});

		window.applicationCache.addEventListener('noupdate', function() {
			$("#consoleInstall").html("アプリケーションのダウンロード完了");
			$("#install").show();
		});

		window.applicationCache.addEventListener('error', function(e) {
			$("#consoleInstall").html("アプリケーションのダウンロード中にエラー発生");
		});

		window.applicationCache.addEventListener('obsolete', function(e) {
			$("#consoleInstall").html("アプリケーションのダウンロード中にエラー発生");
		});
	}	
}

function loadSessionsAjax() {
	// ストレージに保管しやすいよう、JSONデータは文字列として受け取る
	$.ajax("sessions.json", {
		complete: function(xhr) {
			if(window.localStorage!=undefined) {
				if(window.localStorage.getItem("data")!=undefined &&
				   window.localStorage.getItem("data")!=null) {
					if(xhr.responseText==window.localStorage.getItem("data")) {
						// ダウンロードされたデータは現在表示されているものと同一
						$("#console").html("スケジュールの更新完了");
					} else {
						// セッションのデータが更新されている
						if(confirm("最新のスケジュールを利用できます。今すぐ読み込みますか？")) {
							$("#console").html("スケジュールの更新完了");
							showSessions(xhr.responseText);
						} else {
							$("#console").html("スケジュールは最新の状態です");
						}
					}
				} else {
					// ストレージは利用可能だが、データはまだキャッシュされていない
					$("#console").html("スケジュールの更新完了");
					showSessions(xhr.responseText);
				}
			} else {
				// ストレージは利用できない。データを保存せずに表示させる
				$("#console").html("スケジュールの更新完了");
				showSessions(xhr.responseText);
			}
		},
		dataType: 'text',
		error: function() {
			$("#console").html("スケジュールのダウンロードに失敗");
		}
	});
}

var isFirstLoad = true;

function showSessions(string) {
	if(window.JSON!=undefined) {
		data = JSON.parse(string);
	} else {
		data = eval("(" + string + ")");
	}
	
	if(window.localStorage!=undefined) {
		// 新しいデータを文字列として保管する
		window.localStorage.setItem("data", string);
	}
	
	$("#slots").html("");
	
	var html = "";
	for(var i=0,count=data.slots.length; i<count; i++) {		
		if(data.slots[i].message!=null) {
			// 特別扱いの時間帯はセパレータとして表示
			html += "<li data-role='list-divider' data-groupingtheme='e'>" +
				data.slots[i].time + ": " + data.slots[i].message + "</li>";
		} else {
			// セッションが行われる通常の時間帯
			html += "<li><a href='javascript:showDetails(" + i + ")'>" +
				data.slots[i].time + "からのセッション</a></li>";
		}
	}
	
	$("#slots").html(html);
	
	if(isFirstLoad) {
		$("#slots").listview();
		isFirstLoad = false;
	} else {
		$("#slots").listview('refresh');
	}
}

function showDetails(index) {
	$("#detals h1").html(data.slots[index].time + "のセッション");
	var html = "";
	for(var i=0,count=data.sessions.length; i<count; i++) {
		if(data.sessions[i].timeId==data.slots[index].id) {
			// 折りたたみ可能なコンテンツをセッション毎に生成する
			html += "<div data-role='collapsible'>";
			html += "<h3>" + data.sessions[i].title + "</h3>";
			html += "<h3>" + data.sessions[i].room + "</h3>";
			html += "<h4>発表者： " + data.sessions[i].speaker;
			html += "</h4>";
			html += "<p>" + data.sessions[i].description + "</p>";
			html += "</div>";
		}
	}
	// 詳細のページに情報をセット
	$("#sessionInfo").html(html);
	$("#sessionInfo div").collapsible();
	
	// 詳細のページに移動
	$.mobile.changePage($("#details"));
}

function refresh() {
	$("#console").html("データを確認中・・・");
	loadSessionsAjax();
}

function openWithoutInstallation() {
	// インストール方法を表示したダイアログから戻る
	$.mobile.changePage($("#home"), {transition:"slideup", reverse:true});
}
