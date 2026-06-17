-- CreateTable
CREATE TABLE "finca" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "ubicacion" VARCHAR(255),
    "altitud" INTEGER,
    "latitud" DOUBLE PRECISION,
    "longitud" DOUBLE PRECISION,
    "superficie_total" DOUBLE PRECISION,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bancal" (
    "id" SERIAL NOT NULL,
    "finca_id" INTEGER NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "superficie" DOUBLE PRECISION,
    "textura_suelo" VARCHAR(50),
    "pendiente" DOUBLE PRECISION,
    "marco_plantacion" VARCHAR(20),
    "observaciones" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bancal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variedad_bancal" (
    "id" SERIAL NOT NULL,
    "bancal_id" INTEGER NOT NULL,
    "variedad" VARCHAR(100) NOT NULL,
    "num_arboles" INTEGER NOT NULL,
    "ano_plantacion" INTEGER,
    "produccion_estimada" DOUBLE PRECISION,
    "observaciones" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "variedad_bancal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riego" (
    "id" SERIAL NOT NULL,
    "bancal_id" INTEGER NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3),
    "volumen_m3" DOUBLE PRECISION,
    "precipitacion_mm" DOUBLE PRECISION,
    "etp" DOUBLE PRECISION,
    "humedad_suelo_pct" DOUBLE PRECISION,
    "observaciones" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "riego_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "producto" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "composicion" VARCHAR(255),
    "unidad_medida" VARCHAR(20) NOT NULL,
    "precio_unitario" DOUBLE PRECISION,
    "observaciones" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abonado" (
    "id" SERIAL NOT NULL,
    "bancal_id" INTEGER NOT NULL,
    "producto_id" INTEGER,
    "fecha" DATE NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "npk" VARCHAR(50),
    "dosis" DOUBLE PRECISION,
    "dosis_unidad" VARCHAR(20),
    "estado_fenologico" VARCHAR(50),
    "observaciones" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "abonado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tratamiento" (
    "id" SERIAL NOT NULL,
    "bancal_id" INTEGER NOT NULL,
    "producto_id" INTEGER,
    "fecha" DATE NOT NULL,
    "dosis" VARCHAR(100),
    "periodo_seguridad_dias" INTEGER,
    "plaga_enfermedad" VARCHAR(200),
    "observaciones" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tratamiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poda" (
    "id" SERIAL NOT NULL,
    "bancal_id" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "volumen_lena_kg" DOUBLE PRECISION,
    "observaciones" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "poda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cosecha" (
    "id" SERIAL NOT NULL,
    "bancal_id" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "metodo_recoleccion" VARCHAR(50) NOT NULL,
    "kg_totales" DOUBLE PRECISION NOT NULL,
    "rendimiento_graso_pct" DOUBLE PRECISION,
    "almazara" VARCHAR(200),
    "observaciones" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cosecha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meteo_datos" (
    "id" SERIAL NOT NULL,
    "finca_id" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "temp_max" DOUBLE PRECISION,
    "temp_min" DOUBLE PRECISION,
    "lluvia_mm" DOUBLE PRECISION,
    "humedad_pct" DOUBLE PRECISION,
    "fuente" VARCHAR(20) NOT NULL DEFAULT 'manual',
    "observaciones" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meteo_datos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analisis" (
    "id" SERIAL NOT NULL,
    "bancal_id" INTEGER NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "fecha" DATE NOT NULL,
    "ph" DOUBLE PRECISION,
    "materia_organica" DOUBLE PRECISION,
    "nitrogeno" DOUBLE PRECISION,
    "fosforo" DOUBLE PRECISION,
    "potasio" DOUBLE PRECISION,
    "boro" DOUBLE PRECISION,
    "zinc" DOUBLE PRECISION,
    "hierro" DOUBLE PRECISION,
    "resultados_detallados" TEXT,
    "laboratorio" VARCHAR(200),
    "recomendaciones" TEXT,
    "observaciones" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analisis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diario_campo" (
    "id" SERIAL NOT NULL,
    "bancal_id" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "horas" DOUBLE PRECISION,
    "tipo_labor" VARCHAR(100),
    "descripcion" TEXT,
    "fotos" JSONB,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diario_campo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventario" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "finca_id" INTEGER NOT NULL,
    "stock_actual" DOUBLE PRECISION NOT NULL,
    "stock_minimo" DOUBLE PRECISION,
    "fecha_ultima_compra" DATE,
    "precio_compra" DOUBLE PRECISION,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maquinaria" (
    "id" SERIAL NOT NULL,
    "finca_id" INTEGER NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "tipo" VARCHAR(100),
    "horas_actuales" DOUBLE PRECISION,
    "observaciones" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maquinaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mantenimiento" (
    "id" SERIAL NOT NULL,
    "maquinaria_id" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "tipo" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "proximo_aviso_horas" DOUBLE PRECISION,
    "coste" DOUBLE PRECISION,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mantenimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gasto" (
    "id" SERIAL NOT NULL,
    "finca_id" INTEGER NOT NULL,
    "bancal_id" INTEGER,
    "fecha" DATE NOT NULL,
    "concepto" VARCHAR(255) NOT NULL,
    "categoria" VARCHAR(50) NOT NULL,
    "importe" DOUBLE PRECISION NOT NULL,
    "observaciones" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gasto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingreso" (
    "id" SERIAL NOT NULL,
    "finca_id" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "concepto" VARCHAR(255) NOT NULL,
    "categoria" VARCHAR(50) NOT NULL,
    "importe" DOUBLE PRECISION NOT NULL,
    "kg_vendidos" DOUBLE PRECISION,
    "precio_kg" DOUBLE PRECISION,
    "observaciones" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingreso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config" (
    "id" SERIAL NOT NULL,
    "clave" VARCHAR(100) NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "finca_nombre_key" ON "finca"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "producto_nombre_key" ON "producto"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "meteo_datos_finca_id_fecha_key" ON "meteo_datos"("finca_id", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "config_clave_key" ON "config"("clave");

-- AddForeignKey
ALTER TABLE "bancal" ADD CONSTRAINT "bancal_finca_id_fkey" FOREIGN KEY ("finca_id") REFERENCES "finca"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variedad_bancal" ADD CONSTRAINT "variedad_bancal_bancal_id_fkey" FOREIGN KEY ("bancal_id") REFERENCES "bancal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riego" ADD CONSTRAINT "riego_bancal_id_fkey" FOREIGN KEY ("bancal_id") REFERENCES "bancal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abonado" ADD CONSTRAINT "abonado_bancal_id_fkey" FOREIGN KEY ("bancal_id") REFERENCES "bancal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abonado" ADD CONSTRAINT "abonado_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tratamiento" ADD CONSTRAINT "tratamiento_bancal_id_fkey" FOREIGN KEY ("bancal_id") REFERENCES "bancal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tratamiento" ADD CONSTRAINT "tratamiento_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poda" ADD CONSTRAINT "poda_bancal_id_fkey" FOREIGN KEY ("bancal_id") REFERENCES "bancal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cosecha" ADD CONSTRAINT "cosecha_bancal_id_fkey" FOREIGN KEY ("bancal_id") REFERENCES "bancal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meteo_datos" ADD CONSTRAINT "meteo_datos_finca_id_fkey" FOREIGN KEY ("finca_id") REFERENCES "finca"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analisis" ADD CONSTRAINT "analisis_bancal_id_fkey" FOREIGN KEY ("bancal_id") REFERENCES "bancal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diario_campo" ADD CONSTRAINT "diario_campo_bancal_id_fkey" FOREIGN KEY ("bancal_id") REFERENCES "bancal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventario" ADD CONSTRAINT "inventario_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventario" ADD CONSTRAINT "inventario_finca_id_fkey" FOREIGN KEY ("finca_id") REFERENCES "finca"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquinaria" ADD CONSTRAINT "maquinaria_finca_id_fkey" FOREIGN KEY ("finca_id") REFERENCES "finca"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mantenimiento" ADD CONSTRAINT "mantenimiento_maquinaria_id_fkey" FOREIGN KEY ("maquinaria_id") REFERENCES "maquinaria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gasto" ADD CONSTRAINT "gasto_finca_id_fkey" FOREIGN KEY ("finca_id") REFERENCES "finca"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gasto" ADD CONSTRAINT "gasto_bancal_id_fkey" FOREIGN KEY ("bancal_id") REFERENCES "bancal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingreso" ADD CONSTRAINT "ingreso_finca_id_fkey" FOREIGN KEY ("finca_id") REFERENCES "finca"("id") ON DELETE CASCADE ON UPDATE CASCADE;
