import { useEffect, useState } from 'react'
import { Table, Tag } from 'antd'
import dayjs from 'dayjs'

/* =======================
   Interfaces
======================= */
interface Producto {
  id: number
  nombre: string
  stock: number
  fechaCaducidad: string
}

/* =======================
   Componente
======================= */
export default function Caducidad() {
  const [productos, setProductos] = useState<Producto[]>([])

  /* =======================
     Cargar productos
  ======================= */
  const cargarProductos = async () => {
    const res = await fetch('http://localhost:3001/productos')
    const data = await res.json()
    setProductos(data)
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  /* =======================
     Calcular estado
  ======================= */
  const estadoCaducidad = (fecha: string) => {
    const hoy = dayjs()
    const caducidad = dayjs(fecha)
    const dias = caducidad.diff(hoy, 'day')

    if (dias < 0) {
      return <Tag color="red">Caducado</Tag>
    }

    if (dias <= 5) {
      return <Tag color="orange">Por caducar</Tag>
    }

    return <Tag color="green">Vigente</Tag>
  }

  /* =======================
     Render
  ======================= */
  return (
    <>
      <h2>⏰ Control de Caducidad</h2>

      <Table
        rowKey="id"
        dataSource={productos}
        columns={[
          {
            title: 'Producto',
            dataIndex: 'nombre'
          },
          {
            title: 'Stock',
            dataIndex: 'stock'
          },
          {
            title: 'Fecha de caducidad',
            dataIndex: 'fechaCaducidad'
          },
          {
            title: 'Estado',
            render: (_, record) =>
              estadoCaducidad(record.fechaCaducidad)
          }
        ]}
      />
    </>
  )
}
