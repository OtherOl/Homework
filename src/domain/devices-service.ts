import {DevicesRepository} from "../repositories/devices-db-repository";
import {jwtService} from "../application/jwt-service";
import {ObjectId} from "mongodb";

export class DevicesService {
    constructor(protected devicesRepository: DevicesRepository) {}
    async createSession(
        ip: string,
        title: string = "Chrome 105",
        refreshToken: string
    ) {
        const verifiedToken = await jwtService.verifyToken(refreshToken)
        const newSession = {
            _id: new ObjectId(),
            ip: ip,
            title: title,
            lastActiveDate: new Date(verifiedToken.iat * 1000).toISOString(),
            deviceId: verifiedToken.deviceId,
            userId: verifiedToken.userId
        }

        await this.devicesRepository.addSession(newSession)
        return newSession
    }
}