const ESTADOS_FENOLOGICOS = [
  { valor: 'reposo_invernal', etiqueta: 'Reposo invernal' },
  { valor: 'yema_hinchada', etiqueta: 'Yema hinchada' },
  { valor: 'apertura_yemas', etiqueta: 'Apertura de yemas' },
  { valor: 'hojas_nacientes', etiqueta: 'Hojas nacientes' },
  { valor: 'diferenciacion_floral', etiqueta: 'Diferenciación floral' },
  { valor: 'boton_floral', etiqueta: 'Botón floral' },
  { valor: 'floracion', etiqueta: 'Floración' },
  { valor: 'cuajado', etiqueta: 'Cuajado' },
  { valor: 'endurecimiento_hueso', etiqueta: 'Endurecimiento del hueso' },
  { valor: 'engorde_fruto', etiqueta: 'Engorde del fruto' },
  { valor: 'envero', etiqueta: 'Envero (cambio de color)' },
  { valor: 'maduracion', etiqueta: 'Maduración' },
  { valor: 'recoleccion', etiqueta: 'Recolección' }
];

const TEXTURAS_SUELO = [
  { valor: 'arcilloso', etiqueta: 'Arcilloso' },
  { valor: 'franco_arcilloso', etiqueta: 'Franco-arcilloso' },
  { valor: 'franco', etiqueta: 'Franco' },
  { valor: 'franco_arenoso', etiqueta: 'Franco-arenoso' },
  { valor: 'arenoso', etiqueta: 'Arenoso' }
];

const TIPOS_ABONO = [
  { valor: 'suelo', etiqueta: 'Suelo (granulado)' },
  { valor: 'foliar', etiqueta: 'Foliar' },
  { valor: 'fertirriego', etiqueta: 'Fertirriego (goteo)' },
  { valor: 'organico', etiqueta: 'Orgánico (compost/estiércol)' }
];

const TIPOS_PODA = [
  { valor: 'formacion', etiqueta: 'Formación' },
  { valor: 'fructificacion', etiqueta: 'Fructificación' },
  { valor: 'renovacion', etiqueta: 'Renovación' },
  { valor: 'sanitaria', etiqueta: 'Sanitaria' }
];

const METODOS_RECOLECCION = [
  { valor: 'vareo', etiqueta: 'Vareo' },
  { valor: 'vibrador', etiqueta: 'Vibrador' },
  { valor: 'ordeno', etiqueta: 'Ordeño (manual)' },
  { valor: 'desprendimiento_natural', etiqueta: 'Desprendimiento natural' }
];

const TIPOS_ANALISIS = [
  { valor: 'suelo', etiqueta: 'Análisis de suelo' },
  { valor: 'foliar', etiqueta: 'Análisis foliar' },
  { valor: 'agua', etiqueta: 'Análisis de agua' }
];

const VARIEDADES_OLIVO = [
  'Picual', 'Hojiblanca', 'Cornicabra', 'Manzanilla Cacereña',
  'Manzanilla Sevillana', 'Arbequina', 'Empeltre', 'Verdial de Badajoz',
  'Lechin de Sevilla', 'Morisca', 'Gordal', 'Castellana',
  'Farga', 'Blanqueta', 'Morrut', 'Sevillenca'
];

const CATEGORIAS_GASTO = [
  'abono', 'fitosanitario', 'riego', 'combustible', 'mantenimiento',
  'almazara', 'transporte', 'seguro', 'otros'
];

const CATEGORIAS_INGRESO = [
  'venta_aceituna', 'venta_aceite', 'subvencion', 'otros'
];

const PLAGAS_ENFERMEDADES = [
  'Mosca del olivo (Bactrocera oleae)',
  'Repilo o Antracnosis (Spilocaea oleagina)',
  'Verticilosis (Verticillium dahliae)',
  'Tuberculosis del olivo (Pseudomonas savastanoi)',
  'Polilla del olivo (Prays oleae)',
  'Cochinilla de la tizne (Saissetia oleae)',
  'Barrenillo del olivo (Phloeotribus scarabaeoides)',
  'Araña amarilla (Eriophyes oleae)',
  'Mosca blanca',
  'Otras'
];

module.exports = {
  ESTADOS_FENOLOGICOS,
  TEXTURAS_SUELO,
  TIPOS_ABONO,
  TIPOS_PODA,
  METODOS_RECOLECCION,
  TIPOS_ANALISIS,
  VARIEDADES_OLIVO,
  CATEGORIAS_GASTO,
  CATEGORIAS_INGRESO,
  PLAGAS_ENFERMEDADES
};