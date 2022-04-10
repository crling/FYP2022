
export function assign_tb_style(tids){
    $(tids).DataTable({
        columnDefs: [{
            targets: [0, -1],
            orderable: true,
        }],
        searching: false,
        lengthChange: false,
        // scrollX: true
    }); 

}

