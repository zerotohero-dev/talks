function testProperties() {
    $(document.body).data('property', 'value');

    console.log($(document.body).data('property'));
}
