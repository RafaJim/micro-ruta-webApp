import { useEffect, useState } from 'react'

import firebaseApp from "../../../firebase-config"
import { getFirestore, doc, updateDoc, GeoPoint } from 'firebase/firestore'

import { Drawer, Space, Button, Input, notification } from 'antd'

const EditClientDrawer = ({ dataSource, openClose, open, getData }) => {
    const db = getFirestore(firebaseApp)

    const [client, setClient] = useState()
    const [direction, setDirection] = useState()
    const [lat, setLat] = useState()
    const [lon, setLon] = useState()

    const handleClose = (bool) => {
        openClose(bool)
    }

    const handleUpdate = async () => {
        const docRef = doc(db, 'cliente', client)
        try{
            await updateDoc(docRef, {
                nombre: client,
                direccion: direction,
                localizacion: new GeoPoint(lat, lon)
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
        setClient(dataSource.name)
        setDirection(dataSource.direction)
        setLat(dataSource.location[0].slice(5, -1))
        setLon(dataSource.location[1].slice(6, -1))
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
                <h3>Nombre</h3>
                <Input value={client} onChange={e => setClient(e.target.value)} />
                <h3>Direccion</h3>
                <Input value={direction} onChange={e => setDirection(e.target.value)} />
                <h3>Localizacion</h3>
                <h3>Latitud</h3>
                <Input value={lat} onChange={e => setLat(e.target.value)} />
                <h3>Longitud</h3>
                <Input value={lon} onChange={e => setLon(e.target.value)} />
            </Drawer>
        </>
    )
}
 
export default EditClientDrawer