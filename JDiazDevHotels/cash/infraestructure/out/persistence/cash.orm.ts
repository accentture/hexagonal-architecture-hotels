import { Service } from "typedi";
import { DataCash } from "../../../application/services/data-cash";
import { CashDatabaseEntity } from "./cash-database-entity";
import { CashRepository } from "./cash-repository";

@Service()
export class CashORM implements CashRepository {
    constructor() {

    }
    async createCash(hotelId: number, dataCash: DataCash): Promise<any> {
        try {
            const cash = new CashDatabaseEntity()
            cash.openingMoney = dataCash.openingMoney
            cash.date = dataCash.date
            cash.hotelId = hotelId
            console.log('--------------date in persistence', cash)
            await cash.save()

            return cash
        } catch (error) {
            console.log('------------', error)
        }
    }
    async getCash(cashId: number): Promise<any> {
        try {
            const cash = await CashDatabaseEntity.findByPk(cashId)
            return cash

        } catch (error) {
            console.log('------------', error)
        }
    }
}