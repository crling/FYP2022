import {init as hist}  from "viz/static_histogram"
import {init as donghnut}  from "viz/static_donghnut"
import {init as boxplot} from "viz/static_grouped-boxplot"
import {init as tree} from "viz/static_tree"
import {assign_tb_style} from "./overview-style.js"

export function viz(vid, vdata){
    var paths = vdata["file"];
    var type = vdata["type"];
    var config = vdata["config"];
    switch (type){
        case "hist":{
            hist(vid, paths[0], config);
            break;
        }
        case "boxplot":{
            boxplot(vid, paths[0], config);
            break;
        }
        case "tree":{
            tree(vid, paths, config);
            break;
        }
        
        case "donghnut":{
            donghnut(vid, paths[0], config);
            break;
        }
        default:{
            
        }
    }

}

export function description(hid, des_data){
    document.getElementById(hid).innerHTML = des_data;
}

export function table(tid, tb_data){
    //create table
    var tb = document.createElement("table");
    tb.className = "display";
    tb.id = tid;
    //class = "display"

    //create th
    var thead = document.createElement("thead");
    var tr  = document.createElement("tr");
    var th_content = tb_data["head"];
    var ncol = th_content.length;
    for (var i=0; i<ncol; i++){
        var th = document.createElement("th");
        th.innerHTML = th_content[i];
        tr.appendChild(th);
    }
    thead.appendChild(tr);


    //create tbody
    var tbody = document.createElement("tbody");
    var tb_contents = tb_data["body"];
    var nrow = tb_contents.length;
    for(var i=0; i<nrow; i++){
        var tr  = document.createElement("tr");
        for (var j=0; j<ncol; j++){
            var td = document.createElement("td");
            td.innerHTML = tb_contents[i][j];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    // embedded
    tb.appendChild(thead);
    tb.appendChild(tbody);
    return tb
}

export function selector(sid, slt_data){
    var slt = document.createElement("select");
    slt.className = "form-select col";
    slt.id = sid;
    slt.name = sid;
    // create options
    var first = true;
    for(var option in slt_data){
        var op = document.createElement("option");
        if(first){
            op.selected = true;
            first = false;
        }
        op.innerHTML = option;
        op.value = slt_data[option];
        slt.appendChild(op);
    }
    return slt;
}

export function text(pid, str){
    var p = document.createElement("p");
    p.id = pid;
    p.innerHTML = str;
    return p;
}



export function construct_block(Bid, block_data){
    var block_div = document.createElement("div");
    block_div.className = "container Block";
    block_div.id = Bid;

    var keys = Object.keys(block_data);
    var key = keys[0];
    var selects = block_data[key];

    var ncontent = key.length;
    var i = 0;

    // create text description if any
    if(key[0]=="H"){
        var cid = "H"+Bid
        var head_block = document.createElement("div");
        head_block.id = cid;
        head_block.className = "row description";
        block_div.appendChild(head_block);
        key = key.substring(1);
        ncontent -= 1;
    }


    // first create selects row
    var slt_row = document.createElement("div");
    slt_row.className = "select_bar form-inline row";
    var nslt = selects.length;

    // create select element
    // update function: title on select box
    for(var j=0; j<nslt; j++){
        var sblock = document.createElement("div");
        var stitle = document.createElement('div');
        var selectbox = selects[j]['select'];
        sblock.className = "sdiv col";
        stitle.className = "select_title"
        stitle.innerHTML = selects[j]['title'];
        var sid = 'S'+j+Bid;
        var slt = selector(sid, selectbox);
        sblock.append(stitle);
        sblock.append(slt);
        slt_row.appendChild(sblock);
    }
    block_div.appendChild(slt_row);

    
    
    // then create content
    var block = document.createElement("div");
    block.className = "row";
    
    for(var i=0; i<ncontent; i++){
        var type = key[i];
        var cid = type+i+Bid
        var content_block = document.createElement("div");
        content_block.id = cid;
        if(ncontent>1 && i==0){
            content_block.className = "col-md-4";
        }
        else if(ncontent>1 && i==1){
            content_block.className = "col-md-8";
        }
        else{
            content_block.className = "col";
        }
        
        block.appendChild(content_block);
    }
    block_div.appendChild(block);
    return block_div
}

// by this function, all containers are made and added in body element
export function makeHTMLframe(body, struct_data){
    var nBlock = struct_data.length;
    for(var i=0; i<nBlock; i++){
        var id = "B"+i;
        var B = construct_block(id, struct_data[i]);
        body.appendChild(B);
    }
}

// fill in the block with data, (table, text, viz for default value)
export function fillinblock(cid, relation_key, relation_data, content_data){
    // is description
    if(cid[0] == 'H'){
        var hdk = relation_data['h'][relation_key];
        var hdata = content_data['h'][hdk];
        var hid = cid;
        description(hid, hdata);
    }
    
    // have graph
    if(cid[0] == 'V'){
        var vdk = relation_data["v"][relation_key];
        var vdata = content_data['v'][vdk]; 
        var vid = "#" + cid;
        viz(vid, vdata);
    }
    // have table
    if(cid[0] == 'T'){
        //console.log(relation_key);
        var tdk = relation_data["t"][relation_key];
        //console.log(tdk);
        var tdata = content_data["t"][tdk];
        //console.log(tdata);
        var container = document.getElementById(cid);
        var tid = "t"+cid;
        container.innerHTML = '';
        var tb = table(tid, tdata);
        container.appendChild(tb);
        
    }
    
    // have text
    if(cid[0] == 'X'){
        var xdk = relation_data["x"][relation_key];
        var xdata = content_data["x"][xdk];
        var container = document.getElementById(cid);
        var xid = "x"+cid;
        container.innerHTML = '';
        var text = text(xid, xdata);
        container.appendChild(text);

    }

    
}


export function initPage(main_id, data, tids){
    
    var struct_data = data["struct"];
    var relation_data = data["relation"];
    var init_data = data["init"];
    var content_data = data["content"];
    var body = document.getElementById(main_id);
    makeHTMLframe(body, struct_data);
    for (var key in init_data){
        fillinblock(key, init_data[key], relation_data, content_data);
    }
    assign_tb_style(tids);

}


export function catch_change(data, tids){
    
    $('select').on('change', function() {
        //console.log(data);
        var struct_data = data["struct"];
        var relation_data = data["relation"];
        var content_data = data["content"];
        var bro = this.parentElement.parentElement.children;
        //console.log(bro);
        var outer_block = this.parentElement.parentElement.parentElement;
        var nbro = bro.length;
        //console.log(nbro);
        var new_k = "";
        for (var i=0; i<nbro; i++){
            if (i>0){
                new_k += "_";
            }
            //console.log('string' + new_k);
            new_k += bro[i].children[1].value;  
            //console.log(bro[i].children);
        }
        //console.log(new_k);
        var B_i = parseInt(outer_block.id[1]);
        //console.log(B_i);
        //console.log(struct_data[B_i]);
        var type_key = Object.keys(struct_data[B_i])[0];
        //console.log(type_key);
        var ntype = type_key.length;
        if(type_key[0]=="H"){
            ntype -= 1;
            type_key = type_key.substring(1);
        }
        
        //console.log(type_key);
        for (var i=0; i<ntype; i++){
            var cid = type_key[i] + i + outer_block.id;
            console.log(cid);
            fillinblock(cid, new_k, relation_data, content_data);
        }
        if (Object.keys(struct_data[B_i])[0].includes("T")){
            assign_tb_style(tids);
        }
                
    });
}