import { useEffect, useState } from "react"

import { Switch, Descriptions, Card } from "antd"

import firebaseApp from "../../../firebase-config"
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'

const db = getFirestore(firebaseApp)

const ClientsList = ({updateTable, day, clientsList}) => {

    const [clientCheck, setClientCheck] = useState()

    const checkTodayRoute = async () => {
        let arrAux = []
        let clientsInDay = []
        let _clients = []
        const colRefDay = collection(db, day)
        const docDay = await getDocs(colRefDay)
        
        try{
            docDay.docs.map((client) => {
                arrAux.push(
                    client.data()
                )
            })
            arrAux.map(item => {
                clientsInDay.push(item.nombre)
            })
        } catch(err) {
            console.log(err)
        }
        
        clientsList.map(client => {
            _clients.push(client.nombre)
        }) 
        
        for(let i=0;i<clientsInDay.length;i++) {
            for(let j=0;j<_clients.length;j++) {
                if(clientsInDay[i] === _clients[j]) {
                    clientsList[j].checked = true
                }
            }
        }
        setClientCheck(clientsList)
    }

    const onChangeSwitch = async (checked, client) => {
        if(checked) {
            const docRef = doc(db, day, client)
            const docu = clientsList.filter(item => item.nombre === client)
            delete docu[0].key
            delete docu[0].checked
            await setDoc(docRef, docu[0])
            
        } else {
            const docRef = doc(db, day, client)
            await deleteDoc(docRef)
        }
        checkTodayRoute()
        updateTable()
    }

    useEffect(() => {
        checkTodayRoute()
    }, [clientsList])

    return (
        <>
            <Card 
                title="Clientes por agregar o quitar"
                bordered='true'
                headStyle={{ backgroundColor: '#383c44', color: '#fff', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
            >
                <Descriptions bordered size='small' column={2}>
                    {clientCheck?.map(client => {
                        return(
                            <Descriptions.Item key={client.key} label={client.nombre} span={2}>
                                <Switch defaultChecked={client.checked} onChange={(checked) => onChangeSwitch(checked, client.nombre)}/>
                            </Descriptions.Item>
                        )
                    })}
                </Descriptions>
            </Card>
        </>
    )
}
 
export default ClientsList