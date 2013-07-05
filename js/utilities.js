function addPages() {
	for(var i=1; i<5; i++) {
			var page = $("<div>").jqmData("role", "page").attr("id", "page6-1-" + i);
	
			// header
			$("<div>").attr("data-role", "header").append($("<h1>")
				.html("ページ" + i)).appendTo(page);
	
			// content
			$("<div>").attr("data-role", "content").append($("<p>")
				.html("ページ" + i + "のコンテンツ"))
				.appendTo(page);
			
			$("body").append(page);
			
			$("<li>").append($("<a>").attr("href", "#page6-1-"+i)
				.html("ページ" + i + "へ"))
				.appendTo("#list1");
	}
	$("#button1").hide();
	$("#list1").listview();
//		$("#list1").listview('refresh');
};
