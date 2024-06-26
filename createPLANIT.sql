
CREATE DATABASE  IF NOT EXISTS `planit`;
USE `planit`;


CREATE USER 'planituser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Pl4n1tN0w';
GRANT ALL PRIVILEGES ON planit.* TO 'planituser'@'localhost';


CREATE TABLE  `unavail` (
  `unavail_id` INT NOT NULL AUTO_INCREMENT,
  `event_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `bit_matrix` JSON NOT NULL,
  PRIMARY KEY (`unavail_id`));


CREATE TABLE `user_events` (
  `event_id` INT NOT NULL AUTO_INCREMENT,
  `creator_id` INT NOT NULL,
  `event_url` VARCHAR(10) NULL DEFAULT NULL,
  `start_date` DATE NULL DEFAULT NULL,
  `end_date` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  INDEX `event_id` (`event_id` ASC));


CREATE TABLE `users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `pass` VARCHAR(45) NULL DEFAULT NULL,
  `signed` TINYINT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC));

  INSERT INTO users (`user_name`) VALUES ('DemoUser');
  INSERT INTO users (`user_name`) VALUES ('DemoUserTwo');
  INSERT INTO users (`user_name`) VALUES ('DemoUserThree');

  INSERT INTO user_events (creator_id, event_url, start_date, end_date) VALUES (1, 'TESTURL123', '2023-07-07', '2023-07-14'); 

  INSERT INTO unavail (event_id, user_id, bit_matrix) VALUES (1, 1, '[[0, 1, 1, 1, 0, 1, 1, 1, 1], [1, 1, 0, 0, 0, 1, 1, 0, 0], [0, 0, 1, 0, 0, 1, 1, 0, 0], [1, 1, 1, 0, 0, 1, 0, 1, 0], [0, 0, 1, 0, 0, 1, 0, 0, 0], [1, 1, 0, 0, 0, 1, 0, 0, 0], [1, 1, 1, 1, 0, 0, 0, 1, 0]]'); 
  INSERT INTO unavail (event_id, user_id, bit_matrix) VALUES (1, 2, '[[0, 1, 1, 1, 0, 1, 1, 1, 1], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 0, 0, 0, 1, 0]]'); 
  INSERT INTO unavail (event_id, user_id, bit_matrix) VALUES (1, 3, '[[0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 1, 1, 0, 0], [1, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 1, 0, 0, 1, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]]'); 
