$(document).ready(function() {


	function loadpage() {
		$.ajax({
			type: 'GET',
			url: '/v1/feeds',
			dataType: 'json',
			data: JSON.stringify({'name': 'mugunth'}),
			contentType: 'application/json'
		}).done(function (data) {
			//if (data.result!='null') {
			$.each(data.result, function (index, item) {
				$("#result").append('<div class="all_feeds"><p class="para" style="text-align: center">' + item.feed + '</p>' +
					"<button type=\"button\" class=\"delete\" value=".concat(item.id, ">Delete</button>") +
					"<button type=\"button\" class=\"update\" value=".concat('up' + item.id, ">Update</button>") +
					'<hr></div>');
			});
			//}
		});
	}
	loadpage()

	$(window).scroll(function() {
   		if($(window).scrollTop() + $(window).height() == $(document).height()) {
   			console.log('bot')
       loadpage();
   		}
	});


	$('form').on('submit', function(event) {
		let feed = $('#feedID').val()
		$.ajax({
			contentType: 'application/json',
			data :JSON.stringify( {
				name : $('#nameID').val(),
				feed : feed
			}),
			type : 'POST',
			url : '/v1/feeds',
			dataType: 'json'
		}).done(function(data) {
			$("#result").append('<div class="all_feeds"><p class="para">' + feed + '</p>' +
					"<button type=\"button\" class=\"delete\" value=".concat(data.id, ">Delete</button>") +
					"<button type=\"button\" class=\"update\" value=".concat('up'+data.id, ">Update</button>")+
					'<hr></div>');
		});

		event.preventDefault();
		$(this).trigger('reset')

	});



	$(document).on("click", ".delete", function(){
  		let id = $(this).val();
		$(this).parent().remove();
		$.ajax({
			url: '/v1/feeds/' + id,
			type: 'DELETE'
		});
	});


	$(document).on("click", ".update", function(){
		let up_button = $(this)
		up_button.css('display', 'none')
		let text_inside = $(this).parent().children(".para").text();
		$(this).parent().children('.para').html(
			`<input id="update_box" type="text" value="${text_inside}" required style="width: 30%;" >`+
			`<button style="margin: 3%" id="to_change_button">okay</button>`);
		$('#to_change_button').click(
					function(){
						let new_text = $('#update_box').val()
						if (new_text.length != 0) {
							$('#update_box').replaceWith('<p class="para">' + new_text + '</p>');

							$.ajax({
								url: '/v1/feeds/' + up_button.val(),
								data: JSON.stringify({
									new_text: new_text
								}),
								contentType: "application/json",
								type: 'PUT'
							});
						}
						else {
							alert("field should not be empty");
							$('#update_box').replaceWith('<p class="para">' + text_inside + '</p>');
						}
						$('#to_change_button').remove();
						up_button.css('display', 'inline-block');

					});
	});

});