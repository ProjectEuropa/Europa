/* 
    ボタン制御関連Javascript
 */
 $(function(){
    $(".btn-delete").click(function(){
        if (confirm($(this).val() + "を本当に削除しますか？")){
        } else {
            //cancel
            return false;
        }
    });
});

