import { useEffect, useState } from "react"

import { Switch, Table, Button, Popover, Input, Card } from "antd"
import { EditOutlined } from '@ant-design/icons'

import firebaseApp from "../../../firebase-config"
import { getFirestore, doc, updateDoc } from 'firebase/firestore'

const db = getFirestore(firebaseApp)

const OrderRouteTable = ({updateTable, day, dataSource}) => {

    const [newOrder, setNewOrder] = useState()

    const onChangeSwitch = async (checked, client) => {
        const docRef = doc(db, day, client)

        checked ? updateDoc(docRef, { entregable: true }) : updateDoc(docRef, { entregable: false })
        updateTable()
    }

    const handleEditOrder = (client) => {
        const docRef = doc(db, day, client)
        updateDoc(docRef, { ordenEntrega: parseInt(newOrder) })
        updateTable()
        
        
    }

    const columns = [
        { title: 'Editar orden', key: 'orderEdit', render: (params) => {
            return (
                <Popover content={content(params.name, params.order)} title={"Orden "+params.name} trigger="click" >
                    <EditOutlined style={{ fontSize: '25px' }} />
                </Popover>
            )
        }},
        { title: 'Orden', dataIndex: 'order', key: 'order' },
        { title: 'Cliente', dataIndex: 'name', key: 'name' },
        { title: 'Entregable?', dataIndex: 'isDeliveryAvail', key: 'isDeliveryAvail', render: (e, params) => <Switch checked={params.isDeliveryAvail} defaultChecked={params.isDeliveryAvail} onClick={(checked) => onChangeSwitch(checked, params.name)} /> }
    ]

    const content = (name, order) => {
        return (
            <div style={{ display: 'grid' }}>
                <Input defaultValue={order} onChange={e => setNewOrder(e.target.value)} style={{ width: '80px', marginBottom: '5px' }} />
                <Button type="primary" onClick={() => handleEditOrder(name)} >Actualizar</Button>
            </div>
        )
    }

    useEffect(() => {
        updateTable()
    }, [])

    return (
        <>
            <Card 
                title="Clientes dentro de la ruta"
                bordered='true'
                style={{ width: '500px' }}
                headStyle={{ backgroundColor: '#383c44', color: '#fff', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
            >
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    scroll={{ x: 1 }}
                    // bordered
                />
            </Card>
        </>
    )
}
 
export default OrderRouteTable