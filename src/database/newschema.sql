-- hms_individual_api_project.address_detail definition

CREATE TABLE `address_detail` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `address_line` varchar(255) DEFAULT NULL,
  `city` varchar(25) DEFAULT NULL,
  `region` varchar(25) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `recipient` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- hms_individual_api_project.category definition

CREATE TABLE `category` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- hms_individual_api_project.customer definition

CREATE TABLE `customer` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(25) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `picture` varchar(500) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `last_password_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `verified` tinyint(1) DEFAULT '0',
  `role` varchar(10) DEFAULT 'customer',
  `google_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- hms_individual_api_project.order_note definition

CREATE TABLE `order_note` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `note` varchar(200) DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- hms_individual_api_project.payment_method definition

CREATE TABLE `payment_method` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- hms_individual_api_project.promotion definition

CREATE TABLE `promotion` (
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `discount_rate` decimal(5,2) NOT NULL,
  `start_date` timestamp NOT NULL,
  `end_date` timestamp NOT NULL,
  `code` varchar(100) NOT NULL,
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- hms_individual_api_project.customer_address definition

CREATE TABLE `customer_address` (
  `customer_id` bigint unsigned NOT NULL,
  `address_id` bigint unsigned NOT NULL,
  `selected` tinyint(1) NOT NULL,
  KEY `fk_customer_customer_address` (`customer_id`),
  KEY `fk_address_customer_address` (`address_id`),
  CONSTRAINT `fk_address_customer_address` FOREIGN KEY (`address_id`) REFERENCES `address_detail` (`id`),
  CONSTRAINT `fk_customer_customer_address` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- hms_individual_api_project.payment definition

CREATE TABLE `payment` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `last_payment_date` timestamp NOT NULL DEFAULT ((now() + interval _utf8mb4'2' day)),
  `amount` int NOT NULL,
  `customer_id` bigint unsigned NOT NULL,
  `payment_method_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `fk_customer_payment` (`customer_id`),
  KEY `fk_payment_method` (`payment_method_id`),
  CONSTRAINT `fk_customer_payment` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`),
  CONSTRAINT `fk_payment_method` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- hms_individual_api_project.product definition

CREATE TABLE `product` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `image` varchar(255) DEFAULT 'https://ik.imagekit.io/neuros123/product-placeholder-wp.jpg?updatedAt=1710562973427',
  `category_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `fk_product_category` (`category_id`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- hms_individual_api_project.promotion_category definition

CREATE TABLE `promotion_category` (
  `category_id` bigint unsigned DEFAULT NULL,
  `promotion_code` varchar(100) NOT NULL,
  KEY `fk_category_promotion` (`category_id`),
  KEY `fk_promotion_code` (`promotion_code`),
  CONSTRAINT `fk_category_promotion` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  CONSTRAINT `fk_promotion_code` FOREIGN KEY (`promotion_code`) REFERENCES `promotion` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- hms_individual_api_project.`session` definition

CREATE TABLE `session` (
  `session_id` varchar(500) DEFAULT NULL,
  `customer_id` bigint unsigned NOT NULL,
  `login_type` varchar(20) NOT NULL DEFAULT 'Web',
  UNIQUE KEY `customer_id` (`customer_id`),
  CONSTRAINT `fk_customer_session` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- hms_individual_api_project.shipment definition

CREATE TABLE `shipment` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `shipment_date` timestamp NULL DEFAULT NULL,
  `address_id` bigint unsigned NOT NULL,
  `customer_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `fk_customer_shipment` (`customer_id`),
  KEY `fk_address_shipment` (`address_id`),
  CONSTRAINT `fk_customer_shipment` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- hms_individual_api_project.variation definition

CREATE TABLE `variation` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned NOT NULL,
  `name` varchar(25) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `fk_category_variation` (`category_id`),
  CONSTRAINT `fk_category_variation` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- hms_individual_api_project.variation_option definition

CREATE TABLE `variation_option` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `variation_id` bigint unsigned NOT NULL,
  `value` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `fk_variation_option` (`variation_id`),
  CONSTRAINT `fk_variation_option` FOREIGN KEY (`variation_id`) REFERENCES `variation` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- hms_individual_api_project.order_detail definition

CREATE TABLE `order_detail` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_price` int NOT NULL,
  `customer_id` bigint unsigned NOT NULL,
  `shipment_id` bigint unsigned DEFAULT NULL,
  `payment_id` bigint unsigned DEFAULT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `transaction_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `fk_customer_order_detail` (`customer_id`),
  KEY `fk_payment_order_detail` (`payment_id`),
  KEY `fk_shipment_order_detail` (`shipment_id`),
  CONSTRAINT `fk_customer_order_detail` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`),
  CONSTRAINT `fk_payment_order_detail` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`id`),
  CONSTRAINT `fk_shipment_order_detail` FOREIGN KEY (`shipment_id`) REFERENCES `shipment` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- hms_individual_api_project.order_item definition

CREATE TABLE `order_item` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `price` int NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `order_id` bigint unsigned DEFAULT NULL,
  `note` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `fk_order_order_item` (`order_id`),
  KEY `fk_product_order_item` (`product_id`),
  CONSTRAINT `fk_order_order_item` FOREIGN KEY (`order_id`) REFERENCES `order_detail` (`id`),
  CONSTRAINT `fk_product_order_item` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- hms_individual_api_project.product_config definition

CREATE TABLE `product_config` (
  `product_id` bigint unsigned NOT NULL,
  `variation_option_id` bigint unsigned DEFAULT NULL,
  `stock` int NOT NULL,
  `price` int NOT NULL,
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `fk_product_variation_option` (`variation_option_id`),
  KEY `fk_product_config` (`product_id`),
  CONSTRAINT `fk_product_config` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_product_variation_option` FOREIGN KEY (`variation_option_id`) REFERENCES `variation_option` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- hms_individual_api_project.wishlist definition

CREATE TABLE `wishlist` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` bigint unsigned DEFAULT NULL,
  `product_id` bigint unsigned DEFAULT NULL,
  `product_config_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `fk_customer_wishlist` (`customer_id`),
  KEY `fk_product_wishlist` (`product_id`),
  KEY `fk_wishlist_product_config` (`product_config_id`),
  CONSTRAINT `fk_customer_wishlist` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`),
  CONSTRAINT `fk_product_wishlist` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `fk_wishlist_product_config` FOREIGN KEY (`product_config_id`) REFERENCES `product_config` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- hms_individual_api_project.cart definition

CREATE TABLE `cart` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `quantity` int DEFAULT NULL,
  `customer_id` bigint unsigned DEFAULT NULL,
  `product_id` bigint unsigned DEFAULT NULL,
  `note` varchar(100) DEFAULT NULL,
  `product_config_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `fk_customer_cart` (`customer_id`),
  KEY `fk_product_cart` (`product_id`),
  KEY `fk_cart_product_config` (`product_config_id`),
  CONSTRAINT `fk_cart_product_config` FOREIGN KEY (`product_config_id`) REFERENCES `product_config` (`id`),
  CONSTRAINT `fk_customer_cart` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`),
  CONSTRAINT `fk_product_cart` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TRIGGER `payment_exp` BEFORE INSERT ON `payment` FOR EACH ROW SET new.last_payment_date =  DATE_ADD(CURRENT_TIMESTAMP(),INTERVAL 2 DAY);