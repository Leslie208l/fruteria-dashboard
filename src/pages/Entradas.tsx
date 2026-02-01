import { useEffect, useState } from 'react'
import {
  Button,
  Form,
  InputNumber,
  Select,
  Table,
  message,
  DatePicker
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

interface Entrada {
  id?: number
  productoId: number
  cantidad: number
  fecha: string
}

/* =======================
   Componente
======================= */
export default function Entradas() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [entradas, setEntradas] = useState<Entrada[]>([])
  const [form] = Form.useForm()

  /* =======================
     Cargar datos
  ======================= */
  const cargarDatos = async () => {
    const resProductos = await fetch('http://localhost:3001/productos')
    const dataProductos = await resProductos.json()
    setProductos(dataProductos)

    const resEntradas = await fetch('http://localhost:3001/entradas')
    const dataEntradas = await resEntradas.json()
    setEntradas(dataEntradas)
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  /* =======================
     Registrar entrada
  ======================= */
  const registrarEntrada = async () => {
    try {
      const values = await form.validateFields()

      const producto = productos.find(
        p => p.id === values.productoId
      )
      if (!producto) return

      const nuevaEntrada: Entrada = {
        productoId: values.productoId,
        cantidad: values.cantidad,
        fecha: values.fecha.format('YYYY-MM-DD')
      }

      // Guardar entrada
      await fetch('http://localhost:3001/entradas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaEntrada)
      })

      // Actualizar stock del producto
      await fetch(`http://localhost:3001/productos/${producto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...producto,
          stock: producto.stock + values.cantidad
        })
      })

      message.success('Entrada registrada y stock actualizado')
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
      <h2>📥 Registro de Entradas</h2>

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
          <Select style={{ width: 200 }}>
            {productos.map(p => (
              <Select.Option key={p.id} value={p.id}>
                {p.nombre}
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

        <Button type="primary" onClick={registrarEntrada}>
          Registrar Entrada
        </Button>
      </Form>

      <Table
        rowKey="id"
        dataSource={entradas}
        columns={[
          {
            title: 'Producto',
            render: (_, e) => {
              const producto = productos.find(
                p => p.id === e.productoId
              )
              return producto?.nombre
            }
          },
          {
            title: 'Cantidad',
            dataIndex: 'cantidad'
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
