export class HttpError extends Error {
    statusCode: number;
    text: string;
    constructor(statusCode: number, message: string, text: string) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.text = text;
    }
}

export class HttpBadRequestError extends HttpError {
    constructor(message = "") {
        super(400, message, "Bad request");
    }
}

export class HttpUnauthorizedError extends HttpError {
    constructor(message = "") {
        super(401, message, "Unauthorized");
    }
}

export class HttpForbiddenError extends HttpError {
    constructor(message = "") {
        super(403, message, "Forbidden");
    }
}

export class HttpNotFoundError extends HttpError {
    constructor(message = "") {
        super(404, message, "Not found");
    }
}

export class HttpConflictError extends HttpError {
    constructor(message = "") {
        super(409, message, "Conflict");
    }
}

export class HttpEntityTooLargeError extends HttpError {
    constructor(message = "") {
        super(413, message, "Entity too large");
    }
}
