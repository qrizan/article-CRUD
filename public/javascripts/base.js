$(document).ready(function(){
	$('.delete-article').on('click', function(){
		var id = $(this).data('id');
		var image = $(this).data('image');
		var url = '/delete/'+id+'/'+image;

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

	$('.edit-article').on('click', function(){
		$('#edit-title').val($(this).data('title'));
		$('#edit-body').val($(this).data('body'));		
		$('#edit-oldimage').val($(this).data('image'));				
		$('#edit-id').val($(this).data('id'));			
	});
});