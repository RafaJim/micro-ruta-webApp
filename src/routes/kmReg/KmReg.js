import './styles/kmReg.css'
import dayjs from 'dayjs'
import { useState } from 'react'

import { Button, Input, Typography, notification } from 'antd'

import firebaseApp from "../../firebase-config"
import { getFirestore, doc, setDoc, Timestamp, getDoc } from 'firebase/firestore'

const { Title } = Typography
const db = getFirestore(firebaseApp)

const KmReg = () => {

    const [kmInit, setKmInit] = useState()
    const [kmFinal, setKmFinal] = useState()

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

    const test = async() => {
        try {
            const docRef2 = doc(db, 'ordenEntregas', 'jueves')
            const docSnap = await getDoc(docRef2)
            console.log(docSnap.data())
        } catch(err) {
    
        }
    }

    test()


    return (
        <>
            <Title>Registro de kilometraje</Title>
            <div className='kmReg'>
                <h4>Kilometraje inicial:</h4>
                <Input onChange={e => setKmInit(e.target.value)}/>

                <h4>Kilometraje final:</h4>
                <Input onChange={e => setKmFinal(e.target.value)}/>

                <Button className='btnReg' type="primary" onClick={handleSetKms}>Registrar</Button>
            </div>
        </>
    )
}
 
export default KmReg