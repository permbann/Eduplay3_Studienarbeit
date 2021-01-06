DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS inventory;

CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  jumps INTEGER NOT NULL,
  currency INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
    item_id VARCHAR(100) PRIMARY KEY,
    cost INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory (
    user_id INTEGER NOT NULL,
    item_id VARCHAR(100),
    FOREIGN KEY (user_id) references user(id),
    FOREIGN KEY (item_id) references items(item_id)
);


CREATE TABLE inventory (
  user_id VARCHAR(100) NOT NULL,
  item_id VARCHAR(100) NOT NULL,
  PRIMARY KEY (user_id, item_id)
);