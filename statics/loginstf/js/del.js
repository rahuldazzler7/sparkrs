$(document).ready(function(){
    $('.delete_item').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url:'/home/'+id,
            success : function(response){
                alert('Deleting post');
                window.location.herf='/home';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});