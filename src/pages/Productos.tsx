import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Table,
  DatePicker,
  message,
  Space,
  Popconfirm
} from 'antd'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

interface Producto {
  id?: number
  nombre: string
  categoria: string
  precio: number
  stock: number
  fechaCaducidad: string
}

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Producto | null>(null)
  const [form] = Form.useForm()

  const cargarProductos = () => {
    fetch('http://localhost:3001/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const abrirModal = (producto?: Producto) => {
    setEditing(producto || null)
    setOpen(true)

    if (producto) {
      form.setFieldsValue({
        ...producto,
        fechaCaducidad: dayjs(producto.fechaCaducidad)
      })
    } else {
      form.resetFields()
    }
  }

  const guardarProducto = async () => {
    try {
      const values = await form.validateFields()

      const producto: Producto = {
        ...values,
        fechaCaducidad: values.fechaCaducidad.format('YYYY-MM-DD')
      }

      if (editing && editing.id) {
        await fetch(`http://localhost:3001/productos/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...producto, id: editing.id })
        })
        message.success('Producto actualizado correctamente')
      } else {
        await fetch('http://localhost:3001/productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(producto)
        })
        message.success('Producto agregado correctamente')
      }

      setOpen(false)
      setEditing(null)
      cargarProductos()
    } catch {
      message.error('Revisa los campos del formulario')
    }
  }

  const eliminarProducto = async (id: number) => {
    await fetch(`http://localhost:3001/productos/${id}`, {
      method: 'DELETE'
    })
    message.success('Producto eliminado')
    cargarProductos()
  }

  return (
    <>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => abrirModal()}
      >
        + Nuevo Producto
      </Button>

      <Table
        rowKey="id"
        dataSource={productos}
        pagination={{ pageSize: 5 }}
        columns={[
          { title: 'Nombre', dataIndex: 'nombre' },
          { title: 'Categoría', dataIndex: 'categoria' },
          { title: 'Precio', dataIndex: 'precio' },
          { title: 'Stock', dataIndex: 'stock' },
          { title: 'Caducidad', dataIndex: 'fechaCaducidad' },
          {
            title: 'Acciones',
            render: (_, record) => (
              <Space>
                <Button onClick={() => abrirModal(record)}>Editar</Button>
                <Popconfirm
                  title="¿Eliminar producto?"
                  onConfirm={() => eliminarProducto(record.id!)}
                >
                  <Button danger>Eliminar</Button>
                </Popconfirm>
              </Space>
            )
          }
        ]}
      />

      <Modal
        open={open}
        title={editing ? 'Editar Producto' : 'Nuevo Producto'}
        onCancel={() => setOpen(false)}
        onOk={guardarProducto}
        okText="Guardar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'Ingrese el nombre' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Categoría"
            name="categoria"
            rules={[{ required: true, message: 'Ingrese la categoría' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Precio"
            name="precio"
            rules={[{ required: true, message: 'Ingrese el precio' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Stock"
            name="stock"
            rules={[{ required: true, message: 'Ingrese el stock' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Fecha de caducidad"
            name="fechaCaducidad"
            rules={[{ required: true, message: 'Seleccione la fecha' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
