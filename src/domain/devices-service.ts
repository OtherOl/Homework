import {devicesRepository} from "../repositories/devices-db-repositoty";
import {jwtService} from "../application/jwt-service";
import {randomUUID} from "crypto";

export const devicesService = {
    async createSession(
        ip: string,
        title: string = "Chrome 105",
        refreshToken: string
    ) {
        const verifiedToken = await jwtService.verifyToken(refreshToken)
        const newSession = {
            _id: randomUUID(),
            ip: ip,
            title: title,
            lastActiveDate: new Date(verifiedToken.iat * 1000).toISOString(),
            deviceId: verifiedToken.deviceId,
            userId: verifiedToken.userId
        }
        await devicesRepository.addSession(newSession)
        return newSession
    },
}