var last_selected = null; //Current Item on confirm status
var cost_list;
var equipped;
var item_type;
var equipped_list;

/**
 * Loads all necessary data to display the shop from database
 * eg. currency, costs of displayed items, previously purchased items
 * @param item_type menu selection eg. hats, shoes, gloves or accessories
 */
function load_item_data(item_type_name) {
    item_type = item_type_name;
    get_currency();
    get_cost(item_type);
    setTimeout(function () {
        get_items();
    }, 5);
    setTimeout(function () {
        get_equipped();
    }, 5);
    dress_mascot();
}

/**
 * Gets all purchased items
 */
function get_items() {
    $.get("/api/get_items")
        .done(function (data) {
            update_equip_buttons(data);
        });
}

/**
 * Gets all equipped items
 */
function get_equipped() {
    $.get("/api/get_equipped")
        .done(function (data) {
            update_equipped_buttons(data);
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
function update_equip_buttons(items) {
    items.forEach(function (item){
        element = document.getElementById(item.item_id);
        if (element != null && (equipped ==null || item.item_id != equipped.id)) {
            element.value = "Equip";
            element.style.backgroundColor = "#586573";
        }
    });
}

/**
 * changes purchase buttons to equip buttons if specific item is already purchased
 * @param items list of all purchased items
 */
function update_equipped_buttons(items) {
    $.each(items, function (key, value) {
        if (item_type =='hat'){
            element = document.getElementById(value.hat);
        }else if (item_type =='shoe'){
            element = document.getElementById(value.shoe);
        }else if (item_type =='glove'){
            element = document.getElementById(value.glove);
        }else{
            element = document.getElementById(value.acccessory);
        }
            last_selected = element;
            element.value = "Equipped";
            element.style.backgroundColor = "#00b0d1";
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
    if (last_selected != item && last_selected != null) {
        if (item.value =="Equip"){
            deselect_item(item, last_selected);
            equip_item(item, last_selected);
            last_selected = item;
        }else {
            deselect_item(item, last_selected);
            select_new_item(item);
            last_selected = item;
        }
    } else {
        switch (item.value) {
            default:
                item.value = "Confirm?";
                item.style.backgroundColor = "#3fd14b";
                break;
            case "Confirm?":
                purchase_item(item);
                break;
            case "Equip":
                if (equipped != null) {
                equip_item(item, last_selected);
                }else{
                    item.value = "Equipped";
                    item.style.backgroundColor = "#00b0d1";
                    add_equipped(item);
                    equipped=item;
                }
                break;
            case "Equipped":
            break;
        }
        last_selected = item;
    }
}

function select_new_item(item){
    switch (item.value){
        default:
            item.value = "Confirm?";
            item.style.backgroundColor = "#3fd14b";
            break;
        case "Confirm?":
            item.value = "Equip";
            item.style.backgroundColor = "#586573";
            break;
        case "Equip":
            item.value = "Equipped";
            item.style.backgroundColor = "#00b0d1";
            break;
        case "Equipped":
            break;
    }
}

function deselect_item(item, last_selected){
    switch (last_selected.value){
        default:
            last_selected.value = "Confirm?";
            last_selected.style.backgroundColor = "#3fd14b";
            break;
        case "Confirm?":
            last_selected.value = update_cost(last_selected.id);
            last_selected.style.backgroundColor = "#2b5a8c";
            break;
        case "Equip":
            break;
        case "Equipped":
            if (item.value == 'Equip') {
                last_selected.value = "Equip";
                last_selected.style.backgroundColor = "#586573";
            }
            break;
    }
}


function equip_item(item, last_selected) {
    if (equipped == null) {
        switch (item.value){
            default:
                last_selected.value = update_cost(last_selected.id);
                last_selected.style.backgroundColor = "#2b5a8c";
                item.value = "Equipped";
                item.style.backgroundColor = "#00b0d1";
            break;
            case "Equip":
                item.value = "Equipped";
                item.style.backgroundColor = "#00b0d1";
                break;
        }
    }else{
        switch (item.value){
            default:
                item.value = "Equipped";
                item.style.backgroundColor = "#00b0d1";
                equipped.value = "Equip";
                equipped.style.backgroundColor = "#586573";
                break;
            case "Equip":
                item.value = "Equipped";
                item.style.backgroundColor = "#00b0d1";
                equipped.value = "Equip";
                equipped.style.backgroundColor = "#586573";
                break;
            case "Equipped":

        }
    }
    undress_mascot();
    equipped = item;
    add_equipped(equipped);
    dress_mascot();
}


function add_equipped(item){
    item_id = item.id.toString();
    var item_type;
    var request_body = {};
    if(item_id.includes("hat")){
        item_type="hat";
    } else if(item_id.includes("shoe")){
         item_type="shoe";
    } else if(item_id.includes("glove")){
         item_type="glove";
    } else{
        item_type="accessory";
    }
    request_body[item_type] = item_id;
    $.ajax({
        type: "PUT",
        data: request_body,
        url: "/api/add_equipped",
        success: function (response) {
            get_equipped();
        }
    });
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

function undress_mascot(){
    $.get("/api/get_equipped")
        .done(function (data) {
        $.each(data, function (key, value) {
            switch (value.hat){
                case"hat_11":
                    document.getElementById("blue_cap").style.display = "none";
                    break;
                case"hat_12":
                    document.getElementById("crown").style.display = "none";
                    break;
                case"hat_13":
                    document.getElementById("top_hat").style.display = "none";
                    break;
                case"hat_14":
                    document.getElementById("headband").style.display = "none";
                    break;
                case"hat_21":
                    document.getElementById("flower").style.display = "none";
                    break;
                case"hat_22":
                    document.getElementById("butterfly").style.display = "none";
                    break;
                case"hat_23":
                    document.getElementById("santa_hat").style.display = "none";
                    break;
                case"hat_24":
                    document.getElementById("bunny_ears").style.display = "none";
                    break;
            }
        });
    });
}

function dress_mascot() {
    $.get("/api/get_equipped")
        .done(function (data) {
        $.each(data, function (key, value) {
        console.log("new: " + value.hat);
            switch (value.hat){
                case"hat_11":
                    document.getElementById("blue_cap").style.display = "block";
                    break;
                case"hat_12":
                    document.getElementById("crown").style.display = "block";
                    break;
                case"hat_13":
                    document.getElementById("top_hat").style.display = "block";
                    break;
                case"hat_14":
                    document.getElementById("headband").style.display = "block";
                    break;
                case"hat_21":
                    document.getElementById("flower").style.display = "block";
                    break;
                case"hat_22":
                    document.getElementById("butterfly").style.display = "block";
                    break;
                case"hat_23":
                    document.getElementById("santa_hat").style.display = "block";
                    break;
                case"hat_24":
                    document.getElementById("bunny_ears").style.display = "block";
                    break;
            }
        });
    });
}

