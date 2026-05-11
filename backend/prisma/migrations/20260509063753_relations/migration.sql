-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "location" TEXT,
ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
