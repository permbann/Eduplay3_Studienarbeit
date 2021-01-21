 var last_selected = null; //Current Item on confirm status
 var click = 0;      //Amount of clicks on item. 0= no selection 1 = confirm 2= purchased

 function load_item_data(item_type){
     get_currency();
    get_cost(item_type);
    setTimeout(function(){ get_items(); }, 5);
    dress_mascot();
 }

    function get_items(){
        $.get("/inventory/get")
            .done(function (data) {
                purchased_items = JSON.parse(data);
                update_buttons(purchased_items);
            });
    }

    function get_currency(){
      $.get("/currency/get")
            .done(function (data) {
                currency = parseInt(data['currency']);
                document.getElementById("currency_label").innerHTML = "Currency: " + currency;
            });
    }
    
    function get_cost(item_type){
        if (item_type == 'hat') {
            $.get("/shop/gethat").done(function (data) {
                item_costs = JSON.parse(data);
                update_cost(item_costs, null)
            });
        }
        if (item_type == 'shoe') {
            $.get("/shop/getshoe").done(function (data) {
                item_costs = JSON.parse(data);
                update_cost(item_costs, null)
            });
        }
         if (item_type == 'glove') {
            $.get("/shop/getglove").done(function (data) {
                item_costs = JSON.parse(data);
                update_cost(item_costs, null)
            });
        }
          if (item_type == 'accessory') {
            $.get("/shop/getaccessory").done(function (data) {
                item_costs = JSON.parse(data);
                update_cost(item_costs, null)
            });
        }
    }

    function update_cost(item_costs, item){
        if (item == null) {
            for (i = 0; i < item_costs.length; i++) {
                element = document.getElementById(item_costs[i]["item_id"]);
                element.value = item_costs[i]["cost"];
            }
        }else{
            for (i = 0; i < item_costs.length; i++) {
                if (item_costs[i]["item_id"] == item){
                    return item_costs[i]["cost"];
                }
            }
        }
    }

    // changes purchase buttons to equip buttons if items already purchased
    function update_buttons(items){
        for (i = 0; i < items.length; i++) {
            item_id = items[i];
            element = document.getElementById(item_id);
            if (element != null) {
                element.value = "Equip";
                element.style.backgroundColor = "#586573";
            }
        }
    }

    function add_item(item) {
        click += 1;
        if (last_selected != item && last_selected != null) {
            select_new_item(item, last_selected);
            last_selected = item;
        }
        else {
            if (click == 1 && item.value!='Equip') {
                item.value = "Confirm?";
                item.style.backgroundColor = "#3fd14b";
                last_selected = item;
            }
            else {
                purchase_item(item);
                click = 0;
            }
        }
    }

 /**
  * Changes Buttons between displaying price, "Confirm" and "Equip" depending on their status
  * @param item currently selected item
  * @param last_selected previously clicked on item
  */
 function select_new_item(item, last_selected){
    //if previously selected item is a purchased one it doesn't need to be reset to basic status but stay on purchased
    if (last_selected.value=='Equip' && item.value!='Equip'){
        item.value = "Confirm?";
        item.style.backgroundColor ="#3fd14b";
    }
    //if a purchased item is clicked the previously selected one should be unselected
    else if(item.value=='Equip' && last_selected.value!='Equip') {
        last_selected.value = update_cost(item_costs, last_selected.id);
        last_selected.style.backgroundColor = "#2b5a8c";
    }
    else if(last_selected.value=='Equip' && item.value=='Equip'){
    }
    else{
        last_selected.value = update_cost(item_costs, last_selected.id);
        last_selected.style.backgroundColor="#2b5a8c";
        item.value = "Confirm?";
        item.style.backgroundColor ="#3fd14b";
    }
}

    function purchase_item(item){
        $.post("/inventory/add", item.id)
            .done(function () {
                get_items();
            });
    }

    function dress_mascot(){
        $.get("/inventory/equipped").done(function (data) {
            items = JSON.parse(data);
            if (items != null) {
                document.getElementById("blue_cap").style.display = "block";
            }
            /*
            for (i = 0; i < items.length; i++) {
                item_id = items[i];
                if (item_id =='hat_11' || 'hat_12' || 'hat_13' || 'hat_14'){
                    hat=1;
                }
                if (item_id == 'hat_11' && hat==0){
                    document.getElementById("blue_cap").style.display ="block";
                    hat=1;
                }else if (item_id == 'hat_12' && hat==0) {
                    document.getElementById("crown").style.display = "block";
                    hat=1;
                }else if (item_id == 'hat_13' && hat==0) {
                    document.getElementById("top_hat").style.display = "block";
                    hat=1;
                }else if (item_id == 'hat_14' && hat==0) {
                    document.getElementById("headband").style.display = "block";
                    hat=1;
                }else{
                }
            }
             */
        });
    }

    function equip(item){
     $.post("/inventory/equip", item.id)
            .done(function () {
                dress_mascot();
            });
    }