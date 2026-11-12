/* ---------------------------------------------
 Contact form
 --------------------------------------------- */
$(document).ready(function(){
    $(".js-submit-btn").click(function(){
        var form = $(this).closest('form');
        var fields = form.find('.js-field');
        var msg = '';
        var error = false;
        var form_msg = form.find('.js-form-msg');
        var form_loader = form.find('.js-form-loader');

        form_msg.html('');

        fields.each(function(k,v){
            if($.trim($(this).val())=='')
            {
                //console.log( $.trim($(this).val()) );
                msg = '* Todos los campos son requeridos.';
                error = true;
                form_msg.css('color','red').html(msg);
            }
        })

        if(!error)
        {
            $.ajax({
                type: "POST",
                url: "send.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(datos){
                    var color = (datos.status=='error' ? 'red' : 'green');
                    form_msg.css('color',color).html(datos.msg);
                    if(datos.status=='ok')
                    {
                        fields.each(function(k,v){
                            if($(this).attr('type')!='hidden')
                                $(this).val('');
                        });
                    }
                    form_loader.hide();
                },
                beforeSend: function(objeto){
                    form_loader.show();
                },
                complete: function(objeto, exito){
                    form_loader.hide();
                },
                error: function(objeto, quepaso, otroobj){
                    form_loader.hide();
                }
            });
        }

    });
});
