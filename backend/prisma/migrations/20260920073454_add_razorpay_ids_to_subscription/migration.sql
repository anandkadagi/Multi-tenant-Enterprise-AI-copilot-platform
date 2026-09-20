/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "createdAt",
ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "razorpayPaymentId" TEXT,
ALTER COLUMN "plan" SET DEFAULT 'STANDARD',
ALTER COLUMN "status" SET DEFAULT 'active',
ALTER COLUMN "startsAt" SET DEFAULT CURRENT_TIMESTAMP;
