import { useEffect , useState } from "react"
import './styles/showSales.css'
import { utils, writeFile } from 'xlsx'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { DataGrid } from '@mui/x-data-grid'
import TextField from "@mui/material/TextField"
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import { notification, Col, Row, Typography } from 'antd'
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
    const [fechaDoc, setFechaDoc] = useState(dayjs().format('DD-MM-YYYY'))
    const [error, setError] = useState(false)
    
    const getData = async () => {
        const docRef = doc(db, 'ventas', fechaDoc)
        dayjs.extend(localizedFormat)
        let obj = {}
        let arrAux = []
        let res = []
        let id = 0

        if(fechaDoc === dayjs().format('DD-MM-YYYY')) {
            await onSnapshot(docRef, (doc) => {
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
                        cambio: item.cambio,
                    })
                    id++
                    return null
                })
                setSales(res)
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
                        cambio: item.cambio,
                    })
                    id++
                    return null
                })
                setSales(res)
            })
            .catch(err => {
                setSales({})
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

    const handleExport = () => {
        if(error) {
            notification.error({
                message: 'Error al exportar',
                description: 'No se puede exportar datos de una fecha no existente'
            })
            
            return
        } 

        const wb = utils.book_new()
        const ws = utils.json_to_sheet(sales)
        utils.book_append_sheet(wb, ws, fechaDoc)
        writeFile(wb, "Frijoles_" + fechaDoc + ".xlsx")
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

    useEffect(() => {
        getData()
        setError(false)
    }, [fechaDoc])
    
    return (
        <>
        <Title>Ventas del dia</Title>
            <Container style={{ width: '100%', borderRadius: '15px' }}>
            
                <Row justify="space-between" style={{ padding: 10, borderTopLeftRadius: '10px', borderTopRightRadius: '10px', backgroundColor: '#383c44' }}>
                    <Col>
                        <TextField 
                            type='date' 
                            label="Fecha" 
                            variant="standard" 
                            defaultValue={dayjs().format('YYYY-MM-DD')} 
                            onChange={ e => handleDateChange(e.target.value) } 
                            sx={{ input:{ color: '#fff' } }} />
                    </Col>
                    <Col>
                        <DownloadOutlined onClick={handleExport} style={{ fontSize: 30, color: '#fff' }} />
                    </Col>
                </Row>

            <Box sx={{ display: 'flex', borderStyle: 'groove', backgroundColor: '#fff' }}>
                <Grid container >
                    <Grid item xs={12}>
                        <DataGrid
                            rows={sales}
                            columns={columns}
                            pageSize={7}
                            rowsPerPageOptions={[7]}
                            disableSelectionOnClick
                            autoHeight={true}
                            sx={{ '& .MuiDataGrid-cell--textCenter': { align:"center" } }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Container>
        </>
    )
}
 
export default ShowSales;