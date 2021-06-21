"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelController = void 0;
const typedi_1 = require("typedi");
const create_hotel_command_1 = require("../../../application/port/in/create-hotel.command");
const create_hotel_service_1 = require("../../../application/service/create-hotel.service");
const hotel_1 = require("../../../domain/hotel");
let HotelController = class HotelController {
    constructor(createHotelService) {
        this.createHotel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, address } = req.body;
            const command = new create_hotel_command_1.CreateHotelCommand(new hotel_1.HotelEntity(name, address));
            const hotelCreated = yield this.createNewHotelUseCase.createNewHotel(command);
            res.json(hotelCreated);
        });
        this.createNewHotelUseCase = createHotelService;
    }
};
HotelController = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [create_hotel_service_1.CreateHotelService])
], HotelController);
exports.HotelController = HotelController;
//# sourceMappingURL=create-user.controller.js.map