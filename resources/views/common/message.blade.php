@if(Session::has('message'))
<script>
    $.notify("{{ session('message') }}", "success");
</script>
@endif

@if(Session::has('error_message'))
<script>
    $.notify("{{ session('error_message') }}", "error");
</script>
@endif