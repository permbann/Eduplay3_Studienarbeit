var last_selected = null; //Current Item on confirm status
var cost_list;
var equipped;
var item_type;
var currency = 0;

/**
 * Loads all necessary data to display the shop from database
 * eg. currency, costs of displayed items, previously purchased items
 * @param item_type menu selection eg. hats, shoes, shirts or accessories
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
    $.get("/api/currency")
        .done(function (data) {
            currency = parseInt(data['currency']);
            document.getElementById("currency_label").innerHTML = "Tokens: " + currency;
        });
}

/**
 * subtracts item price from currency if currency > item price
 * @param item purchased item
 */
function update_currency(item) {
    currency = update_cost(item.id);
    $.ajax({
        type: "PATCH",
        data: {"currency": -currency},
        url: "/api/update_currency",
        success: function () {
            get_currency();
        }
    });
}

/**
 * checks whether user currency is high enough to purchase item
 * @param item purchased item
 */
function check_payable(item) {
    if (update_cost(item.id) > currency) {
        window.confirm("Deine Tokens reichen nicht aus um diesen Gegenstand zu kaufen.");
        throw new Error("Not enough Tokens");
    }
}

/**
 *gets cost for all items currently displayed
 * returned as cost + item_id list
 * @param item_type item currently displayed eg. hats, shirts, shoes, accessories
 */
function get_cost(item_type) {
    if (item_type == 'hat') {
        $.get("/api/get_hat").done(function (data) {
            cost_list = data;
            update_cost(null);
        });
    }
    if (item_type == 'shoe') {
        $.get("/api/get_shoe").done(function (data) {
            cost_list = data;
            update_cost(null)
        });
    }
    if (item_type == 'shirt') {
        $.get("/api/get_shirt").done(function (data) {
            cost_list = data;
            update_cost(null)
        });
    }
    if (item_type == 'accessory') {
        $.get("/api/get_accessory").done(function (data) {
            cost_list = data;
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
    items.forEach(function (item) {
        element = document.getElementById(item.item_id);
        if (element != null && (equipped == null || item.item_id != equipped.id)) {
            element.value = "Ausrüsten";
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
        if (item_type == 'hat') {
            element = document.getElementById(value.hat);
        } else if (item_type == 'shoe') {
            element = document.getElementById(value.shoe);
        } else if (item_type == 'shirt') {
            element = document.getElementById(value.shirt);
        } else {
            element = document.getElementById(value.accessory);
        }
            last_selected = element;
            element.value = "Ausgerüstet";
            element.style.backgroundColor = "#00b0d1";
    });
}

/**
 * called on button click
 * calls function to handle display of selected item
 *
 * only applies to first button clicked:
 * if a button is clicked for the first time and it's not the button of an already purchased item the value is changed to "Kaufen?"
 * if the button is clicked a second time the function to purchase item is called
 * @param item item ID of selected item
 */
function add_item(item) {
    if (last_selected != item && last_selected != null) {
        if (item.value == "Ausrüsten") {
            deselect_item(item, last_selected);
            equip_item(item, last_selected);
            last_selected = item;
        } else {
            deselect_item(item, last_selected);
            select_new_item(item);
            last_selected = item;
        }
    } else {
        switch (item.value) {
            default:
                item.value = "Kaufen?";
                item.style.backgroundColor = "#3fd14b";
                break;
            case "Kaufen?":
                purchase_item(item);
                break;
            case "Ausrüsten":
                equip_item(item, last_selected);
                break;
            case "Ausgerüstet":
                item.value = "Ausrüsten";
                item.style.backgroundColor = "#586573";
                remove_equipped(item);
                break;
        }
        last_selected = item;
    }
}

/**
 * Updates button text and colour after click
 * @param item - Button of the item that has been clicked
 */
function select_new_item(item) {
    switch (item.value) {
        default:
            item.value = "Kaufen?";
            item.style.backgroundColor = "#3fd14b";
            break;
        case "Kaufen?":
            item.value = "Ausrüsten";
            item.style.backgroundColor = "#586573";
            break;
        case "Ausrüsten":
            item.value = "Ausgerüstet";
            item.style.backgroundColor = "#00b0d1";
            break;
        case "Ausgerüstet":
            item.value = "Ausrüsten";
            item.style.backgroundColor = "#586573";
            remove_equipped(item);
            undress_mascot();
            break;
    }
}

/**
 * reverts button of the previously clicked item to previous value
 * @param item newly clicked item button
 * @param last_selected previously selected item button, button to revert
 */
function deselect_item(item, last_selected) {
    switch (last_selected.value) {
        default:
            last_selected.value = "Kaufen?";
            last_selected.style.backgroundColor = "#3fd14b";
            break;
        case "Kaufen?":
            last_selected.value = update_cost(last_selected.id);
            last_selected.style.backgroundColor = "#2b5a8c";
            break;
        case "Ausrüsten":
            break;
        case "Ausgerüstet":
            break;
    }
}

/**
 * Changes buttons between  'Ausrüsten' and 'Ausgerüstet'
 * only 1 item can be equipped at a time
 * @param item item to chzange to 'Ausgerüstet'
 * @param last_selected previously selected item to revert to previous state
 */
function equip_item(item, last_selected) {
    if (equipped == null) {
        switch (item.value) {
            default:
                last_selected.value = update_cost(last_selected.id);
                last_selected.style.backgroundColor = "#2b5a8c";
                item.value = "Ausgerüstet";
                item.style.backgroundColor = "#00b0d1";
                break;
            case "Ausrüsten":
                item.value = "Ausgerüstet";
                item.style.backgroundColor = "#00b0d1";
                break;
            case "Ausgerüstet":
                item.value = "Ausrüsten";
                item.style.backgroundColor = "#586573";
                remove_equipped(item);
                break;
        }
    } else {
        switch (item.value) {
            default:
                item.value = "Ausgerüstet";
                item.style.backgroundColor = "#00b0d1";
                equipped.value = "Ausrüsten";
                equipped.style.backgroundColor = "#586573";
                break;
            case "Ausrüsten":
                item.value = "Ausgerüstet";
                item.style.backgroundColor = "#00b0d1";
                equipped.value = "Ausrüsten";
                equipped.style.backgroundColor = "#586573";
                break;
            case "Ausgerüstet":
                item.value = "Ausrüsten";
                item.style.backgroundColor = "#586573";
                remove_equipped(item);
                break;
        }
    }
    undress_mascot();
    equipped = item;
    add_equipped(equipped);
    dress_mascot();
}

function remove_equipped(item) {
    undress_mascot();
    item_id = item.id.toString();
    var item_type;
    var request_body = {};
    if (item_id.includes("hat")) {
        item_type = "hat";
    } else if (item_id.includes("shoe")) {
        item_type = "shoe";
    } else if (item_id.includes("shirt")) {
        item_type = "shirt";
    } else {
        item_type = "accessory";
    }
    request_body[item_type] = null;
    $.ajax({
        type: "PUT",
        data: request_body,
        url: "/api/add_equipped",
        success: function (response) {
        }
    });
    dress_mascot();
}


/**
 * Adds the equipped item into the database, only 1 item at a time
 * @param item newly equipped item
 */
function add_equipped(item) {
    item_id = item.id.toString();
    var item_type;
    var request_body = {};
    if (item_id.includes("hat")) {
        item_type = "hat";
    } else if (item_id.includes("shoe")) {
        item_type = "shoe";
    } else if (item_id.includes("shirt")) {
        item_type = "shirt";
    } else {
        item_type = "accessory";
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
    check_payable(item);
    $.ajax({
        type: "PUT",
        data: {"item_id": item.id},
        url: "/api/add_item",
        success: function (response) {
            get_items();
        }
    });
    update_currency(item);
}

/**
 * removes previously equipped item in specific category from mascot
 */
function undress_mascot() {
    $.get("/api/get_equipped")
        .done(function (data) {
                $.each(data, function (key, value) {
                    switch (value.hat) {
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
                    switch (value.shoe) {
                        case"shoe_11":
                            document.getElementById("rain_boots").style.display = "none";
                            break;
                        case"shoe_12":
                            document.getElementById("blue_socks").style.display = "none";
                            break;
                        case"shoe_13":
                            document.getElementById("red_socks").style.display = "none";
                            break;
                        case"shoe_14":
                            document.getElementById("sneakers").style.display = "none";
                            break;
                        case"shoe_21":
                            document.getElementById("crocs").style.display = "none";
                            break;
                        case"shoe_22":
                            document.getElementById("boots").style.display = "none";
                            break;
                        case"shoe_23":
                            document.getElementById("ribbon_shoes").style.display = "none";
                            break;
                        case"shoe_24":
                            document.getElementById("black_boots").style.display = "none";
                            break;
                    }
                                switch (value.shirt) {
                    case"shirt_11":
                        document.getElementById("flower_top").style.display = "none";
                        break;
                    case"shirt_12":
                        document.getElementById("green_shirt").style.display = "none";
                        break;
                    case"shirt_13":
                        document.getElementById("red_sweater").style.display = "none";
                        break;
                    case"shirt_14":
                        document.getElementById("pink_jacket").style.display = "none";
                        break;
                    case"shirt_21":
                        document.getElementById("simley_top").style.display = "none";
                        break;
                    case"shirt_22":
                        document.getElementById("purple_shirt").style.display = "none";
                        break;
                    case"shirt_23":
                        document.getElementById("blue_hoodie").style.display = "none";
                        break;
                    case"shirt_24":
                        document.getElementById("leather_jacket").style.display = "none";
                        break;
                }
                    switch (value.accessory) {
                        case"accessory_11":
                            document.getElementById("lightsaber").style.display = "none";
                            break;
                        case"accessory_12":
                            document.getElementById("necklace").style.display = "none";
                            break;
                        case"accessory_13":
                            document.getElementById("plush").style.display = "none";
                            break;
                        case"accessory_14":
                            document.getElementById("scarf_blue").style.display = "none";
                            break;
                        case"accessory_21":
                            document.getElementById("scarf_red").style.display = "none";
                            break;
                        case"accessory_22":
                            document.getElementById("glasses").style.display = "none";
                            break;
                        case"accessory_23":
                            document.getElementById("sunglasses").style.display = "none";
                            break;
                        case"accessory_24":
                            document.getElementById("cat").style.display = "none";
                            break;
                    }
                });
            });
}

function dress_mascot() {
    $.get("/api/get_equipped")
        .done(function (data) {
            $.each(data, function (key, value) {
                switch (value.hat) {
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
                switch (value.shoe) {
                    case"shoe_11":
                        document.getElementById("rain_boots").style.display = "block";
                        break;
                    case"shoe_12":
                        document.getElementById("blue_socks").style.display = "block";
                        break;
                    case"shoe_13":
                        document.getElementById("red_socks").style.display = "block";
                        break;
                    case"shoe_14":
                        document.getElementById("sneakers").style.display = "block";
                        break;
                    case"shoe_21":
                        document.getElementById("crocs").style.display = "block";
                        break;
                    case"shoe_22":
                        document.getElementById("boots").style.display = "block";
                        break;
                    case"shoe_23":
                        document.getElementById("ribbon_shoes").style.display = "block";
                        break;
                    case"shoe_24":
                        document.getElementById("black_boots").style.display = "block";
                        break;
                }
                switch (value.shirt) {
                    case"shirt_11":
                        document.getElementById("flower_top").style.display = "block";
                        break;
                    case"shirt_12":
                        document.getElementById("green_shirt").style.display = "block";
                        break;
                    case"shirt_13":
                        document.getElementById("red_sweater").style.display = "block";
                        break;
                    case"shirt_14":
                        document.getElementById("pink_jacket").style.display = "block";
                        break;
                    case"shirt_21":
                        document.getElementById("simley_top").style.display = "block";
                        break;
                    case"shirt_22":
                        document.getElementById("purple_shirt").style.display = "block";
                        break;
                    case"shirt_23":
                        document.getElementById("blue_hoodie").style.display = "block";
                        break;
                    case"shirt_24":
                        document.getElementById("leather_jacket").style.display = "block";
                        break;
                }
                switch (value.accessory) {
                    case"accessory_11":
                        document.getElementById("lightsaber").style.display = "block";
                        break;
                    case"accessory_12":
                        document.getElementById("necklace").style.display = "block";
                        break;
                    case"accessory_13":
                        document.getElementById("plush").style.display = "block";
                        break;
                    case"accessory_14":
                        document.getElementById("scarf_blue").style.display = "block";
                        break;
                    case"accessory_21":
                        document.getElementById("scarf_red").style.display = "block";
                        break;
                    case"accessory_22":
                        document.getElementById("glasses").style.display = "block";
                        break;
                    case"accessory_23":
                        document.getElementById("sunglasses").style.display = "block";
                        break;
                    case"accessory_24":
                        document.getElementById("cat").style.display = "block";
                        break;
                }
            });
        });
}


