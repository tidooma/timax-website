CREATE TABLE IF NOT EXISTS "CustomSection" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT 1,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

ALTER TABLE "CustomSection" RENAME TO "LegacyCustomSection";

CREATE TABLE "CustomSection" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "order" INTEGER NOT NULL DEFAULT 10,
  "isVisible" BOOLEAN NOT NULL DEFAULT 1,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "CustomCard" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "subtitle" TEXT,
  "description" TEXT,
  "imageUrl" TEXT,
  "linkUrl" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "sectionId" TEXT NOT NULL,
  CONSTRAINT "CustomCard_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "CustomSection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "CustomCard_sectionId_order_idx" ON "CustomCard" ("sectionId", "order");