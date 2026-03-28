/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "name",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "state" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Article" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" UUID NOT NULL,
    "imgUrl" TEXT,
    "published" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" INTEGER NOT NULL,
    "readingTime" INTEGER NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteArticles" (
    "userId" UUID NOT NULL,
    "articleId" UUID NOT NULL,

    CONSTRAINT "FavoriteArticles_pkey" PRIMARY KEY ("userId","articleId")
);

-- CreateTable
CREATE TABLE "BreathingExercise" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "imgUrl" TEXT,
    "videoUrl" TEXT,
    "duration" INTEGER NOT NULL,
    "benefits" TEXT,
    "level" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "BreathingExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteExercices" (
    "userId" UUID NOT NULL,
    "exerciceId" UUID NOT NULL,

    CONSTRAINT "FavoriteExercices_pkey" PRIMARY KEY ("userId","exerciceId")
);

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteArticles" ADD CONSTRAINT "FavoriteArticles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteArticles" ADD CONSTRAINT "FavoriteArticles_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteExercices" ADD CONSTRAINT "FavoriteExercices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteExercices" ADD CONSTRAINT "FavoriteExercices_exerciceId_fkey" FOREIGN KEY ("exerciceId") REFERENCES "BreathingExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
