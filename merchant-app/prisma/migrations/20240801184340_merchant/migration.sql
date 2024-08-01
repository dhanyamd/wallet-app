/*
  Warnings:

  - You are about to drop the column `userId` on the `merchantAccount` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[merchantId]` on the table `merchantAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `merchantId` to the `merchantAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "merchantAccount" DROP CONSTRAINT "merchantAccount_userId_fkey";

-- DropIndex
DROP INDEX "merchantAccount_userId_key";

-- AlterTable
ALTER TABLE "merchantAccount" DROP COLUMN "userId",
ADD COLUMN     "merchantId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "merchantAccount_merchantId_key" ON "merchantAccount"("merchantId");

-- AddForeignKey
ALTER TABLE "merchantAccount" ADD CONSTRAINT "merchantAccount_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
