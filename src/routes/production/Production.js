import { useState, useEffect } from 'react'
import './styles/production.css'
import  ProductionTable from './components/ProductionTable'
import dayjs from 'dayjs'

import { Input, Typography, Button } from 'antd'

import firebaseApp from "../../firebase-config"
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore'

const db = getFirestore(firebaseApp)
const {Title} = Typography

const Production = () => {

    const [frijol, setFrijol] = useState(0)
    const [frijolElote, setFrijolElote] = useState(0)
    const [total, setTotal] = useState(0)
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin'))

    const handleInsertProduction = async () => {
        const date = dayjs().format('DD-MM-YYYY')
        const docRef = doc(db, 'produccion', date)

        setDoc(docRef, {
            frijol,
            frijolElote,
            total,
            fecha: Timestamp.fromDate(new Date())
        })
    }

    const calculateTotal = () => {
        if(frijol === '') setFrijol(0)
        if(frijolElote === '') setFrijolElote(0)

        setTotal(parseInt(frijol)+parseInt(frijolElote))
    }

    useEffect(() => {
        calculateTotal()
        
    }, [frijol, frijolElote])

    return (
        <>
            <Title>Produccion</Title>

            <div className='productionContainer'>
                
                <div className='insertProduction'>

                    <h4>Frijoles sin elote: </h4>
                    <Input onChange={e => setFrijol(e.target.value)}/>

                    <h4>Frijoles sin elote:</h4>
                    <Input onChange={e => setFrijolElote(e.target.value)}/>

                    <h4>Total de botes para ruta: {total}</h4>

                    <Button type="primary" onClick={handleInsertProduction}>Registrar</Button>
                </div>

                { isAdmin && <ProductionTable />}

            </div>
        
        </>
    )
}
 
export default Production;