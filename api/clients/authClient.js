import { AUTH_ENDPOINTS } from '../endpoints/authEndpoints';
import { qaTokenPayload } from '../payloads/authPayloads';

export class AuthClient {

    constructor(request) {
        this.request = request;
    }

    async getQaToken(email) {

    return await this.request.post(
        AUTH_ENDPOINTS.QA_TOKEN,
        {
            data: qaTokenPayload(email)
        }
    );
}
    async validateToken(token) {
        return await this.request.get(
            AUTH_ENDPOINTS.VALIDATE_TOKEN,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }
}