-- CreateTable
CREATE TABLE `books` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `authorId` VARCHAR(255) NOT NULL,
    `genre` VARCHAR(100) NOT NULL,
    `publishedYear` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `books_genre_idx`(`genre`),
    INDEX `books_authorId_idx`(`authorId`),
    INDEX `books_publishedYear_idx`(`publishedYear`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
