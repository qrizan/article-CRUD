$(document).ready(function(){
	$('.delete-article').on('click', function(){
		var id = $(this).data('id');
		var url = '/delete/'+id;

		if (confirm('Delete article ?')){
			$.ajax({
				url: url,
				type: 'DELETE',
				success: function(result){
					console.log('Delete...');
					window.location.href='/';					
				},
				error: function(err){
					console.log(err);
				}
			});
		}
	});
});