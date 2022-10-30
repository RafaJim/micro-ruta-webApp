import { useState, useEffect } from 'react'
// import './styles/production.css'
import  ProductionTable from './components/ProductionTable'
import dayjs from 'dayjs'

import { Input, Typography, Button, Col, Row, Card, notification } from 'antd'

import firebaseApp from "../../firebase-config"
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore'

const db = getFirestore(firebaseApp)
const {Title} = Typography

const Production = () => {

    const [stockInicialFrijol, setStockInicialFrijol] = useState(0)
    const [stockInicialFrijolElote, setStockInicialFrijolElote] = useState(0)
    const [isAdmin] = useState(localStorage.getItem('UID'))

    const handleInsertProduction = async () => {
        const date = dayjs().format('DD-MM-YYYY')
        const docRef = doc(db, 'produccion', date)

        try {
            await setDoc(docRef, {
                fechaStock: Timestamp.fromDate(new Date()),
                stockInicialFrijol: parseInt(stockInicialFrijol),
                stockFrijol: parseInt(stockInicialFrijol),
                entregasFrijol: 0,
                devolucionesFrijol: 0,
                stockInicialFrijolElote: parseInt(stockInicialFrijolElote),
                stockFrijolElote: parseInt(stockInicialFrijolElote),
                entregasFrijolElote: 0,
                devolucionesFrijolElote: 0
            })

            notification.success({
                message: `Registro de produccion agregado correctamente`
            })
        } catch (err) {
            notification.error({
                message: 'Error al agregar registro de produccion',
                description: `${err}`
            })
        }
    }

    return (
        <>
            <Title>Produccion</Title>

            <Row>
                <Col md={6} span={24}>
                    <Card
                        title = 'Agregar datos de produccion'
                        bordered='true'
                        headStyle={{ backgroundColor: '#383c44', color: '#fff', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                    >
                        <h4>Frijoles: </h4>
                        <Input onChange={e => setStockInicialFrijol(e.target.value)}/>

                        <h4>Frijoles con elote:</h4>
                        <Input onChange={e => setStockInicialFrijolElote(e.target.value)}/>

                        <Button type="primary" onClick={handleInsertProduction}>Registrar</Button>
                    </Card>
                </Col>
                <Col span={24} style={{ paddingTop: '2%' }}>
                    { isAdmin && <ProductionTable />}
                </Col>
            </Row>        
        </>
    )
}
 
export default Production;