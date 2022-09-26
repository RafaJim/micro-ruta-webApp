import { useEffect, useState } from "react"
import EditProductDrawer from "./components/EditProducDrawer"
import NewProductDrawer from "./components/NewProductDrawer"

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import { notification, Col, Row, Typography, Table, Popconfirm, Space, Button } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"

import firebaseApp from "../../firebase-config"
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore'

const { Title } = Typography;

const Products = () => {
    const data = []
    const data2 = {product: '', price: 0}
    const db = getFirestore(firebaseApp)

    const [products, setProducts] = useState(data)
    const [open, setOpen] = useState(false)
    const [openNew, setOpenNew]= useState(false)
    const [clientData, setClientData] = useState(data2)
    
    const getProducts = async () => {
        const colRef = collection(db, 'Producto')
        let res = []
        let id = 0
        let arrAux = []

        const products = await getDocs(colRef)
        try{
            products.docs.map((product) => {
                arrAux.push(
                    product.data()
                )
            })
        } catch(err) {
            console.log(err)
        }

        arrAux.map((item) => {
            res.push({
                key: id,
                product: item.nombre,
                price: item.precio
            })
            id++
        })
        setProducts(res)
    }
    
    const handleDeleteClient = (params) => {
        const docRef = doc(db, 'Producto', params)
        deleteDoc(docRef)
        const res = products.filter((product) => product.product !== params )
        setProducts(res)
    }

    const columns = [
        { title: 'Producto', dataIndex: 'product', key: 'product' },
        { title: 'Precio', dataIndex: 'price', key: 'price' },
        { title: 'Acciones', key: 'actions', render: (params) => 
            <Space>
                <Popconfirm title="Desea eliminar?" onConfirm={() => handleDeleteClient(params.product)}>
                    <DeleteOutlined style={{ fontSize: '20px' }} />
                </Popconfirm>
                <EditOutlined onClick={() => (setOpen(true), setClientData(params))} style={{ fontSize: '20px', marginLeft: '10px' }} />
            </Space>
        }
    ]

    const handleOpenCloseDrawer = (bool) => {
        setOpen(bool)
        setOpenNew(bool)
    }
    
    useEffect(() => {
        getProducts()
    }, [])

    return (
        <>
            <Title>Productos</Title>
            
            <Container style={{ width: '100%', borderRadius: '15px' }}>

                <Row justify="space-between" style={{ padding: 10, borderTopLeftRadius: '10px', borderTopRightRadius: '10px', backgroundColor: '#383c44' }}>
                    <Button onClick={() => setOpenNew(true)} type="primary" icon={<PlusOutlined />} style={{ backgroundColor: 'green', borderColor: "green" }} >Cliente</Button>
                </Row>

                <Box sx={{ display: 'flex', borderStyle: 'groove', backgroundColor: '#fff' }}>
                    <Grid container >
                        <Grid item xs={12}>
                            <Table
                                columns={columns}
                                dataSource={products}
                                pagination={false}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <EditProductDrawer dataSource={clientData} openClose={handleOpenCloseDrawer} open={open} getData={getProducts} />
                <NewProductDrawer open={openNew} openClose={handleOpenCloseDrawer} getData={getProducts} />

            </Container>
        </>
    )
}
 
export default Products;