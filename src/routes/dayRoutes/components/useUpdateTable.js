import { useState } from 'react'

import firebaseApp from "../../../firebase-config"
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { useEffect } from "react"

const db = getFirestore(firebaseApp)

const useUpdateTable = (day) => {

    const [clientsOrder, setClientsOrder] = useState([])

    const getClientsOrder = async() => {
        const colRef = collection(db, day)
        const docDay = await getDocs(colRef)
        let arrAux = []
        let clientsOrder = []

        try{
            docDay.docs.map((client) => {
                arrAux.push(
                    client.data()
                )
                return null
            })

            arrAux.map(item => {
                clientsOrder.push({
                    name: item.nombre,
                    order: item.ordenEntrega,
                    isDeliveryAvail: item.entregable
                })
                return null
            })
        } catch(err) {
            console.log(err)
        }

        clientsOrder.sort((a, b) => {
            let keyA = a.order
            let keyB = b.order

            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        })

        setClientsOrder(clientsOrder)
    }

    useEffect(() => {
        getClientsOrder()        
    }, [])

    return { getClientsOrder, clientsOrder }
}
 
export default useUpdateTable