-- Create the 'users' table
CREATE TABLE IF NOT EXISTS users (
  ID INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) CHARACTER SET 'utf8mb4' NOT NULL,
  password VARCHAR(255) CHARACTER SET 'utf8mb4' NOT NULL,
  type VARCHAR(255) CHARACTER SET 'utf8mb4' NOT NULL,
  active TINYINT DEFAULT 1,
  PRIMARY KEY (ID)
);

-- Create stored procedure to insert a user
DELIMITER //
CREATE PROCEDURE addUser (
  IN userEmail VARCHAR(255),
  IN userPassword VARCHAR(255),
  IN userType VARCHAR(255)
)
BEGIN
  INSERT INTO users (email, password, type) VALUES (userEmail, userPassword, userType);
END //
DELIMITER ;

-- Example call to stored procedure
CALL addUser('abc@xyz.com', 'somepassword', 'standard_user');
