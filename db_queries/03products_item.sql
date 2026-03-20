CREATE TABLE products_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discounted_price DECIMAL(10,2),
    brand VARCHAR(100),
    
    rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INT DEFAULT 0,
    
    weight DECIMAL(10,2),
    stock INT DEFAULT 0,
    
    image_url VARCHAR(500),
    category_id INT,
    
    is_active BOOLEAN DEFAULT TRUE,
    is_hidden BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);