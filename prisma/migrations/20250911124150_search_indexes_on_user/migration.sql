-- DropIndex
DROP INDEX `User_name_email_idx` ON `User`;

-- CreateIndex
CREATE FULLTEXT INDEX `User_name_description_idx` ON `User`(`name`, `description`);
