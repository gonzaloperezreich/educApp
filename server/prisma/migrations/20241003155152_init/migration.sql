/*
  Warnings:

  - You are about to drop the column `score` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `tagType` on the `Question` table. All the data in the column will be lost.
  - Added the required column `axisType` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "axisType" AS ENUM ('Numeros', 'Geometria', 'AlgebraYFunciones', 'ProbabilidadYEstadisticas');

-- DropForeignKey
ALTER TABLE "TestStudent" DROP CONSTRAINT "TestStudent_testId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "score",
DROP COLUMN "tagType",
ADD COLUMN     "axisType" "axisType" NOT NULL;

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "TagType";
