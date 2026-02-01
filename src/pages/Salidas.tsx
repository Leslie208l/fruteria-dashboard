import { useEffect, useState } from 'react'
import {
  Button,
  Form,
  InputNumber,
  Select,
  Table,
  message,
  DatePicker,
  Tag
} from 'antd'
import dayjs from 'dayjs'

/* =======================
   Interfaces
======================= */
interface Producto {
  id: number
  nombre: string
  stock: number
}

interface Salida {
  id?: number
  productoId: number
  cantidad: number
  fecha: string
}

/* =======================
   Componente
======================= */
export default function Salidas() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [salidas, setSalidas] = useState<Salida[]>([])
  const [form] = Form.useForm()

  /* =======================
     Cargar datos
  ======================= */
  const cargarDatos = async () => {
    const resProductos = await fetch('http://localhost:3001/productos')
    const dataProductos = await resProductos.json()
    setProductos(dataProductos)

    const resSalidas = await fetch('http://localhost:3001/salidas')
    const dataSalidas = await resSalidas.json()
    setSalidas(dataSalidas)
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  /* =======================
     Registrar salida
  ======================= */
  const registrarSalida = async () => {
    try {
      const values = await form.validateFields()

      const producto = productos.find(
        p => p.id === values.productoId
      )

      if (!producto) return

      // ❌ Validación de stock
      if (values.cantidad > producto.stock) {
        message.error('Stock insuficiente')
        return
      }

      const nuevaSalida: Salida = {
        productoId: values.productoId,
        cantidad: values.cantidad,
        fecha: values.fecha.format('YYYY-MM-DD')
      }

      // Guardar salida
      await fetch('http://localhost:3001/salidas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaSalida)
      })

      // Actualizar stock del producto
      await fetch(`http://localhost:3001/productos/${producto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...producto,
          stock: producto.stock - values.cantidad
        })
      })

      message.success('Salida registrada correctamente')
      form.resetFields()
      cargarDatos()
    } catch (error) {
      message.error('Completa todos los campos')
    }
  }

  /* =======================
     Render
  ======================= */
  return (
    <>
      <h2>📤 Registro de Salidas</h2>

      <Form
        form={form}
        layout="inline"
        style={{ marginBottom: 16 }}
      >
        <Form.Item
          label="Producto"
          name="productoId"
          rules={[
            { required: true, message: 'Selecciona un producto' }
          ]}
        >
          <Select style={{ width: 220 }}>
            {productos.map(p => (
              <Select.Option key={p.id} value={p.id}>
                {p.nombre} — Stock: {p.stock}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Cantidad"
          name="cantidad"
          rules={[
            { required: true, message: 'Ingresa la cantidad' }
          ]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item
          label="Fecha"
          name="fecha"
          rules={[
            { required: true, message: 'Selecciona la fecha' }
          ]}
        >
          <DatePicker defaultValue={dayjs()} />
        </Form.Item>

        <Button danger type="primary" onClick={registrarSalida}>
          Registrar Salida
        </Button>
      </Form>

      <Table
        rowKey="id"
        dataSource={salidas}
        columns={[
          {
            title: 'Producto',
            render: (_, s) => {
              const producto = productos.find(
                p => p.id === s.productoId
              )
              return producto?.nombre
            }
          },
          {
            title: 'Cantidad',
            dataIndex: 'cantidad',
            render: (cantidad) => (
              <Tag color="red">-{cantidad}</Tag>
            )
          },
          {
            title: 'Fecha',
            dataIndex: 'fecha'
          }
        ]}
      />
    </>
  )
}
