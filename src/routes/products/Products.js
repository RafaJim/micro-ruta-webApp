import { useEffect, useState } from "react"

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

import { notification, Col, Row, Typography, Table, Popconfirm, Space } from 'antd'
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"

import firebaseApp from "../../firebase-config"
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore'

const { Title } = Typography;

const Products = () => {
    let data = []
    const db = getFirestore(firebaseApp)

    const [clients, setClients] = useState(data)
    
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
                code: item.codigo,
                direction: item.direccion,
                location: ["Lat: "+item.localizacion.latitude+"°,", " Lon: "+item.localizacion.longitude+"°"]
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

    const handleEdit = () => {

    }

    const columns = [
        { title: 'Cliente', dataIndex: 'name', key: 'name' },
        { title: 'Codigo', dataIndex: 'code', key: 'code' },
        { title: 'Direccion', dataIndex: 'direction', key: 'direction' },
        { title: 'Localizacion', dataIndex: 'location', key: 'location' },
        { title: 'Acciones', key: 'actions', render: (params) => 
            <Space>
                <Popconfirm title="Desea eliminar?" onConfirm={() => handleDeleteClient(params.name)}>
                    <DeleteOutlined style={{ fontSize: '20px' }} />
                </Popconfirm>
                <EditOutlined onClick={() => handleEdit} style={{ fontSize: '20px', marginLeft: '10px' }} />
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
            
                {/* <Row justify="space-between" style={{ padding: 10, borderTopLeftRadius: '10px', borderTopRightRadius: '10px', backgroundColor: '#383c44' }}>
                    <Col>
                        <DownloadOutlined onClick={handleExport} style={{ fontSize: 30, color: '#fff' }} />
                    </Col>
                </Row> */}

            <Box sx={{ display: 'flex', borderStyle: 'groove', backgroundColor: '#fff' }}>
                <Grid container >
                    <Grid item xs={12}>
                        <Table
                            columns={columns}
                            dataSource={clients}
                            // expandable={{ 
                            //     expandedRowRender
                            // }}
                        />

                        {/* <DataGrid
                            rows={clients}
                            columns={clientsColumns}
                            pageSize={7}
                            rowsPerPageOptions={[7]}
                        /> */}
                    </Grid>
                </Grid>
            </Box>
        </Container>
        </>
    )
}
 
export default Products