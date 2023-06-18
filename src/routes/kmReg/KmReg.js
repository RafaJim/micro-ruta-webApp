// import './styles/kmReg.css'
import KmTable from './components/KmTable';
import dayjs from 'dayjs';
import { useState } from 'react';

import { Button, Input, Typography, notification, Col, Row, Card } from 'antd';

import firebaseApp from "../../firebase-config";
import { getFirestore, doc, setDoc, Timestamp, getDoc, updateDoc } from 'firebase/firestore';

const { Title } = Typography;
const db = getFirestore(firebaseApp);

const KmReg = () => {

    const [kmInit, setKmInit] = useState(0);
    const [kmFinal, setKmFinal] = useState(0);
    const [isAdmin] = useState(localStorage.getItem('UID'));

    const handleCheckData = () => {
        if (kmInit !== 0 && kmFinal !== 0) handleSetKm();
        if (kmInit === 0) handleSetFinalKm();
        if (kmFinal === 0) handleSetInitialKm();
    }

    const handleSetKm = async () => {
        const today = dayjs().format('DD-MM-YYYY');
        const docRef = doc(db, 'kilometraje', today);

        try{
            await setDoc(docRef, {
                kmInicial: parseInt(kmInit),
                kmFinal: parseInt(kmFinal),
                kmRecorrido: parseInt(kmFinal - kmInit),
                fechaInit: Timestamp.fromDate(new Date()),
                fechaFin: Timestamp.fromDate(new Date())
            })

            notification.success({
                message: `Registro de KMs agregado correctamente`
            })

        } catch(err) {
            notification.error({
                message: 'Error al agregar registro de KMs',
                description: `${err}`
            })
        }
        setKmInit(0);
        setKmFinal(0);
    }

    const handleSetInitialKm = async () => {
        if (kmInit === 0) return;
        const today = dayjs().format('DD-MM-YYYY');
        const docRef = doc(db, 'kilometraje', today);

        try{
            await setDoc(docRef, {
                kmInicial: parseInt(kmInit),
                kmFinal: parseInt(0),
                kmRecorrido: parseInt(0),
                fechaInit: Timestamp.fromDate(new Date()),
                fechaFin: null
            })

            notification.success({
                message: `Registro de KM inicial agregado correctamente`
            })

        } catch(err) {
            notification.error({
                message: 'Error al agregar registro de KM inicial',
                description: `${err}`
            })
        }

        setKmInit(0);
    }

    const handleSetFinalKm = async () => {
        if (kmFinal === 0) return;
        const today = dayjs().format('DD-MM-YYYY');
        const docRef = doc(db, 'kilometraje', today);

        try{
            const snapDoc = await getDoc(docRef);
            let { kmInicial } = snapDoc.data();

            await updateDoc(docRef, {
                kmFinal: parseInt(kmFinal),
                kmRecorrido: parseInt(kmFinal - kmInicial),
                fechaFin: Timestamp.fromDate(new Date())
            })

            notification.success({
                message: `Registro de KM final agregado correctamente`
            })

        } catch(err) {
            notification.error({
                message: 'Error al agregar registro de KM final',
                description: `No se puede agregar el km final sin antes registrar el inicial. O registre ambos.`
            })
        }

        setKmFinal(0);
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

                        <Button className='btnReg' type="primary" onClick={handleCheckData}>Registrar</Button>
                    </Card>
                </Col>
                <Col span={24} style={{ paddingTop: '2%' }}>
                    { isAdmin ? <KmTable /> : null }
                </Col>
            </Row>
        </>
    )
};
 
export default KmReg;
