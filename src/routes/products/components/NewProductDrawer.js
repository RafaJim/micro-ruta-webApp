import { useState } from 'react'

import firebaseApp from "../../../firebase-config"
import { getFirestore, doc, setDoc } from 'firebase/firestore'

import { Drawer, Space, Button, Input, notification } from 'antd'

const NewProductDrawer = ({ openClose, open, getData }) => {
    const db = getFirestore(firebaseApp)
    const [product, setProduct] = useState("")
    const [price, setPrice]= useState('')

    const handleClose = (bool) => {
        openClose(bool)
    }

    const handleAddClient = async () => {
        const docRef = doc(db, 'Producto', product)
        try{
            await setDoc(docRef, {
                nombre: product,
                precio: price
            })

            notification.success({
                message: `Nuevo producto ${product} agregado correctamente`
            })

            getData()

        } catch(err) {
            notification.error({
                message: 'Error al agregar nuevo producto',
                description: `${err}`
            })
        }
    }

    return (
        <>
            <Drawer 
                title="Agregar producto"
                width='50%'
                onClose={() => handleClose(false)}
                open={open}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                      <Button onClick={() => handleClose(false)}>Cancelar</Button>
                      <Button onClick={handleAddClient} type="primary">
                        Agregar
                      </Button>
                    </Space>
                }
            >
                <h3>Nombre del producto</h3>
                <Input value={product} onChange={e => setProduct(e.target.value)} />
                <h3>Precio</h3>
                <Input value={price} onChange={e => setPrice(e.target.value)} />
            </Drawer>
        </>
    )
}
 
export default NewProductDrawer