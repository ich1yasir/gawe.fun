
import {
    dbCon
} from "./db_services";
export class BaseService {

    get connection() {
        return dbCon;
    }
}