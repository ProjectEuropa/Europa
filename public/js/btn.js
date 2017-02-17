/*
 ボタン制御関連Javascript
 */
$(function () {
    $(".btn-delete").on('click', function () {
        if (confirm($(this).val() + "を本当に削除しますか？")) {
        } else {
            //確認ダイアログキャンセル時はsubmitキャンセル
            return false;
        }
    });
    $(".btn-edit").on('click', function () {
        if (confirm("この内容でユーザ情報を更新しますか？")) {
        } else {
            //確認ダイアログキャンセル時はsubmitキャンセル
            return false;
        }
    });
    $("#inquirySend").on('click', function () {
        if (confirm("この内容で問い合わせ内容を送信しますがよろしいですか？")) {
        } else {
            //確認ダイアログキャンセル時はsubmitキャンセル
            return false;
        }
    });
});

