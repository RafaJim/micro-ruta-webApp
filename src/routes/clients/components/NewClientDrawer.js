import { useState } from 'react'

import firebaseApp from "../../../firebase-config"
import { getFirestore, doc, GeoPoint, setDoc } from 'firebase/firestore'

import { Drawer, Space, Button, Input, notification, Divider, Col, Row } from 'antd'

const NewClientDrawer = ({ openClose, open, getData }) => {
    const db = getFirestore(firebaseApp)
    const [client, setClient] = useState("")
    const [direction, setDirection]= useState('')
    const [lat, setLat] = useState()
    const [lon, setLon] = useState()

    const handleClose = (bool) => {
        openClose(bool)
    }

    const handleAddClient = async () => {
        const docRef = doc(db, 'cliente', client)
        try{
            await setDoc(docRef, {
                nombre: client,
                direccion: direction,
                localizacion: new GeoPoint(lat, lon)
            })

            notification.success({
                message: `Nuevo cliente ${client} agregado correctamente`
            })

            getData()

        } catch(err) {
            notification.error({
                message: 'Error al agregar nuevo cliente',
                description: `${err}`
            })
        }
    }

    return (
        <>
            <Drawer 
                title="Agregar cliente"
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
                <h3>Nombre del cliente</h3>
                <Input value={client} onChange={e => setClient(e.target.value)} />
                <h3>Direccion</h3>
                <Input value={direction} onChange={e => setDirection(e.target.value)} />
                <Divider style={{ marginBottom: 1 }} />
                <h3>Localizacion</h3>
                <Row>
                    <Col span={12}><h3>Latitud</h3></Col>
                    <Col span={12}><h3>Longitud</h3></Col>
                </Row>
                <Row>
                    <Col span={12}><Input value={lat} onChange={e => setLat(e.target.value)} style={{ marginRight: '50px' }} /></Col>
                    <Col span={12}><Input value={lon} onChange={e => setLon(e.target.value)} /></Col>
                </Row>
            </Drawer>
        </>
    )
}
 
export default NewClientDrawer