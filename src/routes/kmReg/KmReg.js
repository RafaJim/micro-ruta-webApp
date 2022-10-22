// import './styles/kmReg.css'
import KmTable from './components/KmTable'
import dayjs from 'dayjs'
import { useState } from 'react'

import { Button, Input, Typography, notification, Col, Row, Card } from 'antd'

import firebaseApp from "../../firebase-config"
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore'

const { Title } = Typography
const db = getFirestore(firebaseApp)

const KmReg = () => {

    const [kmInit, setKmInit] = useState()
    const [kmFinal, setKmFinal] = useState()
    const [isAdmin] = useState(localStorage.getItem('UID'))

    const handleSetKms = async() => {
        const today = dayjs().format('DD-MM-YYYY')
        const docRef = doc(db, 'kilometraje', today)

        try{
            await setDoc(docRef, {
                kmInicial: kmInit,
                kmFinal: kmFinal,
                kmRecorrido: (kmFinal - kmInit),
                fecha: Timestamp.fromDate(new Date())
            })

            notification.success({
                message: `Registro de KM agregado correctamente`
            })

        } catch(err) {
            notification.error({
                message: 'Error al agregar registro de KM',
                description: `${err}`
            })
        }
    }

    return (
        <>
            <Title>Registro de kilometraje</Title>

            <Row>
                <Col md={6} span={24}>
                    <Card
                        title = 'Agregar datos de kilometraje'
                        bordered='true'
                        headStyle={{ backgroundColor: '#383c44', color: '#fff', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                    >
                        <h4>Kilometraje inicial:</h4>
                        <Input onChange={e => setKmInit(e.target.value)}/>

                        <h4>Kilometraje final:</h4>
                        <Input onChange={e => setKmFinal(e.target.value)}/>

                        <Button className='btnReg' type="primary" onClick={handleSetKms}>Registrar</Button>
                    </Card>
                </Col>
                <Col span={24} style={{ paddingTop: '2%' }}>
                    { isAdmin && <KmTable />}
                </Col>
            </Row>
        </>
    )
}
 
export default KmReg