/*
  Warnings:

  - You are about to drop the `FavoriteExercices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FavoriteExercices" DROP CONSTRAINT "FavoriteExercices_exerciceId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteExercices" DROP CONSTRAINT "FavoriteExercices_userId_fkey";

-- DropTable
DROP TABLE "FavoriteExercices";

-- CreateTable
CREATE TABLE "FavoriteExercises" (
    "userId" UUID NOT NULL,
    "exerciceId" UUID NOT NULL,

    CONSTRAINT "FavoriteExercises_pkey" PRIMARY KEY ("userId","exerciceId")
);

-- AddForeignKey
ALTER TABLE "FavoriteExercises" ADD CONSTRAINT "FavoriteExercises_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteExercises" ADD CONSTRAINT "FavoriteExercises_exerciceId_fkey" FOREIGN KEY ("exerciceId") REFERENCES "BreathingExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
