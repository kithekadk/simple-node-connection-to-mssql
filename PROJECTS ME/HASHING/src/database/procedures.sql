-- create database Test



CREATE PROCEDURE insertUser(@id VARCHAR(80), @email VARCHAR(200), @password VARCHAR(200))
AS
BEGIN
INSERT INTO createUser(id,email,password) Values(@id, @email, @password)

END

CREATE PROCEDURE getUser(@email VARCHAR(200))
AS
BEGIN
SELECT * FROM createUser WHERE email=@email
END