/*
  Warnings:

  - You are about to drop the column `endDate` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `endTimeDate` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTimeDate` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."schedules" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "endTimeDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTimeDate" TIMESTAMP(3) NOT NULL;
