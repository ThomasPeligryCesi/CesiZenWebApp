/*
  Warnings:

  - You are about to drop the column `imgUrl` on the `BreathingExercise` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BreathingExercise" DROP COLUMN "imgUrl";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastConnexion" TIMESTAMP(3);
