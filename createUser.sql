use planit;

CREATE USER 'planituser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Pl4n1tN0w';
GRANT ALL PRIVILEGES ON planit.* TO 'planituser'@'localhost';