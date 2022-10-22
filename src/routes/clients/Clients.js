import { useEffect, useState } from "react"
import EditClientDrawer from "./components/EditClientDrawer"
import NewClientDrawer from "./components/NewClientDrawer"

import { Row, Typography, Table, Popconfirm, Space, Button, Col, Card } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"

import firebaseApp from "../../firebase-config"
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore'

const { Title } = Typography;

const Clients = () => {
    let data = []
    let data2 = {name: '', direction: '', location: ['','']}
    const db = getFirestore(firebaseApp)

    const [clients, setClients] = useState(data)
    const [open, setOpen] = useState(false)
    const [openNew, setOpenNew] = useState(false)
    const [clientData, setClientData] = useState(data2)
    
    const getClients = async () => {
        const colRef = collection(db, 'cliente')
        let res = []
        let id = 0
        let arrAux = []

        const clients = await getDocs(colRef)
        try{
            clients.docs.map((client) => {
                arrAux.push(
                    client.data()
                )
            })
        } catch(err) {
            console.log(err)
        }

        arrAux.map((item) => {
            res.push({
                key: id,
                name: item.nombre,
                direction: item.direccion,
                location: ["Lat: "+item.localizacion.latitude+"°", " Lon: "+item.localizacion.longitude+"°"]
            })
            id++
        })
        setClients(res)
    }
    
    const handleDeleteClient = (params) => {
        const docRef = doc(db, 'cliente', params)
        deleteDoc(docRef)
        const res = clients.filter((client) => client.name !== params )
        setClients(res)
    }

    const handleOpenCloseDrawer = (bool) => {
        setOpen(bool)
        setOpenNew(bool)
    }

    const columns = [
        { title: 'Cliente', dataIndex: 'name', key: 'name' },
        { title: 'Direccion', dataIndex: 'direction', key: 'direction' },
        { title: 'Localizacion', dataIndex: 'location', key: 'location' },
        { title: 'Acciones', key: 'actions', render: (params) => 
            <Space>
                <Popconfirm title="Desea eliminar?" onConfirm={() => handleDeleteClient(params.name)}>
                    <DeleteOutlined style={{ fontSize: '20px' }} />
                </Popconfirm>
                <EditOutlined onClick={() => (setOpen(true), setClientData(params))} style={{ fontSize: '20px', marginLeft: '10px' }} />
            </Space>
        }
    ]

    const titleContent = (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={() => setOpenNew(true)} type="primary" icon={<PlusOutlined />} style={{ backgroundColor: 'green', borderColor: "green" }} >Cliente</Button>
        </div>
    )
    
    useEffect(() => {
        getClients()
    }, [])

    return (
        <>
            <Title>Clientes</Title>

            <Row>
                <Col span={24}>
                    <Card
                        title = {titleContent}
                        bordered='true'
                        headStyle={{ backgroundColor: '#383c44', color: '#fff', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                    >
                        <Table
                            columns={columns}
                            dataSource={clients}
                            pagination={false}
                            scroll={{ x: 1 }}
                            bordered
                        />
                    </Card>
                </Col>
            </Row>

            <EditClientDrawer dataSource={clientData} open={open} openClose={handleOpenCloseDrawer} getData={getClients} />
            <NewClientDrawer open={openNew} openClose={handleOpenCloseDrawer} getData={getClients} />
        </>
    )
}
 
export default Clients