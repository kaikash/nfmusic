class Modal 
	id: ""
	type: ""
	title: ""
	text: ""
	init: () =>
		console.log @
		modalBoxId = "modal_box_" + (Math.floor(Math.random()*10000))
		$("body").append  "<div class='modal-box' id='" + modalBoxId + "'>  <div class='modal'><div class='modal-header'>  <h4>Simple title</h4>  <div class='close'>    <i></i>  </div></div><div class='modal-body'>  Simple text</div><div class='modal-footer'>  <div class='btn btn-primary yes'>да</div>  <div class='btn no'>нет</div>  <div class='btn ok'>Ok</div></div>  </div></div>"
		@id = modalBoxId
		if @type == 'ok' then $("#" + @id + " .modal").addClass "ok"
		if @type == 'confirm' then $("#" + @id + " .modal").addClass "confirm"
		$("#" + @id + " h4").html @title
		$("#" + @id + " .modal-body").html @text
	show: (callback) ->
		setTimeout () =>
			$("#" + @id).addClass "show"
			$("#" + @id + " .modal").addClass "show"
		, 10
		$("#" + @id + " .yes").on "click", () =>
			$("#" + @id + " .yes").off "click"
			$("#" + @id + " .no").off "click"
			$("#" + @id + " .btn.ok").off "click"
			$("#" + @id + " .close").off "click"
			$("#" + @id + " .modal").removeClass "show"
			setTimeout () =>
				$("#" + @id).removeClass "show"
			, 300
			callback true
		$("#" + @id + " .close, " + "#" + @id + " .no, " + "#" + @id + " .btn.ok").on "click", () =>
			$("#" + @id + " .btn.ok").off "click"
			$("#" + @id + " .yes").off "click"
			$("#" + @id + " .no").off "click"
			$("#" + @id + " .close").off "click"
			$("#" + @id + " .modal").removeClass "show"
			setTimeout () =>
				$("#" + @id).removeClass "show"
			, 300
			callback false