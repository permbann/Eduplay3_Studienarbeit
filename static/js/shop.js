var last_selected = null; //Current Item on confirm status
var click = 0;      //Amount of clicks on item. 0= no selection 1 = confirm 2= purchased
var cost_list;

/**
 * Loads all necessary data to display the shop from database
 * eg. currency, costs of displayed items, previously purchased items
 * @param item_type menu selection eg. hats, shoes, gloves or accessories
 */
function load_item_data(item_type) {
    get_currency();
    get_cost(item_type);
    setTimeout(function () {
        get_items();
    }, 5);
}

/**
 * Gets all purchased items
 */
function get_items() {
    $.get("/api/get_items")
        .done(function (data) {
            update_buttons(data);
        });
}

/**
 * gets currency from database and updates currency display
 */
function get_currency() {
    $.get("/api/balance")
        .done(function (data) {
            currency = parseInt(data['currency']);
            document.getElementById("currency_label").innerHTML = "Currency: " + currency;
        });
}

/**
 *gets cost for all items currently displayed
 * returned as cost + item_id list
 * @param item_type item currently displayed eg. hats, gloves, shoes, accessories
 */
function get_cost(item_type) {
    if (item_type == 'hat') {
        $.get("/api/get_hat").done(function (data) {
            cost_list=data;
            update_cost(null);
        });
    }
    if (item_type == 'shoe') {
        $.get("/api/get_shoe").done(function (data) {
            cost_list=data;
            update_cost(null)
        });
    }
    if (item_type == 'glove') {
        $.get("/api/get_glove").done(function (data) {
            cost_list=data;
            update_cost(null)
        });
    }
    if (item_type == 'accessory') {
        $.get("/api/get_accessory").done(function (data) {
            cost_list=data;
            update_cost(null)
        });
    }
}

/**
 * updates buttons displaying item cost
 * updates all buttons on first load, only singular buttons during selection
 * @param item ID of item to get cost for
 * @returns cost if item_id is provided
 */
function update_cost(item) {
    if (item == null) {
        $.each(cost_list, function (index, value) {
            element = document.getElementById(value.item_id);
            element.value = value.cost;
        });
    } else {
        $.each(cost_list, function (index, value) {
            if (value.item_id == item) {
                cost = value.cost;
            }
        });
        return cost;
    }
}

/**
 * changes purchase buttons to equip buttons if specific item is already purchased
 * @param items list of all purchased items
 */
function update_buttons(items) {
    items.forEach(function (item){
        element = document.getElementById(item.item_id);
        if (element != null) {
            element.value = "Equip";
            element.style.backgroundColor = "#586573";
        }
    });
}

/**
 * called on button click
 * calls function to handle display of selected item
 *
 * only applies to first button clicked:
 * if a button is clicked for the first time and it's not the button of an already purchased item the value is changed to "Confirm?"
 * if the button is clicked a second time the function to purchase item is called
 * @param item item ID of selected item
 */
function add_item(item) {
    click += 1;
    if (last_selected != item && last_selected != null) {
        select_new_item(item, last_selected);
        last_selected = item;
    } else {
        if (click == 1 && item.value != 'Equip') {
            item.value = "Confirm?";
            item.style.backgroundColor = "#3fd14b";
            last_selected = item;
        } else {
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
function select_new_item(item, last_selected) {
    //if previously selected item is a purchased one it doesn't need to be reset to basic status but stay on purchased
    if (last_selected.value == 'Equip' && item.value != 'Equip') {
        item.value = "Confirm?";
        item.style.backgroundColor = "#3fd14b";
    }
    //if a purchased item is clicked the previously selected one should be unselected
    else if (item.value == 'Equip' && last_selected.value != 'Equip') {
        last_selected.value = update_cost(last_selected.id);
        last_selected.style.backgroundColor = "#2b5a8c";
    } else if (last_selected.value == 'Equip' && item.value == 'Equip') {
    } else {
        last_selected.value = update_cost(last_selected.id);
        last_selected.style.backgroundColor = "#2b5a8c";
        item.value = "Confirm?";
        item.style.backgroundColor = "#3fd14b";
    }
}

/**
 * adds an item to the players inventory after purchasing it
 * @param item purchased item to add to inventory
 */
function purchase_item(item) {
    $.ajax({
        type: "PUT",
        data: {"item_id": item.id},
        url: "/api/add_item",
        success: function (response) {
            get_items();
        }
    });
}

function dress_mascot() {
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

function equip(item) {
    $.post("/inventory/equip", item.id)
        .done(function () {
            dress_mascot();
        });
}