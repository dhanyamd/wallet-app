-- CreateTable
CREATE TABLE "userAccount" (
    "id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "locked" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "userAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchantAccount" (
    "id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "locked" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "merchantAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userAccount_userId_key" ON "userAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "merchantAccount_userId_key" ON "merchantAccount"("userId");

-- AddForeignKey
ALTER TABLE "userAccount" ADD CONSTRAINT "userAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchantAccount" ADD CONSTRAINT "merchantAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
