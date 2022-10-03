import { Paper } from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import * as React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { ProdukService } from '../../../utils/storage_service/produk_service';
import UsahaComponentList from '../UsahaComponentList';

export default function UsahaProduct() {
    // const [produkList, setProdukList] = useState([])
    const tblProduk = new ProdukService()
    const listProduk = useLiveQuery(
        () => tblProduk.getAll()
    );

    // const getProduks = async () => {
    //     let totalProduct =  await tblProduk.count()
    //     let today = new Date()

    //     console.log("totalProduct")
    //     console.log(totalProduct)
    //     if (totalProduct <= 0) {

    //         await tblProduk.add("Pecel",20000,"Pcs",['Nasi'], today, today)
    //         await tblProduk.add("Tempe",2000,"Pcs",['Gorengan', 'Cemilan'], today, today)
    //     }

    //     let listProduct = await tblProduk.getAll()
    //     console.log(listProduct)
    //     await setProdukList(listProduct)
    // }

    useEffect(() => {
        // Update the document title using the browser API
        // getProduks();
    }, []);
    return (
        <Paper>
            {listProduk && <UsahaComponentList title={"Produk"} rows={listProduk} columns={tblProduk.getColumnsGrid()}/>}
        </Paper>
    );
}
