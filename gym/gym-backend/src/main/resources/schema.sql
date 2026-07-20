CREATE DATABASE IF NOT EXISTS gym_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gym_db;

DROP TABLE IF EXISTS admin;
CREATE TABLE admin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50),
    avatar VARCHAR(255),
    status INT DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS member;
CREATE TABLE member (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account VARCHAR(50),
    nickname VARCHAR(50),
    real_name VARCHAR(50),
    phone VARCHAR(20),
    avatar VARCHAR(255),
    gender INT DEFAULT 0,
    member_card VARCHAR(100),
    member_level VARCHAR(50),
    coach VARCHAR(50),
    points INT DEFAULT 0,
    status INT DEFAULT 1,
    register_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS coach;
CREATE TABLE coach (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    gender VARCHAR(10),
    phone VARCHAR(20),
    avatar VARCHAR(255),
    venue_ids VARCHAR(255),
    venue_names VARCHAR(255),
    sort INT DEFAULT 0,
    status INT DEFAULT 1,
    description TEXT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS venue;
CREATE TABLE venue (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(255),
    email VARCHAR(100),
    sort INT DEFAULT 0,
    status INT DEFAULT 1,
    description TEXT,
    cover_image VARCHAR(255),
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS group_course;
CREATE TABLE group_course (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    coach VARCHAR(50),
    cover_image VARCHAR(255),
    sort INT DEFAULT 0,
    duration INT,
    max_people INT,
    tags VARCHAR(255),
    description TEXT,
    status INT DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS private_course;
CREATE TABLE private_course (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    coach VARCHAR(50),
    cover_image VARCHAR(255),
    sort INT DEFAULT 0,
    duration INT,
    max_people INT,
    tags VARCHAR(255),
    description TEXT,
    status INT DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS member_card;
CREATE TABLE member_card (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    card_name VARCHAR(100),
    member_id BIGINT,
    member_name VARCHAR(50),
    phone VARCHAR(20),
    card_type VARCHAR(50),
    times INT DEFAULT 0,
    remain_times INT DEFAULT 0,
    balance DECIMAL(10,2) DEFAULT 0,
    days INT DEFAULT 0,
    status INT DEFAULT 1,
    expire_time DATETIME,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS product;
CREATE TABLE product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200),
    cover_image VARCHAR(255),
    price DECIMAL(10,2),
    category VARCHAR(50),
    tags VARCHAR(255),
    sales INT DEFAULT 0,
    stock INT DEFAULT 0,
    status INT DEFAULT 1,
    description TEXT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(50),
    member_name VARCHAR(50),
    order_status VARCHAR(20),
    order_type VARCHAR(20),
    total_amount DECIMAL(12,2),
    pay_method VARCHAR(20),
    pay_status VARCHAR(20),
    remark TEXT,
    pay_time DATETIME,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS booking;
CREATE TABLE booking (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100),
    member_name VARCHAR(50),
    phone VARCHAR(20),
    people INT DEFAULT 1,
    course_time VARCHAR(50),
    coach VARCHAR(50),
    member_card VARCHAR(100),
    remark TEXT,
    status VARCHAR(20),
    booking_time DATETIME,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS coupon;
CREATE TABLE coupon (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    type VARCHAR(20),
    amount DECIMAL(10,2),
    min_amount DECIMAL(10,2) DEFAULT 0,
    total INT DEFAULT 0,
    used INT DEFAULT 0,
    status INT DEFAULT 1,
    start_time DATETIME,
    end_time DATETIME,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS system_user;
CREATE TABLE system_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(255),
    nickname VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(100),
    role_name VARCHAR(50),
    status INT DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS role;
CREATE TABLE role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    code VARCHAR(50),
    description TEXT,
    status INT DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);
