/*
  Warnings:

  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentProvider` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'ARS');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('initiated', 'succeeded', 'failed', 'refounded');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'succeded', 'failed');

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_providerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_paymentId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "transactionId" TEXT;

-- DropTable
DROP TABLE "public"."Payment";

-- DropTable
DROP TABLE "public"."PaymentProvider";

-- DropTable
DROP TABLE "public"."Transaction";
