CREATE TABLE customer(
    id SERIAL,
    username VARCHAR(25) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    picture VARCHAR(500) NOT NULL ,
    phone_number varchar(20) NOT NULL,
    last_password_update timestamp(0) not null default now(),
    PRIMARY KEY(id)
);
CREATE TABLE address_detail(
    id SERIAL,
    address_line VARCHAR(255),
    city VARCHAR(25),
    region VARCHAR(25),
    postal_code VARCHAR(10),
    PRIMARY KEY(id)
);
CREATE TABLE customer_address(
    customer_id BIGINT UNSIGNED not null,
    address_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_customer_customer_address Foreign Key (customer_id) REFERENCES customer(id),
    CONSTRAINT fk_address_customer_address Foreign Key (address_id) REFERENCES address_detail(id)
);

CREATE TABLE shipment(
    id SERIAL,
    shipment_date timestamp(0),
    address_id BIGINT UNSIGNED NOT NULL,
    customer_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_customer_shipment Foreign Key (customer_id) REFERENCES customer(id),
    CONSTRAINT fk_address_shipment Foreign Key (address_id) REFERENCES address_detail(id)
);
CREATE TABLE category(
    id SERIAL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    PRIMARY KEY(id)
);
CREATE TABLE promotion(
    id SERIAL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    discount_rate DECIMAL(5,2) NOT NULL,
    start_date timestamp(0) NOT NULL,
    end_date timestamp(0) NOT NULL,
    PRIMARY KEY(id),
);
CREATE TABLE promotion_category(
    category_id BIGINT UNSIGNED,
    promotion_id BIGINT UNSIGNED,
    CONSTRAINT fk_category_promotion Foreign Key (category_id) REFERENCES category(id),
    CONSTRAINT fk_promotion_promotion_category Foreign Key (promotion_id) REFERENCES promotion(id)
);
CREATE TABLE product(
    id SERIAL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    stock INT NOT NULL,
    image varchar(255) default 'https://ik.imagekit.io/neuros123/product-placeholder-wp.jpg?updatedAt=1710562973427',
    category_id BIGINT UNSIGNED,
    PRIMARY KEY(id),
    CONSTRAINT fk_product_category Foreign Key (category_id) REFERENCES category(id)
);
create table variation(
	id SERIAL,
	category_id BIGINT UNSIGNED not null,
	name varchar(25) not null,
    PRIMARY KEY(id),
	constraint fk_category_variation foreign key (category_id) references category(id)
);
create table variation_option(
	id SERIAL,
	variation_id BIGINT UNSIGNED not null,
	value varchar(100) not null,
    PRIMARY KEY(id),
	constraint fk_variation_option foreign key (variation_id) references variation(id)
);
create table product_config(
	product_id BIGINT UNSIGNED not null,
	variation_option_id BIGINT UNSIGNED not null,
    PRIMARY KEY(id),
	constraint fk_product_config foreign key (product_id) references product(id),
	constraint fk_product_variation_option foreign key (variation_option_id) references variation_option(id)
);

create table payment_method(
	id SERIAL,
	name varchar(25) not null,
    PRIMARY KEY(id)
);
create TABLE payment(
    id SERIAL,
    last_payment_date timestamp(0) not null default now() + interval '2' day,
    amount INT NOT NULL,
    customer_id BIGINT UNSIGNED NOT NULL,
    payment_method_id BIGINT UNSIGNED not null,
    PRIMARY KEY(id),
    CONSTRAINT fk_customer_payment Foreign Key (customer_id) REFERENCES customer(id),
    CONSTRAINT fk_payment_method Foreign Key (payment_method_id) REFERENCES payment_method(id)
);


CREATE TABLE order_detail(
    id SERIAL,
    order_date timestamp(0) not null default now(),
    total_price INT NOT NULL,
    customer_id BIGINT UNSIGNED NOT NULL,
    shipment_id BIGINT UNSIGNED,
    payment_id BIGINT UNSIGNED,
    PRIMARY KEY(id),
    CONSTRAINT fk_customer_order_detail Foreign Key (customer_id) REFERENCES customer(id),
    CONSTRAINT fk_payment_order_detail Foreign Key (payment_id) REFERENCES payment(id),
    CONSTRAINT fk_shipment_order_detail Foreign Key (shipment_id) REFERENCES shipment(id)

);
CREATE TABLE order_item(
    id SERIAL,
    quantity INT NOT NULL,
    price INT NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED,
    PRIMARY KEY(id),
    CONSTRAINT fk_order_order_item Foreign Key (order_id) REFERENCES order_detail(id),
    CONSTRAINT fk_product_order_item Foreign Key (product_id) REFERENCES product(id)


);
CREATE TABLE wishlist(
    id SERIAL,
    customer_id BIGINT UNSIGNED,
    product_id BIGINT UNSIGNED,
    PRIMARY KEY(id),
    CONSTRAINT fk_customer_wishlist Foreign Key (customer_id) REFERENCES customer(id),
    CONSTRAINT fk_product_wishlist Foreign Key (product_id) REFERENCES product(id)
);
CREATE TABLE cart(
    id SERIAL,
    quantity INT,
    customer_id BIGINT UNSIGNED,
    product_id BIGINT UNSIGNED,
    PRIMARY KEY(id),
    CONSTRAINT fk_customer_cart Foreign Key (customer_id) REFERENCES customer(id),
    CONSTRAINT fk_product_cart Foreign Key (product_id) REFERENCES product(id)
);




INSERT INTO category(name, description)
VALUES ('electronics', 'electronic category'),
       ('home goods', 'home good category'),
       ('clothings', 'clothing category');

delimiter |
CREATE TRIGGER update_password AFTER UPDATE ON customer
        FOR EACH ROW
        BEGIN
        IF NEW.password != OLD.password THEN
		set NEW.last_password_update = CURRENT_TIMESTAMP()
		where id = old.id;
	    END IF;
        END;
        |
delimiter ;

CREATE TRIGGER `payment_exp` BEFORE INSERT ON payment
    FOR EACH ROW
    SET NEW.last_payment_date =  DATE_ADD(CURRENT_TIMESTAMP(),INTERVAL 2 DAY)