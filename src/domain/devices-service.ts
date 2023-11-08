import {devicesRepository} from "../repositories/devices-db-repositoty";
import {jwtService} from "../application/jwt-service";

export const devicesService = {
    async createSession(
        ip: string,
        title: string = "Chrome 105",
        refreshToken: string
    ) {
        const verifiedToken = await jwtService.verifyToken(refreshToken)
        const newSession = {
            ip: ip,
            title: title,
            lastActiveDate: new Date(verifiedToken.iat * 1000).toDateString(),
            deviceId: verifiedToken.deviceId
        }
        await devicesRepository.addSession(newSession)
        return newSession
    },
}