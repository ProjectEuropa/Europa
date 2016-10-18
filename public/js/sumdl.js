/* 
 sumdl制御関連Javascript
 */
$(function () {
    $('#parentCheck').on('click', function () {
        $('.childCheck').prop('checked', this.checked);
    });
});

