import {devicesRepository} from "../repositories/devices-db-repository";
import {jwtService} from "../application/jwt-service";
import {ObjectId} from "mongodb";

class DevicesService {
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

        await devicesRepository.addSession(newSession)
        return newSession
    }
}

export const devicesService = new DevicesService()