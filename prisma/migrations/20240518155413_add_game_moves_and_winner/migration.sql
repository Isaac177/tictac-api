-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "winner" TEXT;

-- CreateTable
CREATE TABLE "GameMove" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameMove_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GameMove" ADD CONSTRAINT "GameMove_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
