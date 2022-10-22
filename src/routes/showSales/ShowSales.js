import { useEffect , useState } from "react"
import './styles/showSales.css'
import BalanceDay from './components/BalanceDay'

import { utils, writeFile } from 'xlsx'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { DataGrid } from '@mui/x-data-grid'
import TextField from "@mui/material/TextField"

import { notification, Col, Row, Typography, Card } from 'antd'
import {
    DownloadOutlined
  } from "@ant-design/icons"

import firebaseApp from "../../firebase-config"
import { getFirestore, doc, onSnapshot, getDoc } from 'firebase/firestore'

const { Title } = Typography;

const ShowSales = () => {
    let data = []
    const db = getFirestore(firebaseApp)

    const [sales, setSales] = useState(data)
    const [inventoryDay, setInventoryDay] = useState(data)
    const [fechaDoc, setFechaDoc] = useState(dayjs().format('DD-MM-YYYY'))
    const [error, setError] = useState(false)
    
    const getData = async () => {
        const docRef = doc(db, 'ventas', fechaDoc)
        dayjs.extend(localizedFormat)
        let obj = {}
        let arrAux = []
        let res = []
        let resInventory = []
        let id = 0

        if(fechaDoc === dayjs().format('DD-MM-YYYY')) {
            onSnapshot(docRef, (doc) => {
                obj = doc.data()
                try {
                    arrAux = Object.values(obj)
                } catch (err) {
                    setError(true)
                    notification.error({
                        message: "No se pudo obtener datos",
                        description: 'Esto debido a que no hay registros del dia de hoy'
                    })
                    return
                }
                setError(false)
                
                res = []
                resInventory = []

                arrAux.map((item) => {
                    res.push({
                        id: id,
                        cliente: item.cliente,
                        fecha: dayjs.unix(item.fecha.seconds).format('lll'),
                        frijolesEntrega: item.frijolesEntrega,
                        frijolesDevolucion: item.frijolesDevolucion,
                        frijolesEloteEntrega: item.frijolesEloteEntrega,
                        frijolesEloteDevolucion: item.frijolesEloteDevolucion,
                        totalFrijol: item.totalFrijol,
                        totalFrijolElote: item.totalFrijolElote,
                        total: item.total,
                        efectivoRecibido: item.efectivoRecibido,
                        cambio: item.cambio
                    })

                    resInventory.push({
                        id: id,
                        cliente: item.cliente,
                        lunes: item.inventarioDia['lunes'],
                        martes: item.inventarioDia['martes'],
                        miercoles: item.inventarioDia['miercoles'],
                        jueves: item.inventarioDia['jueves'],
                        viernes: item.inventarioDia['viernes']
                    })

                    id++
                    return null
                })
                setSales(res)
                setInventoryDay(resInventory)
            })
        } else {
           await getDoc(docRef)
            .then((snapshot) => {
                obj = snapshot.data()
                arrAux = Object.values(obj)
                setError(false)

                arrAux.map((item) => {
                    res.push({
                        id: id,
                        cliente: item.cliente,
                        fecha: dayjs.unix(item.fecha.seconds).format('lll'),
                        frijolesEntrega: item.frijoles,
                        frijolesDevolucion: item.frijolesDevolucion,
                        frijolesEloteEntrega: item.frijolesEloteEntrega,
                        frijolesEloteDevolucion: item.frijolesEloteDevolucion,
                        totalFrijol: item.totalFrijol,
                        totalFrijolElote: item.totalFrijolElote,
                        total: item.total,
                        efectivoRecibido: item.efectivoRecibido,
                        cambio: item.cambio
                    })

                    resInventory.push({
                        id: id,
                        cliente: item.cliente,
                        lunes: item.inventarioDia['lunes'],
                        martes: item.inventarioDia['martes'],
                        miercoles: item.inventarioDia['miercoles'],
                        jueves: item.inventarioDia['jueves'],
                        viernes: item.inventarioDia['viernes']
                    })

                    id++
                    return null
                })
                setSales(res)
                setInventoryDay(resInventory)
            })
            .catch(err => {
                setSales({})
                setInventoryDay({})
                setError(true)
                notification.error({
                    message: 'Error al obtener informacion',
                    description: `No existen datos para la fecha ${fechaDoc}`
                })
            })
        }
    }

    const handleDateChange = (date) => {
        setError(false)
        setFechaDoc(dayjs(date).format('DD-MM-YYYY'))
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

    const columns = [
        { field: 'cliente', headerName: 'Cliente', width: 120, headerAlign: 'center' },
        { field: 'fecha', headerName: 'Fecha venta', width: 180, headerAlign: 'center' },
        { field: 'frijolesEntrega', headerName: 'Frijoles', width: 70, headerAlign: 'center' },
        { field: 'frijolesDevolucion', headerName: 'Frijoles devueltos', width: 130, headerAlign: 'center' },
        { field: 'frijolesEloteEntrega', headerName: 'Frijoles con elote', width: 130, headerAlign: 'center' },
        { field: 'frijolesEloteDevolucion', headerName: 'Frijoles con elote devueltos', width: 190, headerAlign: 'center' },
        { field: 'totalFrijol', headerName: 'Total frijol', width: 80, headerAlign: 'center' },
        { field: 'totalFrijolElote', headerName: 'Total frijol con elote', width: 150, headerAlign: 'center' },
        { field: 'total', headerName: 'Total de la venta', width: 120, headerAlign: 'center' },
        { field: 'efectivoRecibido', headerName: 'Efectivo recibido', width: 120, headerAlign: 'center' },
        { field: 'cambio', headerName: 'Cambio', width: 70, headerAlign: 'center' },
    ]

    const columnsInventory = [
        { field: 'cliente', headerName: 'Cliente', width: 120, headerAlign: 'center' },
        { field: 'lunes', headerName: 'Lunes', width: 90, headerAlign: 'center' },
        { field: 'martes', headerName: 'Martes', width: 90, headerAlign: 'center' },
        { field: 'miercoles', headerName: 'Miercoles', width: 90, headerAlign: 'center' },
        { field: 'jueves', headerName: 'Jueves', width: 90, headerAlign: 'center' },
        { field: 'viernes', headerName: 'Viernes', width: 90, headerAlign: 'center' },
    ]

    const titleContent = (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <TextField 
                type='date' 
                label="Fecha" 
                variant="standard" 
                defaultValue={dayjs().format('YYYY-MM-DD')} 
                onChange={ e => handleDateChange(e.target.value) } 
                sx={{ input:{ color: '#fff' } }} 
            />
            <DownloadOutlined onClick={() => handleExport('Frijoles_', sales)} style={{ fontSize: 30, color: '#fff' }}/>
        </div>
    )

    useEffect(() => {
        getData()
        setError(false)
    }, [fechaDoc])
    
    return (
        <>
            <Title>Ventas del dia</Title>
            <Row>
                <Col span={24} >
                    <Card
                        title = {titleContent}
                        bordered='true'
                        headStyle={{ backgroundColor: '#383c44', color: '#fff', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                    >
                        <DataGrid
                            rows={sales}
                            columns={columns}
                            pageSize={7}
                            rowsPerPageOptions={[7]}
                            disableSelectionOnClick
                            autoHeight={true}
                            sx={{ '& .MuiDataGrid-cell--textCenter': { align:"center" } }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row style={{ justifyContent: 'space-between' }}>
                <Col md={11} style={{ marginTop: '1.5%', marginBottom: '1.5%' }}>
                    <Card
                        title="Inventario de etiquetas"
                        bordered='true'
                        headStyle={{ backgroundColor: '#383c44', color: '#fff', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                        extra={<DownloadOutlined onClick={() => handleExport('Inventario_', inventoryDay)} style={{ fontSize: 30, color: '#fff' }} />}
                    >
                        <DataGrid
                            rows={inventoryDay}
                            columns={columnsInventory}
                            pageSize={7}
                            rowsPerPageOptions={[7]}
                            disableSelectionOnClick
                            autoHeight={true}
                            // sx={{ '& .MuiDataGrid-cell--textCenter': { align:"center" } }}
                        />
                    </Card>
                </Col>

                <Col md={11} style={{ marginTop: '1.5%', marginBottom: '1.5%' }}>
                    <BalanceDay fechaDoc={fechaDoc} error={error} />
                </Col>
            </Row>
        </>
    )
}
 
export default ShowSales;