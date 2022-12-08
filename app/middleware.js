require("../data/items");
const msg = (msg) => ({msg})

const validateName = (req, res, next) => {
    let name = req.params.name
    if (!name || items.findIndex(e => e.name === req.params.name) === -1) {
        let errCode
        switch (req.method) {
            case "POST":
                errCode = 400//bad request on post
                break;
            case "PATCH": //if already exists... then 404
            case "DELETE":
            case "GET":
                errCode = 404
                break
            default:
                errCode = 500//something went wrong
        }
        return res.status(errCode).json(msg(`name '${name}' not found`))
    }
    next()
}
const validateBody = (req, res, next) => {
    const json = req.body
    if (!json.name && !json.price) {
        return res.status(400).json(msg(`Request missing fields 'name' and 'price'`))
    } else if (!json.name) {
        return res.status(400).json(msg(`Request missing field 'name'`))

    } else if (!json.price) {
        return res.status(400).json(msg(`Request missing field 'price'`))
    }
    next()
}
module.exports = {validateBody, validateName}