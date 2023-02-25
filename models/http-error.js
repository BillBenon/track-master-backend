/**
 * @swagger
 * components:
 *   schemas:
 *     HttpError:
 *       type: object
 *       required:
 *         - message
 *         - code
 *       properties:
 *         message:
 *           type: string
 *         code:
 *           type: integer
 *       example:
 *         message: 'Not found'
 *         code: 404
 */

class HttpError extends Error {
    constructor(message, errorCode) {
        super(message);
        this.code = errorCode;
    }
}

module.exports = HttpError;
