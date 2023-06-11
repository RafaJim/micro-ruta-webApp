import { useState, useEffect, useId } from 'react';
import { utils, writeFile } from 'xlsx';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Table, notification, Card } from 'antd';
import { DownloadOutlined } from "@ant-design/icons";

import { TextField } from '@mui/material';

import firebaseApp from "../../../firebase-config";
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore(firebaseApp);

const ProductionTable = () => {

    const [date, setDate] = useState(dayjs().format('DD-MM-YYYY'));
    const [production, setProduction] = useState([]);
    const [error, setError] = useState(false);
    const fakeId = useId();

    const getData = async () => {
        dayjs.extend(localizedFormat);
        const docRef = doc(db, 'produccion', date);
        let obj = {};

        try{
            const snapDoc = await getDoc(docRef);
            setError(false);
            obj = snapDoc.data();
            obj.fechaStock = dayjs.unix(obj.fechaStock.seconds).format('lll');
            obj.key = fakeId;
            setProduction([obj]);

        } catch(err) {
            setError(true);
            setProduction([{}]);
            notification.error({
                message: 'Error al obtener informacion',
                description: `No existen datos para la fecha ${date}`
            });
            return;
        }
    }

    const handleDateChange = (date) => {
        setError(false);
        setDate(dayjs(date).format('DD-MM-YYYY'));
    }

    const handleExport = () => {
        if(error) {
            notification.error({
                message: 'Error al exportar',
                description: 'No se puede exportar datos de una fecha no existente'
            });
            
            return;
        } 

        const wb = utils.book_new();
        const ws = utils.json_to_sheet(production);
        utils.book_append_sheet(wb, ws, date);
        writeFile(wb, "Produccion_" + date + ".xlsx");
    }

    const columns = [
        { title: 'Fecha', dataIndex: 'fechaStock', key: 'fechaStock' },
        { title: 'Stock inicial frijol', dataIndex: 'stockInicialFrijol', key: 'stockInicialFrijol' },
        { title: 'Stock frijol', dataIndex: 'stockFrijol', key: 'stockFrijol' },
        { title: 'Entregas frijol', dataIndex: 'entregasFrijol', key: 'entregasFrijol' },
        { title: 'Devoluciones frijol', dataIndex: 'devolucionesFrijol', key: 'devolucionesFrijol' },
        { title: 'Stock inicial frijol c/Elote', dataIndex: 'stockInicialFrijolElote', key: 'stockInicialFrijolElote' },
        { title: 'Stock frijol c/Elote', dataIndex: 'stockFrijolElote', key: 'stockFrijolElote' },
        { title: 'Entregas frijol c/Elote', dataIndex: 'entregasFrijolElote', key: 'entregasFrijolElote' },
        { title: 'Devoluciones frijol c/Elote', dataIndex: 'devolucionesFrijolElote', key: 'devolucionesFrijolElote' },
    ]

    const titleContent = (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <TextField
                type="date"
                label="Fecha"
                variant="standard" 
                onChange={e => handleDateChange(e.target.value)} 
                defaultValue={dayjs().format('YYYY-MM-DD')} 
                sx={{ input:{ color: '#fff' } }}
            />
            <DownloadOutlined onClick={handleExport} style={{ fontSize: 30, color: '#fff' }} />
        </div>
    )

    useEffect(() => {
        getData();
        setError(false);
    }, [date])

    return (
        <>
            <Card
                title = {titleContent}
                bordered='true'
                headStyle={{ backgroundColor: '#383c44', color: '#fff', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
            >
                <Table
                    columns={columns}
                    dataSource={production}
                    pagination={false}
                    scroll={{ x: 1 }}
                    bordered
                />
            </Card>
        </>
    )
}
 
export default ProductionTable