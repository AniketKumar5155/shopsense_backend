CREATE TABLE product_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO product_categories (name) VALUES 
    ("Electronics"),
    ("Clothing"),
    ("Home Appliances"),
    ("Books"),
    ("Sports"),
    ("Beauty"),
    ("Toys"),
    ("Automobile"),
    ("Groceries"),
    ("Furniture");