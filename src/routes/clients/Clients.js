import { useEffect, useState } from "react"
import EditClientDrawer from "./components/EditClientDrawer"
import NewClientDrawer from "./components/NewClientDrawer"

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import { Row, Typography, Table, Popconfirm, Space, Button } from 'antd'
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
    
    useEffect(() => {
        getClients()
    }, [])

    return (
        <>
        <Title>Clientes</Title>
            <Container style={{ width: '100%', borderRadius: '15px' }}>
            
                <Row justify="space-between" style={{ padding: 10, borderTopLeftRadius: '10px', borderTopRightRadius: '10px', backgroundColor: '#383c44' }}>
                    <Button onClick={() => setOpenNew(true)} type="primary" icon={<PlusOutlined />} style={{ backgroundColor: 'green', borderColor: "green" }} >Cliente</Button>
                </Row>

                <Box sx={{ display: 'flex', borderStyle: 'groove', backgroundColor: '#fff' }}>
                    <Grid container >
                        <Grid item xs={12}>
                            <Table
                                columns={columns}
                                dataSource={clients}
                                pagination={false}
                                scroll={{ x: 1 }}
                                // bordered
                            />
                        </Grid>
                    </Grid>
                </Box>

                <EditClientDrawer dataSource={clientData} open={open} openClose={handleOpenCloseDrawer} getData={getClients} />
                <NewClientDrawer open={openNew} openClose={handleOpenCloseDrawer} getData={getClients} />
        </Container>
        </>
    )
}
 
export default Clients