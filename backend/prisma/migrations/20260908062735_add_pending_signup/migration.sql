-- CreateTable
CREATE TABLE "pending_signups" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "adminName" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "razorpayOrderId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pending_signups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pending_signups_adminEmail_key" ON "pending_signups"("adminEmail");

-- CreateIndex
CREATE UNIQUE INDEX "pending_signups_razorpayOrderId_key" ON "pending_signups"("razorpayOrderId");
