const { LogsService } = require('../services/logs.js');

function createAPIController(service){
    return {
        get: async (req, res) => {
            try {
                if (req?.query?.id) {
                    res.json(await service.getById(req?.query?.id))
                }
                else {
                    res.json(await service.getAll())
                }
            }
            catch (error) {
                LogsService.in({ endpoint: req.originalUrl, error: error, body: req?.body, query: req?.query })
                console.log(error)
                res.sendStatus(500)
            }
        },
        post: async (req, res) => {
            try {
                await service.create(req?.body)
                res.sendStatus(204)
            }
            catch (error) {
                LogsService.in({ endpoint: req.originalUrl, error: error, body: req?.body, query: req?.query })
                console.log(error)
                res.sendStatus(500)
            }
        },
        put: async (req, res) => {
            try {
                await service.update(req?.query?.id, req?.body)
                res.sendStatus(204)
            }
            catch (error) {
                LogsService.in({ endpoint: req.originalUrl, error: error, body: req?.body, query: req?.query })
                console.log(error)
                res.sendStatus(500)
            }
        },
        delete: async (req, res) => {
            try {
                await service.delete(req?.query?.id)
                res.sendStatus(204)
            }
            catch (error) {
                LogsService.in({ endpoint: req.originalUrl, error: error, body: req?.body, query: req?.query })
                console.log(error)
                res.sendStatus(500)
            }
        }
    }
}


class APIController {

    constructor( service ) {
        this.service = service
        console.log(this.service)
    }

 async get (req, res) {
        try {
            if (req?.query?.id) {
                res.json(await this.service.getById(req?.query?.id))
            }
            else {
                res.json(await this.service.getAll())
            }
        }
        catch (error) {
            LogsService.in({ endpoint: req.originalUrl, error: error, body: req?.body, query: req?.query })
            console.log(error)
            res.status(500)
        }
    }
    async post(req, res) {
        try {
            await this.service.create(req?.body)
            res.status(204)
        }
        catch (error) {
            LogsService.in({ endpoint: req.originalUrl, error: error, body: req?.body, query: req?.query })
            console.log(error)
            res.status(500)
        }
    }
    async put(req, res) {
        try {
            await this.service.update(req?.query?.id, req?.body)
            res.status(204)
        }
        catch (error) {
            LogsService.in({ endpoint: req.originalUrl, error: error, body: req?.body, query: req?.query })
            console.log(error)
            res.status(500)
        }
    }
    async delete(req, res) {
        try {
            await this.service.remove(req?.query?.id)
            res.status(204)
        }
        catch (error) {
            LogsService.in({ endpoint: req.originalUrl, error: error, body: req?.body, query: req?.query })
            console.log(error)
            res.status(500)
        }
    }
}

module.exports = {APIController, createAPIController }; 