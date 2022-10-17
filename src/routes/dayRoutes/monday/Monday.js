import { useEffect, useState } from "react"
import useUpdateTable from "../components/useUpdateTable"
import ClientsList from '../components/ClientsList'
import OrderRouteTable from '../components/OrderRouteTable'

import { Typography } from "antd"

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

            <div style={{ display: 'flex', alignContent: 'space-between', justifyContent: 'center' }}>
                <ClientsList updateTable={getClientsOrder} day={'Lunes'} clientsList={clientsList} />
                <OrderRouteTable updateTable={getClientsOrder} day={'Lunes'} dataSource={clientsOrder} />
            </div>
        </>
    )
}
 
export default Monday