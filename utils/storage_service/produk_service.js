import { columnTable } from "../../components/Usaha/UsahaComponentList/DataFunction";
import TypeVariable from "../../components/Usaha/UsahaComponentList/TypeVariable";
import {
    BaseService
} from "./base_service";

export class ProdukService extends BaseService {
    constructor() {
        super();
    }

    getColumnsGrid() {
        return [
            columnTable(TypeVariable.Numeric, 'Id', 'id', {}),
            columnTable(TypeVariable.Text, 'Nama Makanan', 'name', {}),
            columnTable(TypeVariable.Numeric, 'Harga', 'price', {}),
            columnTable(TypeVariable.Text, 'Satuan', 'satuan', {})
        ];
    }

    async getAll() {
        return await this.connection.produk.toArray();
    }

    async add(name, price, satuan, category, created_date, updated_date) {
        // return the Id
        return await this.connection.produk.add({
            name, price, satuan, category, created_date, updated_date
        }); 
    }

    async count() {
        return await this.connection.produk.count()
    }
}