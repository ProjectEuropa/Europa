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
    $(".btn-edit").click(function(){
        if (confirm("この内容でユーザ情報を更新しますか？")){
        } else {
            //cancel
            return false;
        }
    });
});

