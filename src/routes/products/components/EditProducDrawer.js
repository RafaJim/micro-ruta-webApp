import { useEffect, useState } from 'react'

import firebaseApp from "../../../firebase-config"
import { getFirestore, doc, updateDoc } from 'firebase/firestore'

import { Drawer, Space, Button, Input, notification } from 'antd'

const EditProductDrawer = ({ dataSource, openClose, open, getData }) => {
    const db = getFirestore(firebaseApp)

    const [product, setProduct] = useState()
    const [price, setPrice] = useState()

    const handleClose = (bool) => {
        openClose(bool)
    }

    const handleUpdate = async () => {
        const docRef = doc(db, 'Producto', product)
        try{
            await updateDoc(docRef, {
                nombre: product,
                precio: price
            })

            notification.success({
                message: 'Actualizado exitoso'
            })
            getData()
        } catch(err) {
            notification.error({
                message: 'Error en la actualizacion de datos',
                description: `${err}`
            })
        }
    }

    useEffect(() => {
        setProduct(dataSource.product)
        setPrice(dataSource.price)
    }, [open])

    return (
        <>
            <Drawer 
                title={`Editar cliente ${dataSource.name}`}
                width='50%'
                onClose={() => handleClose(false)}
                open={open}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                      <Button onClick={() => handleClose(false)}>Cancelar</Button>
                      <Button onClick={() => handleUpdate()} type="primary">
                        Actualizar
                      </Button>
                    </Space>
                }
            >
                <h3>Producto</h3>
                <Input value={product} onChange={e => setProduct(e.target.value)} />
                <h3>Precio</h3>
                <Input value={price} onChange={e => setPrice(e.target.value)} />
            </Drawer>
        </>
    )
}
 
export default EditProductDrawer