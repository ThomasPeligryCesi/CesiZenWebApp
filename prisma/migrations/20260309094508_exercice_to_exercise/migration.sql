/*
  Warnings:

  - The primary key for the `FavoriteExercises` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `exerciceId` on the `FavoriteExercises` table. All the data in the column will be lost.
  - Added the required column `exerciseId` to the `FavoriteExercises` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FavoriteExercises" DROP CONSTRAINT "FavoriteExercises_exerciceId_fkey";

-- AlterTable
ALTER TABLE "FavoriteExercises" DROP CONSTRAINT "FavoriteExercises_pkey",
DROP COLUMN "exerciceId",
ADD COLUMN     "exerciseId" UUID NOT NULL,
ADD CONSTRAINT "FavoriteExercises_pkey" PRIMARY KEY ("userId", "exerciseId");

-- AddForeignKey
ALTER TABLE "FavoriteExercises" ADD CONSTRAINT "FavoriteExercises_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "BreathingExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
