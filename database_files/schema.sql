DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS equipped;

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

CREATE TABLE inventory (
  user_id VARCHAR(100) NOT NULL,
  item_id VARCHAR(100) NOT NULL,
  PRIMARY KEY (user_id, item_id)
);

CREATE TABLE equipped (
  user_id VARCHAR(100) NOT NULL,
  item_id VARCHAR(100) NOT NULL,
  item_type VARCHAR(100) NOT NULL,
  PRIMARY KEY (user_id, item_id)
);