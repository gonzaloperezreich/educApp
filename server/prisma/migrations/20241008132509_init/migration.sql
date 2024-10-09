-- AddForeignKey
ALTER TABLE "TestStudent" ADD CONSTRAINT "TestStudent_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
