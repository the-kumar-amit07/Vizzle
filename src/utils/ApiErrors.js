class ApiErrors extends Error {
    constructor(
        statusCode,
        message = "Something Went Wrong",
        errors = [],
        statck = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.errors = errors
        this.success = false
        this.message = message
        this.data = null
        
        if (statck) {
            this.stack = statck
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiErrors}