/*
  Warnings:

  - You are about to drop the column `setupExpiry` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `setupToken` on the `users` table. All the data in the column will be lost.
  - Made the column `passwordHash` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "setupExpiry",
DROP COLUMN "setupToken",
ALTER COLUMN "passwordHash" SET NOT NULL;
