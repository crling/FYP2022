$(window).unload(function() {
    $.rails.enableFormElements($($.rails.formSubmitSelector));
  });

  $.fn.dataTable.ext.errMode = 'throw';

$(function () { 
  var ids = [];
  var table = $('.display').DataTable({
    bJQueryUI: true,
    columnDefs: [{
      targets: 0,
      orderable: false, 
      className: 'select-checkbox',
      checkboxes: {
        selectRow: true
      } 
    },
    {
      targets: -1,
      orderable: false, 
    }],
    scrollX: true
  }); 

  // $('.s_table_sub').on("click", function(e){
  //   var form = this;
  //   var selected_ids = Array.from(ids)
  //   // Iterate over all selected checkboxes
  //   $.each(selected_ids, function(index, id){
  //     // Create a hidden element
  //     $(form).append(
  //       $('<input>')
  //         .attr('type', 'hidden')
  //         .attr('name', 'sample_ids[]')
  //         .val(id)
  //     );
  //   });
  //   console.log("submitting");
  // });

  $('button.toggle-vis').on( 'click', function (e) {
    e.preventDefault();
    $(this).toggleClass('clicked');
    // Get the column API object
    var column = table.column( $(this).attr('data-column') );
    // Toggle the visibility
    column.visible( ! column.visible() );
  });

});

function toggle_checkall(field_name, state) {
    var checkboxes = document.getElementsByTagName('input');
    var count = checkboxes.length;
    for (var i = 0; i < count; i++) {
      if (checkboxes[i].type == "checkbox"
          && checkboxes[i].name == field_name + "_ids[]") {
        checkboxes[i].checked = state;
      }
    }
}