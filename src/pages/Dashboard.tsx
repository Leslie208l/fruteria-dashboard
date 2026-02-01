import { Card, Col, Row, Statistic, Table, Tag } from 'antd'
import { useEffect, useState } from 'react'

interface Producto {
  id: number
  nombre: string
  stock: number
  fechaCaducidad: string
}

export default function Dashboard() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [entradas, setEntradas] = useState<any[]>([])
  const [salidas, setSalidas] = useState<any[]>([])

  useEffect(() => {
    fetch('http://localhost:3001/productos')
      .then(res => res.json())
      .then(data => setProductos(data))

    fetch('http://localhost:3001/entradas')
      .then(res => res.json())
      .then(data => setEntradas(data))

    fetch('http://localhost:3001/salidas')
      .then(res => res.json())
      .then(data => setSalidas(data))
  }, [])

  const stockTotal = productos.reduce((acc, p) => acc + p.stock, 0)

  const productosPorCaducar = productos.filter(p => {
    const hoy = new Date()
    const caduca = new Date(p.fechaCaducidad)
    const diff = (caduca.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
    return diff <= 7 && diff >= 0
  })

  return (
    <>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Stock total" value={stockTotal} />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Productos por caducar"
              value={productosPorCaducar.length}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="Entradas registradas" value={entradas.length} />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="Salidas registradas" value={salidas.length} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Productos por caducar">
            <Table
              size="small"
              dataSource={productosPorCaducar}
              rowKey="id"
              pagination={false}
              columns={[
                { title: 'Producto', dataIndex: 'nombre' },
                {
                  title: 'Estado',
                  render: () => <Tag color="orange">Por caducar</Tag>
                }
              ]}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}
