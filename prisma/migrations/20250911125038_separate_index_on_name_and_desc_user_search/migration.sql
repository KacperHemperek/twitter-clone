-- DropIndex
DROP INDEX `User_name_description_idx` ON `User`;

-- CreateIndex
CREATE FULLTEXT INDEX `User_name_idx` ON `User`(`name`);

-- CreateIndex
CREATE FULLTEXT INDEX `User_description_idx` ON `User`(`description`);
