import { Layout, Menu } from 'antd'
import {
  AppstoreOutlined,
  ShoppingOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { useState } from 'react'

// Páginas
import Dashboard from './pages/Dashboard'
import Productos from './pages/Productos'
import Entradas from './pages/Entradas'
import Salidas from './pages/Salidas'
import Caducidad from './pages/Caducidad'


const { Header, Sider, Content } = Layout

function App() {
  const [vista, setVista] = useState<string>('dashboard')

  const renderVista = () => {
  switch (vista) {
    case 'dashboard':
      return <Dashboard />

    case 'productos':
      return <Productos />

    case 'entradas':
      return <Entradas />

    case 'salidas':
      return <Salidas />

    case 'caducidad':
      return <Caducidad />

    default:
      return null
  }
}


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[vista]}
          onClick={({ key }) => setVista(key as string)}
          items={[
            { key: 'dashboard', icon: <AppstoreOutlined />, label: 'Dashboard' },
            { key: 'productos', icon: <ShoppingOutlined />, label: 'Productos' },
            { key: 'entradas', icon: <PlusCircleOutlined />, label: 'Entradas' },
            { key: 'salidas', icon: <MinusCircleOutlined />, label: 'Salidas' },
            { key: 'caducidad', icon: <ClockCircleOutlined />, label: 'Caducidad' },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', paddingLeft: 16 }}>
          <h1>🍎 Dashboard de Frutería</h1>
        </Header>

        <Content style={{ margin: 16 }}>
          {renderVista()}
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
