import { useEffect, useState } from "react"
import useUpdateTable from "../components/useUpdateTable"
import ClientsList from '../components/ClientsList'
import OrderRouteTable from '../components/OrderRouteTable'

import { Typography, Col, Row } from "antd"

import firebaseApp from "../../../firebase-config"
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const db = getFirestore(firebaseApp)
const {Title} = Typography

const Monday = () => {

    const [clientsList, setClientsList] = useState([])

    const { getClientsOrder, clientsOrder } = useUpdateTable('Lunes')

    const getClients = async () => {
        const colRef = collection(db, 'cliente')
        let arrAux = []
        let id = 0
        let client = []
        let clientCompare = []

        const clients = await getDocs(colRef)
        try{
            clients.docs.map((client) => {
                arrAux.push(
                    client.data()
                )
            })
        } catch(err) {
            console.log(err)
        }

        arrAux.map((item) => {
            client.push({
                key: id,
                nombre: item.nombre,
                direction: item.direccion,
                lat: item.localizacion.latitude,
                longitud: item.localizacion.longitude,
                entregable: false,
                ordenEntrega: -1,
                Estatus: "NC",
                checked: false
            })
            id++
        })

        arrAux.map(item => {
            clientCompare.push({
                name: item.nombre,
                checked: false
            })
        })
        
        setClientsList(client)
    }
    
    useEffect(() => {
        getClients()
    }, [])

    return (
        <>
            <Title>Lunes</Title>

            <Row style={{ justifyContent: 'space-between' }}>
                <Col md={11}>
                    <ClientsList updateTable={getClientsOrder} day={'Lunes'} clientsList={clientsList} />
                </Col>
                <Col md={11}>
                    <OrderRouteTable updateTable={getClientsOrder} day={'Lunes'} dataSource={clientsOrder} />
                </Col>
            </Row>
        </>
    )
}
 
export default Monday