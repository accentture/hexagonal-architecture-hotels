import { Service } from 'typedi';
import { Request, Response } from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { CreateHoustingService } from '../../../application/services/create-housting.service';
import { CreateHoustingRequest } from '../../../application/ports/in/create-housting.request';
import { DataHousting } from '../../../application/services/data-housting';
import { GetHoustingRequest } from '../../../application/ports/in/get-housting-request';
import { GetHoustingService } from '../../../application/services/get-housting.service';
import { HoustingCommand } from '../../../application/ports/in/housting.command';
import { UpdateMoneyPaidService } from '../../../application/services/update-money-paid.service';
import { UpdateMoneyPaidUseCase } from '../../../application/ports/in/update-money-paid-use-case';
import { FinishHoustingUseCase } from '../../../application/ports/in/finish-housting';
import { FinishHoustingService } from '../../../application/services/finish-housting.service';
import { AddMoneyToCashUseCase } from './../../../../cash/application/ports/in/add-money-to-cash-use-case';
import { AddMoneyToCashService } from '../../../../cash/application/services/add-money-to-cash.service';
import { CreateHoustingReportService } from '../../../../reports/housting-reports/application/services/create-housting-report.service';
import { CreateHoustingReportRequest } from './../../../../reports/housting-reports/application/ports/in/create-housting-report.request';
import { AddMoneyToHoustingReportUseCase } from './../../../../reports/housting-reports/application/ports/in/add-money-to-housting-report-use-case';
import { AddMoneyToHoustingReportService } from '../../../../reports/housting-reports/application/services/add-money-to-housting-report.service';

dayjs.extend(utc);

@Service()
export class HoustingController {
    private createHoustingRequest: CreateHoustingRequest;
    private getHoustingRequest: GetHoustingRequest;
    private updateMoneyPaidUseCase: UpdateMoneyPaidUseCase;
    private finishHoustingUseCase: FinishHoustingUseCase;

    //other domains
    private addMoneyToCashUseCase: AddMoneyToCashUseCase;
    private createHoustingReportRequest: CreateHoustingReportRequest;
    private addMoneyToHoustingReportUseCase: AddMoneyToHoustingReportUseCase;

    constructor(
        createHoustingService: CreateHoustingService,
        getHoustingService: GetHoustingService,
        updateMoneyPaidService: UpdateMoneyPaidService,
        finishHoustingService: FinishHoustingService,

        //other domains
        addMoneyToCashService: AddMoneyToCashService,
        createHoustingReportService: CreateHoustingReportService,
        addMoneyToHoustingReportService: AddMoneyToHoustingReportService,
    ) {
        this.createHoustingRequest = createHoustingService;
        this.getHoustingRequest = getHoustingService;
        this.updateMoneyPaidUseCase = updateMoneyPaidService;
        this.finishHoustingUseCase = finishHoustingService;

        //other domains
        this.addMoneyToCashUseCase = addMoneyToCashService;
        this.createHoustingReportRequest = createHoustingReportService;
        this.addMoneyToHoustingReportUseCase = addMoneyToHoustingReportService;
    }
    createHousting = async (req: Request, res: Response) => {
        const { cashId, clientId, roomId } = req.params;
        const { moneyPaid, entryDate, entryTime, discountApplied } = req.body;

        const newHousting = await this.createHoustingRequest.createTheHousting(
            parseInt(cashId),
            parseInt(clientId),
            parseInt(roomId),
            new DataHousting(
                0, //price by default 0
                parseInt(moneyPaid),
                entryDate,
                entryTime,
                parseInt(discountApplied),
                //dayjs(new Date()).utc(true).format()
            ),
        );
        this.addMoneyToCashUseCase.addMoneyToCash(parseInt(cashId), newHousting.moneyPaid);
        this.createHoustingReportRequest.createHoustingReport(
            parseInt(cashId),
            newHousting.id,
            newHousting.moneyPaid,
        );
        res.json(newHousting);
    };
    getHoustingByRoom = async (req: Request, res: Response) => {
        const { roomId } = req.params;

        const housting = await this.getHoustingRequest.getTheHoustingByRoom(parseInt(roomId));

        res.json(housting);
    };
    updateMoneyPaid = async (req: Request, res: Response) => {
        const { cashId, houstingId } = req.params;
        const { moneyToAdd } = req.body;

        const newMoneyPaid = await this.updateMoneyPaidUseCase.updateMoneyPaid(
            parseInt(houstingId),
            parseInt(moneyToAdd),
        );
        this.addMoneyToCashUseCase.addMoneyToCash(parseInt(cashId), parseInt(moneyToAdd));
        this.addMoneyToHoustingReportUseCase.addMoneyToHoustingReport(parseInt(houstingId), parseInt(moneyToAdd));
        res.json(newMoneyPaid);
    };
    finishHousting = async (req: Request, res: Response) => {
        const { houstingId } = req.params;

        const houstingFinished = await this.finishHoustingUseCase.finishHousting(parseInt(houstingId));

        res.json(houstingFinished);
    };
}
