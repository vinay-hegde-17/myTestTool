const { SEND_MAIL_ENDPOINTS } = require('../constants/sendMail.constants');

class SendMailClient {

    constructor(request, appSecret) {
        this.request = request;
        this.appSecret = appSecret;
    }

    async sendMail(payload) {

        return await this.request.post(
            SEND_MAIL_ENDPOINTS.SEND_MAIL,
            {
                headers: {
                    'x-app-secret': this.appSecret
                },
                data: payload
            }
        );
    }

    async sendMailWithoutAuth(payload) {

        return await this.request.post(
            SEND_MAIL_ENDPOINTS.SEND_MAIL,
            {
                data: payload
            }
        );
    }
}

module.exports = SendMailClient;