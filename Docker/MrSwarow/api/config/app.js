class APP {
    static statusCode = {
        ok : 200,
        created : 201,
        accepted : 202,
        nonAuthInfo : 203,
        noContent : 204,
        badRequest : 400,
        unauthorized : 401,
        paymentRequired : 402,
        forbidden : 403,
        notFound : 404,
        methodNotAllowed : 405,
        notAcceptable : 406,
        conflict : 409,
        imteapot : 418,
        tooManyRequest : 429,
        internalServerError : 500,
        notImplemented : 501,
        serviceUnavaible : 503
    }
    
}

module.exports = { APP }