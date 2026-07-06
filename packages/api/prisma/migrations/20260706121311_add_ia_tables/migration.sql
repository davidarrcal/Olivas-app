-- CreateTable
CREATE TABLE "conversacion_ia" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "contexto_pantalla" VARCHAR(100),
    "entidad_id" INTEGER,
    "resumen" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversacion_ia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensaje_ia" (
    "id" SERIAL NOT NULL,
    "conversacion_id" INTEGER NOT NULL,
    "rol" VARCHAR(20) NOT NULL,
    "contenido" TEXT NOT NULL,
    "tool_calls" JSONB,
    "tool_result" JSONB,
    "tokens_entrada" INTEGER,
    "tokens_salida" INTEGER,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensaje_ia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerta_ia" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "finca_id" INTEGER,
    "tipo" VARCHAR(50) NOT NULL,
    "severidad" VARCHAR(20) NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "datos" JSONB,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerta_ia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditoria_ia" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "accion" VARCHAR(100) NOT NULL,
    "herramienta" VARCHAR(100),
    "parametros" JSONB,
    "resultado" TEXT,
    "exito" BOOLEAN NOT NULL,
    "error" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_ia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mensaje_ia" ADD CONSTRAINT "mensaje_ia_conversacion_id_fkey" FOREIGN KEY ("conversacion_id") REFERENCES "conversacion_ia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
