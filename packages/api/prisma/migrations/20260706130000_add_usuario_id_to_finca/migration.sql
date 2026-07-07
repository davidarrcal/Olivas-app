-- Add usuario_id column to finca (nullable first)
ALTER TABLE "finca" ADD COLUMN "usuario_id" INTEGER;

-- Assign existing fincas to the first user (david, id=1)
UPDATE "finca" SET "usuario_id" = (SELECT id FROM "usuario" ORDER BY id LIMIT 1) WHERE "usuario_id" IS NULL;

-- Make it NOT NULL
ALTER TABLE "finca" ALTER COLUMN "usuario_id" SET NOT NULL;

-- Drop old unique constraint on nombre
ALTER TABLE "finca" DROP CONSTRAINT IF EXISTS "finca_nombre_key";

-- Add composite unique constraint
CREATE UNIQUE INDEX "finca_nombre_usuario_id_key" ON "finca"("nombre", "usuario_id");

-- Add foreign key
ALTER TABLE "finca" ADD CONSTRAINT "finca_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE;

-- Add foreign keys for IA tables
ALTER TABLE "conversacion_ia" ADD CONSTRAINT "conversacion_ia_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE;
ALTER TABLE "alerta_ia" ADD CONSTRAINT "alerta_ia_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE;
ALTER TABLE "auditoria_ia" ADD CONSTRAINT "auditoria_ia_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE;
