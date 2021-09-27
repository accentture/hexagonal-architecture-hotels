import { Service } from 'typedi';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { Request, Response } from 'express';
import { CreateProductSaledRequest } from '../../../application/ports/in/create-product-saled.request';
import { CreateProductSaledService } from '../../../application/services/create-product-saled.service';
import { DataProductSaled } from '../../../application/services/product-saled-data';

import { UpdateAmountToProductsSaledService } from '../../../application/services/update-amount-to-products-saled.service';
import { UpdateAmountToProductSaledUseCase } from '../../../application/ports/in/update-amount-to-product-saled.request';
import { CompletePaymentProductSaledUseCase } from '../../../application/ports/in/complete-payment-product-saled-use-case';
import { CompletePaymentProductSaledService } from '../../../application/services/complete-product-saled-payment.service';
import { GetProductsSaledRequest } from '../../../application/ports/in/get-products-saled.request';
import { GetProductsSaledService } from '../../../application/services/get-products-saled.service';
import { AddMoneyToSaleReportService } from '../../../../../reports/sale-reports/application/services/add-money-to-sale-report.service';
import { AddMoneyToSaleReportUseCase } from './../../../../../reports/sale-reports/application/ports/in/add-money-to-sale-report-use-case';
import { AddMoneyToCashUseCase } from './../../../../../cash/application/ports/in/add-money-to-cash-use-case';
import { AddMoneyToCashService } from '../../../../../cash/application/services/add-money-to-cash.service';
import { AddMoneyToHoustingReportUseCase } from './../../../../../reports/housting-reports/application/ports/in/add-money-to-housting-report-use-case';
import { AddMoneyToHoustingReportService } from '../../../../../reports/housting-reports/application/services/add-money-to-housting-report.service';

@Service()
export class ProductSaledController {
    private createProductSaledRequest: CreateProductSaledRequest;
    private updateAmountToProductSaledUseCase: UpdateAmountToProductSaledUseCase;
    private completePaymentProductSaledUseCase: CompletePaymentProductSaledUseCase;
    private getProductsSaledRequest: GetProductsSaledRequest;

    //other domain
    private addMoneyToCashUseCase: AddMoneyToCashUseCase;
    private addMoneyToSaleReportUseCase: AddMoneyToSaleReportUseCase;
    private addMoneyToHoustingReportUseCase: AddMoneyToHoustingReportUseCase;

    constructor(
        createProductSaledService: CreateProductSaledService,
        updateAmountToProductsSaledService: UpdateAmountToProductsSaledService,
        completePaymentProductSaledService: CompletePaymentProductSaledService,
        getProductsSaledService: GetProductsSaledService,

        //other domains
        addMoneyToCashService: AddMoneyToCashService,
        addMoneyToHoustingReportService: AddMoneyToHoustingReportService,
        addMoneyToSaleReportService: AddMoneyToSaleReportService,
    ) {
        this.createProductSaledRequest = createProductSaledService;
        this.updateAmountToProductSaledUseCase = updateAmountToProductsSaledService;
        this.completePaymentProductSaledUseCase = completePaymentProductSaledService;
        this.getProductsSaledRequest = getProductsSaledService;

        //other domain
        this.addMoneyToCashUseCase = addMoneyToCashService;
        this.addMoneyToSaleReportUseCase = addMoneyToSaleReportService;
        this.addMoneyToHoustingReportUseCase = addMoneyToHoustingReportService;
    }
    createProductSaled = async (req: Request, res: Response) => {
        const { cashId, houstingId, productId } = req.params;
        const { amount, date, time, payed } = req.body;

        const _houstingId = parseInt(houstingId),
            _cashId = parseInt(cashId),
            productPayed = parseInt(payed) === 1 ? true : false;

        const dataProductSaled = new DataProductSaled(
            parseInt(amount),
            0, //total price
            date,
            time,
            productPayed,
        );

        const productSaled = await this.createProductSaledRequest.createTheProductSaled(
            _cashId,
            _houstingId,
            parseInt(productId),
            dataProductSaled,
        );

        if (productPayed) {
            this.addMoneyToSaleReportUseCase.addMoneyToSaleReport(_houstingId, productSaled.totalPrice);
            this.addMoneyToCashUseCase.addMoneyToCash(_cashId, productSaled.totalPrice);
            this.addMoneyToHoustingReportUseCase.addMoneyToHoustingReport(_houstingId, productSaled.totalPrice);
        }
        res.json(productSaled);
    };
    getProductsSaled = async (req: Request, res: Response) => {
        const { houstingId } = req.params;
        const productsSaled = await this.getProductsSaledRequest.getTheProductsSaled(parseInt(houstingId));
        res.json(productsSaled);
    };
    /* updateAmountProductSaled = async (req: Request, res: Response) => {
        const { productSaledId } = req.params;
        const { amount, payed } = req.body;

        const productSaled = await this.updateAmountToProductSaledUseCase.updateTheAmountToProductSaled(
            parseInt(productSaledId),
            parseInt(amount),
        );
        res.json(productSaled);
    }; */
    completeProductSaledPayment = async (req: Request, res: Response) => {
        const { houstingId, productSaledId, cashId } = req.params;

        const _houstingId = parseInt(houstingId);

        const productSaled = await this.completePaymentProductSaledUseCase.completePaymentProductSaled(
            parseInt(productSaledId),
        );
        console.log('----------------------productSaled', productSaled.totalPrice);
        this.addMoneyToSaleReportUseCase.addMoneyToSaleReport(_houstingId, productSaled.totalPrice);
        this.addMoneyToCashUseCase.addMoneyToCash(parseInt(cashId), productSaled.totalPrice);
        this.addMoneyToHoustingReportUseCase.addMoneyToHoustingReport(_houstingId, productSaled.totalPrice);

        res.json(productSaled);
    };
}
