export type TipoProductoComida = 'Plato' | 'Materia Prima Cocina'

// ==================== PRODUCTOS ====================
export type ProductoComida = {
  id: string
  codigo: string // PC-00001 para Platos, MC-00001 para Materia Prima
  descripcion: string
  tipo: TipoProductoComida
  categoria: string
  precio_unitario: number
  unidad_medida: string
  existencia: number
  situacion: 'Activo' | 'Inactivo'
  disponible: boolean
  imagen?: string
  descripcion_corta?: string

  // COMIDAS ESPECÍFICO
  vencimiento?: string // ISO date
  lote?: string
  rotacion: 'FIFO' | 'LIFO' | 'NINGUNO'
  requiere_refrigeracion: boolean
  temperatura_minima?: number
  temperatura_maxima?: number
  es_perecedero: boolean
  merma_esperada?: number // %
  caracteristicas_calidad?: string[]
  bodega_recomendada?: 'Despensa' | 'Nevera' | 'Congelador'
  requiere_etiqueta: boolean
  aplica_trazabilidad: boolean
}

// ==================== INGREDIENTES ====================
export type IngredienteComida = {
  id: string
  producto_id: string
  codigo: string
  descripcion: string
  cantidad: number
  unidad_medida: string
}

// ==================== FÓRMULAS ====================
export type FormulaComida = {
  id: string
  nro_formula: number
  consecutivo: string // REC-00001
  plato_id: string
  plato_codigo: string
  plato_nombre: string
  nombre_receta: string
  descripcion: string
  porciones: number
  ingredientes: IngredienteComida[]
  situacion: 'Activa' | 'Inactiva'

  // COMIDAS ESPECÍFICO
  costo_total_ingredientes: number
  costo_por_porcion: number
  merma_esperada_porcentaje?: number
  rendimiento_esperado: number
  rendimiento_real?: number
  tiempo_preparacion: number // minutos
  dificultad: 'Fácil' | 'Media' | 'Difícil'
  requiere_capacitacion: boolean
  contiene_alergenos?: string[]
  apto_para?: string[]
  tiene_variaciones?: boolean
  variaciones?: {
    nombre: string
    cambios_ingredientes: IngredienteComida[]
    costo_adicional?: number
  }[]
}

// ==================== PROVEEDORES ====================
export type ProveedorComida = {
  id: string
  codigo: string // PC-00001
  nombre: string
  contacto: string
  telefono: string
  email: string
  direccion: string
  ciudad: string

  // ESPECIALIZACIÓN
  tipos_alimentos: string[] // ['Frutas', 'Carnes', 'Lácteos', etc]
  dias_entrega: number[] // [1,3,5] = Lun, Miér, Viern
  tiempo_entrega_dias: number
  requiere_orden_minima: boolean
  orden_minima_valor?: number

  // DATOS COMERCIALES
  condiciones_pago: string
  plazo_dias: number
  descuentos?: {
    cantidad: number
    porcentaje: number
  }[]

  situacion: 'Activo' | 'Inactivo'

  // CALIDAD
  puntuacion_calidad?: number // 1-5
  frecuencia_rechazos?: number
  notas_especiales?: string
}

// ==================== ÓRDENES DE COMPRA ====================
export type DetalleOC = {
  producto_id: string
  cantidad: number
  unidad_medida: string
  precio_unitario: number
  vencimiento_minimo?: string // ISO date
  lote_especifico?: string
  subtotal: number
}

export type OrdenComida = {
  id: string
  numero: string // OC-00001
  fecha: string // ISO date
  proveedor_id: string
  situacion: 'Borrador' | 'Confirmada' | 'Entregada' | 'Cancelada'

  // COMIDAS ESPECÍFICO
  tipo: 'Semanal' | 'Quincenal' | 'Mensual' | 'Extraordinaria'
  frecuencia_esperada: 'Diaria' | 'Semanal' | 'Personalizada'
  dias_entrega: number[]
  es_urgente: boolean
  justificacion_urgencia?: string

  // PRESUPUESTO
  presupuesto_disponible?: number

  // DETALLES
  detalles: DetalleOC[]
  total: number

  // SEGUIMIENTO
  fecha_entrega_esperada: string
  fecha_entrega_real?: string
  observaciones?: string
  creado_por: string
  aprobado_por?: string
}

// ==================== RECEPCIÓN DE FACTURAS ====================
export type DetalleRecepcion = {
  producto_id: string
  cantidad_ordenada: number
  cantidad_recibida: number
  lote: string
  vencimiento: string // ISO date
  condicion: 'Aceptado' | 'Rechazado' | 'Parcial'
  razon_rechazo?: string
  observaciones_calidad?: string
  temperatura_al_recibir?: number
}

export type RecepcionFacturaComida = {
  id: string
  numero: string // RF-00001
  fecha: string // ISO date
  proveedor_id: string
  orden_compra_id: string

  // INSPECCIÓN
  inspeccion_realizada: boolean
  inspector_id?: string
  fecha_inspeccion?: string

  // DETALLES
  detalles: DetalleRecepcion[]

  // TRAZABILIDAD
  aplica_trazabilidad: boolean
  codigo_trazabilidad: string

  total_aceptado: number
  total_rechazado: number
}

// ==================== BODEGAS ====================
export type BodegaComida = {
  id: string
  codigo: string // BD-00001
  nombre: string
  tipo: 'Despensa' | 'Nevera' | 'Congelador' | 'Almacen_Seco'

  // CONTROL TEMPERATURA
  temperatura_controlada: boolean
  temperatura_objetivo?: number
  humedad_controlada: boolean

  // OPERACIÓN
  requiere_monitoreo: boolean
  responsable_bodega: string
  capacidad_maxima?: number
  requiere_inventario_frecuente: boolean
  dias_inventario: number

  situacion: 'Activo' | 'Inactivo'
}

// ==================== SALIDAS DE ALMACÉN ====================
export type DetalleSalida = {
  producto_id: string
  lote: string
  cantidad: number
  motivo: string
  autorizado_por: string
  fecha_vencimiento_usado?: string
}

export type SalidaAlmacenComida = {
  id: string
  numero: string // SA-00001
  fecha: string // ISO date
  bodega_origen_id: string

  tipo_salida: 'Receta' | 'Merma' | 'Donacion' | 'Perdida' | 'Vencimiento' | 'Ajuste'
  referencia: string // Qué receta o descripción

  detalles: DetalleSalida[]

  aprobado: boolean
  aprobado_por?: string
  observaciones?: string
}

// ==================== AJUSTE DE INVENTARIO ====================
export type DetalleAjuste = {
  producto_id: string
  lote: string
  cantidad_sistema: number
  cantidad_fisica: number
  diferencia: number
  razon: string
  vencimiento?: string
}

export type AjusteInventarioComida = {
  id: string
  numero: string // AJ-00001
  fecha: string // ISO date
  bodega_id: string

  tipo_ajuste: 'Sobrante' | 'Faltante' | 'Vencimiento' | 'Merma' | 'Pérdida'

  detalles: DetalleAjuste[]

  detectado_por: string
  investigado_por?: string
  causa_raiz?: string
  accion_correctiva?: string
}

// ==================== INVENTARIO FÍSICO ====================
export type DetalleConteo = {
  producto_id: string
  lote: string
  cantidad_sistema: number
  cantidad_contada: number
  diferencia: number
  observaciones: string
  vencimiento?: string
}

export type InventarioFisicoComida = {
  id: string
  numero: string // IF-00001
  fecha_inicio: string // ISO date
  fecha_termino?: string

  tipo: 'Total' | 'Parcial_Bodega' | 'Control_Perecederos'
  bodegas_incluidas: string[]

  // EJECUCIÓN
  responsables: string[]
  estado: 'Planeado' | 'En_Proceso' | 'Completado'

  // RESULTADOS
  detalles_conteo: DetalleConteo[]
  discrepancias_encontradas: number
  porcentaje_diferencia: number
  productos_vencidos: number
  acciones_tomadas: string[]
}

// ==================== DATOS EMPRESA ====================
export type DatosEmpresaComida = {
  id: string
  nombre_empresa: string
  nit: string
  razon_social: string
  direccion: string
  ciudad: string
  telefono: string
  email: string
  logo?: string // base64 encoded image

  // COMIDAS ESPECÍFICO
  horario_apertura: string // HH:mm
  horario_cierre: string
  dias_operacion: number[] // [1,2,3,4,5,6,7]
  horario_compras_apertura: string
  horario_compras_cierre: string
}

// ==================== CLIENTES ====================
export type ClienteComida = {
  id: string
  nro_correlativo?: number
  tipo_cliente: 'Empresa' | 'Persona Natural' | 'Otro'
  nombre: string
  tipo_identificacion: 'CC' | 'NIT' | 'TI' | 'Pasaporte' | 'Otro'
  nro_documento: string
  correo: string
  nro_movil: string
  direccion?: string
  ciudad?: string
  poblacion?: string
  pais?: string
  situacion: 'Activo' | 'Inactivo'
  fecha_creacion: string
}

// ==================== USUARIOS ====================
export type RolComida = 'Admin' | 'Gerente' | 'Comprador' | 'Bodeguero' | 'Chef' | 'Caja' | 'Viewer'

export type UsuarioComida = {
  id: string
  email: string
  nombre: string
  rol: RolComida
  situacion: 'Activo' | 'Inactivo'
  bodegas_asignadas?: string[] // IDs de bodegas
  fecha_creacion: string
  ultimo_acceso?: string
}
