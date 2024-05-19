/*
  Warnings:

  - Added the required column `userId` to the `GameMove` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameMove" ADD COLUMN     "userId" TEXT NOT NULL;
