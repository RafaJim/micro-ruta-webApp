import { useEffect , useState } from "react"

import { DataGrid } from '@mui/x-data-grid';
import dayjs from "dayjs"
import { utils, writeFile } from 'xlsx'

import { Card, notification } from 'antd'
import { DownloadOutlined } from '@ant-design/icons';

import firebaseApp from "../../../firebase-config"
import { getFirestore, doc, onSnapshot, getDoc } from 'firebase/firestore'

const db = getFirestore(firebaseApp)

const BalanceDay = ({fechaDoc, error}) => {

    const [balanceDay, setBalanceDay] = useState([])

    const getData = async() => {
        const docRef = doc(db, 'Corte', fechaDoc)
        let obj = {}
        let res = []
        let id = 0

        if(fechaDoc === dayjs().format('DD-MM-YYYY')) {
            onSnapshot(docRef, (doc) => {
                try {
                    obj = doc.data()
                    res = []
                    res.push({
                        id: id,
                        totalVendidoFrijol: obj.totalVendidoFrijol,
                        totalVendidoFrijolElote: obj.totalVendidoFrijolElote,
                        totalVendido: obj.totalVendido
                    })
                } catch (err) {
                    return
                }
                setBalanceDay(res)
            })
        } else {
            try {
                const docBalance = await getDoc(docRef)
                obj = docBalance.data()
                
                res.push({
                    id: id,
                    totalVendidoFrijol: obj.totalVendidoFrijol,
                    totalVendidoFrijolElote: obj.totalVendidoFrijolElote,
                    totalVendido: obj.totalVendido
                })
            } catch(err) {
                console.log(err)
            }
            setBalanceDay(res)
        }
    }

    const handleExport = (docName, docContent) => {
        if(error) {
            notification.error({
                message: 'Error al exportar',
                description: 'No se puede exportar datos de una fecha no existente'
            })
            
            return
        } 

        const wb = utils.book_new()
        const ws = utils.json_to_sheet(docContent)
        utils.book_append_sheet(wb, ws, fechaDoc)
        writeFile(wb, docName + fechaDoc + ".xlsx")
    }

    const columnsBalance = [
        { field: 'totalVendidoFrijol', headerName: 'Total Frijol ($)', width: 120, headerAlign: 'center' },
        { field: 'totalVendidoFrijolElote', headerName: 'Total Frijol con elote ($)', width: 170, headerAlign: 'center' },
        { field: 'totalVendido', headerName: 'Total vendido ($)', width: 150, headerAlign: 'center' }
    ]

    const extra = (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <DownloadOutlined onClick={() => handleExport('Corte_', balanceDay)} style={{ fontSize: 30, color: '#fff' }}/>
        </div>
    )
        
    useEffect(() => {
        getData()
    }, [fechaDoc])

    return (
        <>
            <Card
                title="Corte del dia"
                bordered='true'
                headStyle={{ backgroundColor: '#383c44', color: '#fff', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                extra={extra}
            >
                <DataGrid
                    rows={balanceDay}
                    columns={columnsBalance}
                    pageSize={7}
                    rowsPerPageOptions={[7]}
                    disableSelectionOnClick
                    autoHeight={true}
                    sx={{ '& .MuiDataGrid-cell--textCenter': { align:"center" } }}
                />
            </Card>
        </>
    )
}
 
export default BalanceDay