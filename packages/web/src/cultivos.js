export const CULTIVOS = {
  olivo: {
    label: 'Olivo',
    labelLargo: 'Olivar',
    icono: '\uD83C\uDF52',
    fruto: 'aceituna',
    frutoPlural: 'aceitunas',
    productoVenta: 'aceituna/aceite',
    variedades: [
      'Picual', 'Hojiblanca', 'Cornicabra', 'Manzanilla Cacere\u00f1a',
      'Manzanilla Sevillana', 'Arbequina', 'Empeltre', 'Verdial de Badajoz',
      'Lechin de Sevilla', 'Morisca', 'Gordal', 'Castellana',
      'Farga', 'Blanqueta', 'Morrut', 'Sevillenca'
    ],
    estadosFenologicos: [
      { valor: 'reposo_invernal', etiqueta: 'Reposo invernal' },
      { valor: 'yema_hinchada', etiqueta: 'Yema hinchada' },
      { valor: 'apertura_yemas', etiqueta: 'Apertura de yemas' },
      { valor: 'hojas_nacientes', etiqueta: 'Hojas nacientes' },
      { valor: 'diferenciacion_floral', etiqueta: 'Diferenciacion floral' },
      { valor: 'boton_floral', etiqueta: 'Boton floral' },
      { valor: 'floracion', etiqueta: 'Floracion' },
      { valor: 'cuajado', etiqueta: 'Cuajado' },
      { valor: 'endurecimiento_hueso', etiqueta: 'Endurecimiento del hueso' },
      { valor: 'engorde_fruto', etiqueta: 'Engorde del fruto' },
      { valor: 'envero', etiqueta: 'Envero (cambio de color)' },
      { valor: 'maduracion', etiqueta: 'Maduracion' },
      { valor: 'recoleccion', etiqueta: 'Recoleccion' }
    ],
    plagas: [
      'Mosca del olivo (Bactrocera oleae)',
      'Repilo o Antracnosis (Spilocaea oleagina)',
      'Verticilosis (Verticillium dahliae)',
      'Tuberculosis del olivo (Pseudomonas savastanoi)',
      'Polilla del olivo (Prays oleae)',
      'Cochinilla de la tizne (Saissetia oleae)',
      'Barrenillo del olivo (Phloeotribus scarabaeoides)',
      'Ara\u00f1a amarilla (Eriophyes oleae)',
      'Mosca blanca',
      'Otras'
    ],
    metodosRecoleccion: [
      { valor: 'vareo', etiqueta: 'Vareo' },
      { valor: 'vibrador', etiqueta: 'Vibrador' },
      { valor: 'ordeno', etiqueta: 'Ordeno (manual)' },
      { valor: 'desprendimiento_natural', etiqueta: 'Desprendimiento natural' }
    ],
    categoriasGasto: [
      { valor: 'abono', etiqueta: 'Abono' },
      { valor: 'fitosanitario', etiqueta: 'Fitosanitario' },
      { valor: 'riego', etiqueta: 'Riego' },
      { valor: 'combustible', etiqueta: 'Combustible' },
      { valor: 'mantenimiento', etiqueta: 'Mantenimiento' },
      { valor: 'almazara', etiqueta: 'Almazara' },
      { valor: 'transporte', etiqueta: 'Transporte' },
      { valor: 'seguro', etiqueta: 'Seguro' },
      { valor: 'otros', etiqueta: 'Otros' }
    ],
    categoriasIngreso: [
      { valor: 'venta_aceituna', etiqueta: 'Venta aceituna' },
      { valor: 'venta_aceite', etiqueta: 'Venta aceite' },
      { valor: 'subvencion', etiqueta: 'Subvencion' },
      { valor: 'otros', etiqueta: 'Otros' }
    ],
    calendario: [
      { mes: 0, tareas: ['Reposo invernal', 'Revision maquinaria', 'Planificacion anual'] },
      { mes: 1, tareas: ['Poda de formacion y fructificacion', 'Recoger lena', 'Prevencion heladas'] },
      { mes: 2, tareas: ['Abonado de fondo (NPK)', 'Preparar terreno', 'Inicio tratamientos cobre'] },
      { mes: 3, tareas: ['Abonado nitrogenado', 'Control mosca del olivo', 'Tratamientos foliares boro'] },
      { mes: 4, tareas: ['Cuajado del fruto', 'Fertirriego', 'Control repilo'] },
      { mes: 5, tareas: ['Riegos frecuentes', 'Tratamientos mosca', 'Abonado potasio'] },
      { mes: 6, tareas: ['Riego intensivo', 'Vigilar plaga mosca', 'Control adventicias'] },
      { mes: 7, tareas: ['Riego', 'Vigilar mosca del olivo', 'Preparar cosecha'] },
      { mes: 8, tareas: ['Pre-cosecha variedades tempranas', 'Riego', 'Tratamientos pre-cosecha'] },
      { mes: 9, tareas: ['Cosecha Arbequina y Hojiblanca', 'Abonado post-cosecha', 'Analisis suelo'] },
      { mes: 10, tareas: ['Cosecha Picual', 'Abonado organico', 'Analisis foliar'] },
      { mes: 11, tareas: ['Fin cosecha', 'Poda sanitaria', 'Planificacion proximo anio'] }
    ]
  },

  almendro: {
    label: 'Almendro',
    labelLargo: 'Almendral',
    icono: '\uD83C\uDF30',
    fruto: 'almendra',
    frutoPlural: 'almendras',
    productoVenta: 'almendra',
    variedades: [
      'Marcona', 'Largueta', 'Ferragnes', 'Ferraduel', 'Antoneta',
      'Guara', 'Soleta', 'Marta', 'Penta', 'Vairo',
      'Constanti', 'Desmayo Largueta', 'Nonpareil', 'Texas'
    ],
    estadosFenologicos: [
      { valor: 'reposo_invernal', etiqueta: 'Reposo invernal' },
      { valor: 'yema_hinchada', etiqueta: 'Yema hinchada' },
      { valor: 'floracion', etiqueta: 'Floracion' },
      { valor: 'cuajado', etiqueta: 'Cuajado' },
      { valor: 'engorde_fruto', etiqueta: 'Engorde del fruto' },
      { valor: 'endurecimiento_cascara', etiqueta: 'Endurecimiento cascara' },
      { valor: 'maduracion', etiqueta: 'Maduracion' },
      { valor: 'recoleccion', etiqueta: 'Recoleccion' },
      { valor: 'post_recoleccion', etiqueta: 'Post-recoleccion' }
    ],
    plagas: [
      'Avispilla del almendro (Eurytoma amygdali)',
      'Mosca de la almendra (Eurytoma amygdali)',
      'Antracnosis (Colletotrichum)',
      'Podredumbre de raices (Armillaria)',
      'Pulgon del almendro (Myzus persicae)',
      'Tigre del almendro (Stephanitis pyri)',
      'Cochinillas',
      'Ara\u00f1a roja (Tetranychus urticae)',
      'Otras'
    ],
    metodosRecoleccion: [
      { valor: 'vareo', etiqueta: 'Vareo' },
      { valor: 'vibrador', etiqueta: 'Vibrador' },
      { valor: 'manual', etiqueta: 'Manual' },
      { valor: 'desprendimiento_natural', etiqueta: 'Desprendimiento natural' }
    ],
    categoriasGasto: [
      { valor: 'abono', etiqueta: 'Abono' },
      { valor: 'fitosanitario', etiqueta: 'Fitosanitario' },
      { valor: 'riego', etiqueta: 'Riego' },
      { valor: 'combustible', etiqueta: 'Combustible' },
      { valor: 'mantenimiento', etiqueta: 'Mantenimiento' },
      { valor: 'recoleccion', etiqueta: 'Recoleccion' },
      { valor: 'transporte', etiqueta: 'Transporte' },
      { valor: 'seguro', etiqueta: 'Seguro' },
      { valor: 'otros', etiqueta: 'Otros' }
    ],
    categoriasIngreso: [
      { valor: 'venta_almendra', etiqueta: 'Venta almendra' },
      { valor: 'subvencion', etiqueta: 'Subvencion' },
      { valor: 'otros', etiqueta: 'Otros' }
    ],
    calendario: [
      { mes: 0, tareas: ['Reposo invernal', 'Poda de formacion', 'Tratamientos invierno'] },
      { mes: 1, tareas: ['Inicio floracion variedades tempranas', 'Prevencion heladas', 'Poda'] },
      { mes: 2, tareas: ['Plena floracion', 'Tratamientos fungicidas', 'Abonado fondo'] },
      { mes: 3, tareas: ['Cuajado del fruto', 'Control pulgones', 'Abonado nitrogenado'] },
      { mes: 4, tareas: ['Engorde del fruto', 'Riegos', 'Control Tigre del almendro'] },
      { mes: 5, tareas: ['Riegos frecuentes', 'Abonado potasio', 'Control cochinillas'] },
      { mes: 6, tareas: ['Riego intensivo', 'Control araña roja', 'Reposo fisiologico'] },
      { mes: 7, tareas: ['Inicio maduracion variedades tempranas', 'Riego', 'Preparar recoleccion'] },
      { mes: 8, tareas: ['Recoleccion variedades tempranas (Guara, Soleta)', 'Riego'] },
      { mes: 9, tareas: ['Recoleccion variedad principal', 'Abonado post-cosecha', 'Limpieza'] },
      { mes: 10, tareas: ['Fin recoleccion', 'Analisis suelo', 'Tratamientos invierno'] },
      { mes: 11, tareas: ['Poda sanitaria', 'Planificacion proximo anio', 'Reposo invernal'] }
    ]
  },

  citricos: {
    label: 'Naranjo / Citricos',
    labelLargo: 'Citrico',
    icono: '\uD83C\uDF4A',
    fruto: 'fruto',
    frutoPlural: 'frutos',
    productoVenta: 'circulos (naranja/limon/mandarina)',
    variedades: [
      'Navelina', 'Valencia Late', 'Washington Navel', 'Lane Late',
      'Salustiana', 'Cadenera', 'Clementina Fina', 'Clementina Marisol',
      'Oronules', 'Clemenules', 'Hernandina', 'Fortune',
      'Eureka (limon)', 'Verna (limon)', 'Fino (limon)', 'Meyer (limon)',
      'Star Ruby (pomelo)', 'Rio Red (pomelo)'
    ],
    estadosFenologicos: [
      { valor: 'reposo_invernal', etiqueta: 'Reposo invernal' },
      { valor: 'yema_hinchada', etiqueta: 'Yema hinchada' },
      { valor: 'floracion', etiqueta: 'Floracion' },
      { valor: 'cuajado', etiqueta: 'Cuajado' },
      { valor: 'engorde_fruto', etiqueta: 'Engorde del fruto' },
      { valor: 'inicio_coloracion', etiqueta: 'Inicio coloracion' },
      { valor: 'maduracion', etiqueta: 'Maduracion' },
      { valor: 'recoleccion', etiqueta: 'Recoleccion' }
    ],
    plagas: [
      'Mosca de la fruta (Ceratitis capitata)',
      'Minador de hojas (Phyllocnistis citrella)',
      'Piojo rojo (Chrysomphalus dictyospermi)',
      'Piojo gris (Parlatoria pergandii)',
      'Cochinilla algodonosa (Planococcus citri)',
      'Toxoptera aurantii (pulgon negro)',
      'Ara\u00f1a roja (Panonychus citri)',
      'Trips (Pezothrips kellyanus)',
      'Nematodos (Tylenchulus semipenetrans)',
      'Otras'
    ],
    metodosRecoleccion: [
      { valor: 'manual', etiqueta: 'Manual (tijera)' },
      { valor: 'vareo', etiqueta: 'Vareo' },
      { valor: 'mecanico', etiqueta: 'Mecanico (vibrador)' }
    ],
    categoriasGasto: [
      { valor: 'abono', etiqueta: 'Abono' },
      { valor: 'fitosanitario', etiqueta: 'Fitosanitario' },
      { valor: 'riego', etiqueta: 'Riego' },
      { valor: 'combustible', etiqueta: 'Combustible' },
      { valor: 'mantenimiento', etiqueta: 'Mantenimiento' },
      { valor: 'recoleccion', etiqueta: 'Recoleccion' },
      { valor: 'transporte', etiqueta: 'Transporte' },
      { valor: 'almacen', etiqueta: 'Almacen/conservacion' },
      { valor: 'seguro', etiqueta: 'Seguro' },
      { valor: 'otros', etiqueta: 'Otros' }
    ],
    categoriasIngreso: [
      { valor: 'venta_fruta_fresca', etiqueta: 'Venta fruta fresca' },
      { valor: 'venta_industria', etiqueta: 'Venta industria (zumo)' },
      { valor: 'subvencion', etiqueta: 'Subvencion' },
      { valor: 'otros', etiqueta: 'Otros' }
    ],
    calendario: [
      { mes: 0, tareas: ['Recoleccion variedades tardias', 'Reposo relativo', 'Control piojo rojo'] },
      { mes: 1, tareas: ['Fin recoleccion Valencia', 'Poda ligera', 'Abonado fondo'] },
      { mes: 2, tareas: ['Inicio brotacion', 'Tratamientos preventivos', 'Fertirriego inicio'] },
      { mes: 3, tareas: ['Floracion abundante', 'Control minador hojas', 'Abonado nitrogenado'] },
      { mes: 4, tareas: ['Cuajado', 'Control mosca fruta', 'Fertirriego'] },
      { mes: 5, tareas: ['Engorde fruto', 'Riegos frecuentes', 'Control cochinillas'] },
      { mes: 6, tareas: ['Riego intensivo', 'Control araña roja', 'Abonado potasio'] },
      { mes: 7, tareas: ['Riego', 'Inicio coloracion variedades tempranas', 'Preparar recoleccion'] },
      { mes: 8, tareas: ['Recoleccion variedades tempranas', 'Riego', 'Control trios'] },
      { mes: 9, tareas: ['Recoleccion Navelina, Clementinas', 'Riego', 'Tratamientos post-cosecha'] },
      { mes: 10, tareas: ['Recoleccion Salustiana, Lane Late', 'Abonado organico', 'Analisis suelo'] },
      { mes: 11, tareas: ['Recoleccion Valencia Late', 'Poda', 'Planificacion anual'] }
    ]
  },

  vid: {
    label: 'Vid',
    labelLargo: 'Vinedo',
    icono: '\uD83C\uDF47',
    fruto: 'uva',
    frutoPlural: 'uvas',
    productoVenta: 'uva/vino',
    variedades: [
      'Tempranillo', 'Garnacha Tinta', 'Monastrell', 'Syrah',
      'Cabernet Sauvignon', 'Merlot', 'Petit Verdot', 'Bobal',
      'Air\u00e9n', 'Verdejo', 'Albari\u00f1o', 'Godello',
      'Macabeo', 'Xarel.lo', 'Parellada', 'Malvasia',
      'Pedro Ximenez', 'Moscatel', 'Palomino'
    ],
    estadosFenologicos: [
      { valor: 'reposo_invernal', etiqueta: 'Reposo invernal (lagrima)' },
      { valor: 'yema_hinchada', etiqueta: 'Yema hinchada (borde)' },
      { valor: 'apertura_yemas', etiqueta: 'Apertura de yemas' },
      { valor: 'hojas_nacientes', etiqueta: 'Hojas nacientes' },
      { valor: 'racimo_visible', etiqueta: 'Racimo visible' },
      { valor: 'floracion', etiqueta: 'Floracion' },
      { valor: 'cuajado', etiqueta: 'Cuajado' },
      { valor: 'envero', etiqueta: 'Envero (cambio color)' },
      { valor: 'maduracion', etiqueta: 'Maduracion' },
      { valor: 'recoleccion', etiqueta: 'Recoleccion/vendimia' }
    ],
    plagas: [
      'Polilla del racimo (Lobesia botrana)',
      'Mildiu (Plasmopara viticola)',
      'Oidio (Erysiphe necator)',
      'Botritis (Botrytis cinerea)',
      'Filoxera (Daktulosphaira vitifoliae)',
      'Pulgon verde (Aphis illinoisensis)',
      'Cochinilla de la vid',
      'Ara\u00f1a roja (Tetranychus spp.)',
      'Trips (Drepanothrips reuteri)',
      'Otras'
    ],
    metodosRecoleccion: [
      { valor: 'manual', etiqueta: 'Manual (vendimia)' },
      { valor: 'mecanico', etiqueta: 'Mecanica (vendimiadora)' }
    ],
    categoriasGasto: [
      { valor: 'abono', etiqueta: 'Abono' },
      { valor: 'fitosanitario', etiqueta: 'Fitosanitario' },
      { valor: 'riego', etiqueta: 'Riego' },
      { valor: 'combustible', etiqueta: 'Combustible' },
      { valor: 'mantenimiento', etiqueta: 'Mantenimiento' },
      { valor: 'vendimia', etiqueta: 'Vendimia' },
      { valor: 'bodega', etiqueta: 'Bodega/crianza' },
      { valor: 'transporte', etiqueta: 'Transporte' },
      { valor: 'seguro', etiqueta: 'Seguro' },
      { valor: 'otros', etiqueta: 'Otros' }
    ],
    categoriasIngreso: [
      { valor: 'venta_uva', etiqueta: 'Venta uva' },
      { valor: 'venta_vino', etiqueta: 'Venta vino' },
      { valor: 'subvencion', etiqueta: 'Subvencion' },
      { valor: 'otros', etiqueta: 'Otros' }
    ],
    calendario: [
      { mes: 0, tareas: ['Reposo invernal', 'Poda seca (invernada)', 'Tratamientos invierno'] },
      { mes: 1, tareas: ['Fin poda', 'Atado de sarmientos', 'Limpieza hojas'] },
      { mes: 2, tareas: ['Llagado (sangrado)', 'Pre-primeros tratamientos', 'Abonado fondo'] },
      { mes: 3, tareas: ['Brotacion', 'Control mildiu preventivo', 'Abonado nitrogenado'] },
      { mes: 4, tareas: ['Racimo visible', 'Control polilla racimo', 'Fertirriego'] },
      { mes: 5, tareas: ['Floracion', 'Control oidio', 'Riegos'] },
      { mes: 6, tareas: ['Cuajado', 'Control mildiu/oidio', 'Despunte'] },
      { mes: 7, tareas: ['Envero inicio', 'Riego', 'Control botritis'] },
      { mes: 8, tareas: ['Envero completo', 'Maduracion inicio', 'Preparar vendimia'] },
      { mes: 9, tareas: ['Vendimia variedades blancas/tardias', 'Control madurez', 'Recoleccion'] },
      { mes: 10, tareas: ['Fin vendimia', 'Abonado post-cosecha', 'Tratamientos fin ciclo'] },
      { mes: 11, tasks: ['Reposo invernal', 'Enterramiento sarmientos', 'Planificacion anual'] }
    ]
  },

  pistacho: {
    label: 'Pistacho',
    labelLargo: 'Pistachar',
    icono: '\uD83E\uDDC0',
    fruto: 'pistacho',
    frutoPlural: 'pistachos',
    productoVenta: 'pistacho',
    variedades: [
      'Kerman (hembra)', 'Peters (macho)', 'Sirora (hembra)',
      'Randy (macho)', 'Golden Hills (hembra)', 'Lost Hills (hembra)',
      'Mateur (hembra)', 'Avdat (hembra)', 'Lassen (macho)'
    ],
    estadosFenologicos: [
      { valor: 'reposo_invernal', etiqueta: 'Reposo invernal' },
      { valor: 'yema_hinchada', etiqueta: 'Yema hinchada' },
      { valor: 'apertura_yemas', etiqueta: 'Apertura de yemas' },
      { valor: 'floracion', etiqueta: 'Floracion' },
      { valor: 'cuajado', etiqueta: 'Cuajado' },
      { valor: 'engorde_fruto', etiqueta: 'Engorde del fruto' },
      { valor: 'endurecimiento_cascara', etiqueta: 'Endurecimiento cascara' },
      { valor: 'maduracion', etiqueta: 'Maduracion' },
      { valor: 'recoleccion', etiqueta: 'Recoleccion' }
    ],
    plagas: [
      'Psila del pistacho (Agonoscena pistaciae)',
      'Mosca de la fruta',
      'Verticilosis (Verticillium dahliae)',
      'Botryosphaeria (pudricion de la corteza)',
      'Alternaria (manchas foliares)',
      'Ara\u00f1a roja',
      'Cochinillas',
      'Otras'
    ],
    metodosRecoleccion: [
      { valor: 'vibrador', etiqueta: 'Vibrador' },
      { valor: 'manual', etiqueta: 'Manual' },
      { valor: 'mecanico', etiqueta: 'Mecanico (autovibradora)' }
    ],
    categoriasGasto: [
      { valor: 'abono', etiqueta: 'Abono' },
      { valor: 'fitosanitario', etiqueta: 'Fitosanitario' },
      { valor: 'riego', etiqueta: 'Riego' },
      { valor: 'combustible', etiqueta: 'Combustible' },
      { valor: 'mantenimiento', etiqueta: 'Mantenimiento' },
      { valor: 'recoleccion', etiqueta: 'Recoleccion' },
      { valor: 'transporte', etiqueta: 'Transporte' },
      { valor: 'seguro', etiqueta: 'Seguro' },
      { valor: 'otros', etiqueta: 'Otros' }
    ],
    categoriasIngreso: [
      { valor: 'venta_pistacho', etiqueta: 'Venta pistacho' },
      { valor: 'subvencion', etiqueta: 'Subvencion' },
      { valor: 'otros', etiqueta: 'Otros' }
    ],
    calendario: [
      { mes: 0, tareas: ['Reposo invernal', 'Poda formacion', 'Reposo absoluto'] },
      { mes: 1, tareas: ['Poda', 'Tratamientos invierno', 'Revision plantacion'] },
      { mes: 2, tareas: ['Inicio brotacion', 'Abonado fondo', 'Preparar riego'] },
      { mes: 3, tareas: ['Floracion (male/female sync)', 'Control psila', 'Fertirriego'] },
      { mes: 4, tareas: ['Cuajado', 'Riegos', 'Control araña roja'] },
      { mes: 5, tareas: ['Engorde fruto', 'Riegos frecuentes', 'Abonado potasio'] },
      { mes: 6, tareas: ['Engorde', 'Riego intensivo', 'Control cochinillas'] },
      { mes: 7, tareas: ['Endurecimiento cascara', 'Riego', 'Preparar recoleccion'] },
      { mes: 8, tareas: ['Inicio maduracion', 'Reducir riego', 'Control Botryosphaeria'] },
      { mes: 9, tareas: ['Recoleccion (Kerman)', 'Secado', 'Limpieza'] },
      { mes: 10, tareas: ['Fin recoleccion', 'Abonado post-cosecha', 'Analisis suelo'] },
      { mes: 11, tareas: ['Poda sanitaria', 'Reposo invernal', 'Planificacion'] }
    ]
  },

  frutales: {
    label: 'Otros frutales',
    labelLargo: 'Frutales',
    icono: '\uD83C\uDF4E',
    fruto: 'fruta',
    frutoPlural: 'frutas',
    productoVenta: 'fruta',
    variedades: [
      'Manzano Golden', 'Manzano Reineta', 'Manzano Fuji',
      'Peral Conferencia', 'Peral Blanquilla', 'Peral Limonera',
      'Melocotonero Babygold', 'Melocotonero Catherine', 'Nectarina',
      'Albaricoquero Bulida', 'Albaricoquero Moniqui',
      'Ciruelo Claudia', 'Ciruelo Stanley', 'Ciruelo Santa Rosa',
      'Cerezo Burlat', 'Cerezo Napoleon', 'Cerezo Van',
      'Granado Mollar', 'Granado Tres de Elche',
      'Higuera', 'Kaki', 'Caqui'
    ],
    estadosFenologicos: [
      { valor: 'reposo_invernal', etiqueta: 'Reposo invernal' },
      { valor: 'yema_hinchada', etiqueta: 'Yema hinchada' },
      { valor: 'floracion', etiqueta: 'Floracion' },
      { valor: 'cuajado', etiqueta: 'Cuajado' },
      { valor: 'engorde_fruto', etiqueta: 'Engorde del fruto' },
      { valor: 'envero', etiqueta: 'Envero (cambio color)' },
      { valor: 'maduracion', etiqueta: 'Maduracion' },
      { valor: 'recoleccion', etiqueta: 'Recoleccion' }
    ],
    plagas: [
      'Mosca de la fruta (Ceratitis capitata)',
      'Polilla del manzano (Cydia pomonella)',
      'Pulgon verde (Aphis pomi)',
      'Piojo de San Jose (Quadraspidiotus perniciosus)',
      'Ara\u00f1a roja (Panonychus ulmi)',
      'Trip (Frankliniella occidentalis)',
      'Oidio (Podosphaera leucotricha)',
      'Moteado (Venturia inaequalis)',
      'Cancro bacteriano',
      'Otras'
    ],
    metodosRecoleccion: [
      { valor: 'manual', etiqueta: 'Manual' },
      { valor: 'vareo', etiqueta: 'Vareo (algunos frutales)' },
      { valor: 'mecanico', etiqueta: 'Mecanico (vibrador)' }
    ],
    categoriasGasto: [
      { valor: 'abono', etiqueta: 'Abono' },
      { valor: 'fitosanitario', etiqueta: 'Fitosanitario' },
      { valor: 'riego', etiqueta: 'Riego' },
      { valor: 'combustible', etiqueta: 'Combustible' },
      { valor: 'mantenimiento', etiqueta: 'Mantenimiento' },
      { valor: 'recoleccion', etiqueta: 'Recoleccion' },
      { valor: 'almacen', etiqueta: 'Almacen/camera' },
      { valor: 'transporte', etiqueta: 'Transporte' },
      { valor: 'seguro', etiqueta: 'Seguro' },
      { valor: 'otros', etiqueta: 'Otros' }
    ],
    categoriasIngreso: [
      { valor: 'venta_fruta_fresca', etiqueta: 'Venta fruta fresca' },
      { valor: 'venta_industria', etiqueta: 'Venta industria (mermelada/zumo)' },
      { valor: 'subvencion', etiqueta: 'Subvencion' },
      { valor: 'otros', etiqueta: 'Otros' }
    ],
    calendario: [
      { mes: 0, tareas: ['Reposo invernal', 'Poda formacion/fructificacion', 'Tratamientos invierno'] },
      { mes: 1, tareas: ['Fin poda', 'Recoger restos', 'Prevencion heladas'] },
      { mes: 2, tareas: ['Inicio brotacion', 'Abonado fondo', 'Pre-tratamientos'] },
      { mes: 3, tareas: ['Floracion', 'Control moteado/oidio', 'Abonado nitrogenado'] },
      { mes: 4, tareas: ['Cuajado', 'Aclareo de frutos', 'Control polilla'] },
      { mes: 5, tareas: ['Engorde fruto', 'Riegos', 'Control pulgon/araña'] },
      { mes: 6, tareas: ['Engorde', 'Riego intensivo', 'Control mosca fruta'] },
      { mes: 7, tareas: ['Inicio maduracion cerezas/albaricoques', 'Riego', 'Preparar recoleccion'] },
      { mes: 8, tareas: ['Recoleccion cerezas, albaricoques, melocoton temprano', 'Riego'] },
      { mes: 9, tareas: ['Recoleccion melocoton, pera, manzano inicio', 'Control post-cosecha'] },
      { mes: 10, tareas: ['Recoleccion manzano, peral tardios', 'Abonado post-cosecha', 'Analisis'] },
      { mes: 11, tareas: ['Poda sanitaria', 'Reposo invernal', 'Planificacion anual'] }
    ]
  },

  otro: {
    label: 'Otro / Personalizado',
    labelLargo: 'Cultivo personalizado',
    icono: '\uD83C\uDF31',
    fruto: 'fruto',
    frutoPlural: 'frutos',
    productoVenta: 'producto',
    variedades: [],
    estadosFenologicos: [
      { valor: 'reposo_invernal', etiqueta: 'Reposo invernal' },
      { valor: 'brotacion', etiqueta: 'Brotacion' },
      { valor: 'floracion', etiqueta: 'Floracion' },
      { valor: 'cuajado', etiqueta: 'Cuajado' },
      { valor: 'engorde_fruto', etiqueta: 'Engorde del fruto' },
      { valor: 'maduracion', etiqueta: 'Maduracion' },
      { valor: 'recoleccion', etiqueta: 'Recoleccion' }
    ],
    plagas: ['Otras'],
    metodosRecoleccion: [
      { valor: 'manual', etiqueta: 'Manual' },
      { valor: 'vareo', etiqueta: 'Vareo' },
      { valor: 'mecanico', etiqueta: 'Mecanico' },
      { valor: 'desprendimiento_natural', etiqueta: 'Desprendimiento natural' }
    ],
    categoriasGasto: [
      { valor: 'abono', etiqueta: 'Abono' },
      { valor: 'fitosanitario', etiqueta: 'Fitosanitario' },
      { valor: 'riego', etiqueta: 'Riego' },
      { valor: 'combustible', etiqueta: 'Combustible' },
      { valor: 'mantenimiento', etiqueta: 'Mantenimiento' },
      { valor: 'recoleccion', etiqueta: 'Recoleccion' },
      { valor: 'transporte', etiqueta: 'Transporte' },
      { valor: 'seguro', etiqueta: 'Seguro' },
      { valor: 'otros', etiqueta: 'Otros' }
    ],
    categoriasIngreso: [
      { valor: 'venta_producto', etiqueta: 'Venta producto' },
      { valor: 'subvencion', etiqueta: 'Subvencion' },
      { valor: 'otros', etiqueta: 'Otros' }
    ],
    calendario: [
      { mes: 0, tareas: ['Reposo invernal', 'Planificacion anual', 'Revision maquinaria'] },
      { mes: 1, tareas: ['Poda', 'Tratamientos invierno', 'Preparacion terreno'] },
      { mes: 2, tareas: ['Inicio brotacion', 'Abonado fondo', 'Siembra/trasplante'] },
      { mes: 3, tareas: ['Floracion', 'Abonado nitrogenado', 'Control plagas'] },
      { mes: 4, tareas: ['Cuajado', 'Fertirriego', 'Riegos'] },
      { mes: 5, tareas: ['Engorde fruto', 'Riegos frecuentes', 'Control plagas'] },
      { mes: 6, tareas: ['Riego intensivo', 'Vigilar plagas', 'Control adventicias'] },
      { mes: 7, tareas: ['Pre-maduracion', 'Riego', 'Preparar recoleccion'] },
      { mes: 8, tareas: ['Inicio recoleccion', 'Riego', 'Control calidad'] },
      { mes: 9, tareas: ['Recoleccion principal', 'Post-cosecha', 'Limpieza'] },
      { mes: 10, tareas: ['Fin recoleccion', 'Abonado post-cosecha', 'Analisis suelo'] },
      { mes: 11, tareas: ['Poda sanitaria', 'Reposo invernal', 'Planificacion'] }
    ]
  }
};

export const CULTIVO_LIST = Object.entries(CULTIVOS).map(([key, val]) => ({
  key,
  ...val
}));

export function getCultivo(tipoCultivo) {
  return CULTIVOS[tipoCultivo] || CULTIVOS.olivo;
}
