import { useState, useEffect, useId } from 'react';
import { Card, notification } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { DataGrid } from '@mui/x-data-grid';
import { utils, writeFile } from 'xlsx';

const BalanceDayDiffPrice = ({ data, fechaDoc, error }) => {

    const [sales, setSales] = useState([]);
    const [diffSales, setDiffSales] = useState([]);

    const id = useId();

    const handleExport = (docName, docContent) => {
        if(error) {
            notification.error({
                message: 'Error al exportar',
                description: 'No se puede exportar datos de una fecha no existente'
            })
            
            return;
        } 

        const wb = utils.book_new();
        const ws = utils.json_to_sheet(docContent);
        utils.book_append_sheet(wb, ws, fechaDoc);
        writeFile(wb, docName + fechaDoc + ".xlsx");
    }

    const columnsBalance = [
        { field: 'totalFrijol', headerName: 'Total Frijol ($)', width: 120, headerAlign: 'center' },
        { field: 'totalFrijolElote', headerName: 'Total Frijol con elote ($)', width: 170, headerAlign: 'center' },
        { field: 'total', headerName: 'Total vendido ($)', width: 150, headerAlign: 'center' }
    ]

    const extra = (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <DownloadOutlined onClick={() => handleExport('Corte Diferente Precio_', diffSales)} style={{ fontSize: 30, color: '#fff' }}/>
        </div>
    )

    const handleMoney = () => {
        const diffMoney = sales.filter(diff => diff.isModify === true);

        // diffMoney.push({
        //     id: 243,
        //     comentario: 'adsasdasd',
        //     cliente: 'prueba tuzania 2',
        //     fecha: '23/05/2023',
        //     hora: '20:50:49',
        //     frijolesEntrega: 0,
        //     frijolesDevolucion: 0,
        //     frijolesEloteEntrega: 0,
        //     frijolesEloteDevolucion: 0,
        //     totalFrijol: 22,
        //     totalFrijolElote: 22,
        //     total: 44,
        //     efectivoRecibido: 0,
        //     cambio: 0,
        //     isModify: true
        // })

        const total = diffMoney.reduce((acum, obj) => acum + obj.total, 0);
        const totalFrijol = diffMoney.reduce((acum, obj) => acum + obj.totalFrijol, 0);
        const totalFrijolElote = diffMoney.reduce((acum, obj) => acum + obj.totalFrijolElote, 0);

        setDiffSales([{ id, totalFrijol, totalFrijolElote, total }]);
    }

    useEffect(() => {
        setSales(data);
    }, [data]);

    useEffect(() => {
        handleMoney();
    }, [sales]);

    return (
        <>
            <Card
                title="Corte del dia a diferente precio"
                bordered='true'
                headStyle={{ backgroundColor: '#383c44', color: '#fff', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                extra={extra}
            >
                <DataGrid
                    rows={diffSales}
                    columns={columnsBalance}
                    pageSize={7}
                    rowsPerPageOptions={[7]}
                    disableSelectionOnClick
                    autoHeight={true}
                    sx={{ '& .MuiDataGrid-cell--textCenter': { align:"center" } }}
                />
            </Card>
        </>
    );
}
 
export default BalanceDayDiffPrice;
