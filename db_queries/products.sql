CREATE TABLE products (
    product_id INT,
    category_id INT,

    PRIMARY KEY(product_id, category_id),

    FOREIGN KEY (product_id) REFERENCES products_items(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE CASCADE
);