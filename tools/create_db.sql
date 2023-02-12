CREATE DATABASE IF NOT EXISTS `logger3d` 
USE `logger3d`;

DROP TABLE IF EXISTS `demcache`;

CREATE TABLE `demcache` (
	`latitude` DECIMAL(8,5) NOT NULL,
	`longitude` DECIMAL(8,5) NOT NULL,
	`elevation` DECIMAL(8,3) NULL DEFAULT NULL,
	`add_datetime` DATETIME NOT NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`latitude`, `longitude`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;

DROP TABLE IF EXISTS `job`;

CREATE TABLE `job` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `owner_id` int(11) NOT NULL DEFAULT 1,
  `start_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_owner` (`owner_id`),
  CONSTRAINT `fk_owner` FOREIGN KEY (`owner_id`) REFERENCES `owner` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;


DROP TABLE IF EXISTS `journal`;

CREATE TABLE `journal` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`time_point` DATETIME NOT NULL DEFAULT current_timestamp(),
	`job_id` INT(11) NOT NULL DEFAULT '0',
	`latitude` DOUBLE NOT NULL DEFAULT '0',
	`longitude` DOUBLE NOT NULL DEFAULT '0',
	`elevation` DOUBLE NOT NULL DEFAULT '0',
	`dem` DOUBLE NOT NULL DEFAULT -99999,
	`satellites` INT(11) NOT NULL DEFAULT '0',
	`accuracy` DOUBLE NULL DEFAULT '0',
	`location` POINT NOT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `idx_job_time` (`job_id`, `time_point`) USING BTREE,
	INDEX `latitude` (`latitude`) USING BTREE,
	INDEX `longitude` (`longitude`) USING BTREE,
	INDEX `idx_time_point` (`time_point`) USING BTREE,
	CONSTRAINT `fk_job` FOREIGN KEY (`job_id`) REFERENCES `job` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COMMENT='This is where the 3d data is logged to'
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

DROP TABLE IF EXISTS `owner`;

CREATE TABLE `owner` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`surname` VARCHAR(150) NOT NULL DEFAULT '0' COLLATE 'utf8mb4_general_ci',
	`given_name` VARCHAR(150) NOT NULL DEFAULT '0' COLLATE 'utf8mb4_general_ci',
	`knickname` VARCHAR(150) NOT NULL DEFAULT '0' COLLATE 'utf8mb4_general_ci',
	`create_date` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `index_knickname` (`knickname`) USING BTREE
)
COMMENT='We associate a job with an owner'
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;
