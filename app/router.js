const express = require("express");
const {validateBody, validateName} = require('./middleware')
const items = require('../data/items')
const router = module.exports = new express.Router();
items.push({name: 'world', price: 0})


router.get('/',
    (req, res) => res.json(items))

router.post('/', validateBody, (req, res) => {
    items.push({...req.body})
    return res.status(201).json({added: items[items.length-1]})
})
router.get('/:name', validateName, (req, res) => {
    res.json(items.find(e => e.name === req.params.name))
})
router.patch('/:name', validateName, (req, res) => {
    const updated = items.find(e => e.name === req.params.name)
    const itemKeys=Object.keys(updated)
    Object .keys(req.body).forEach(e=>{
        if(itemKeys.includes(e)){
            updated[e]= req.body[e]
        }
    })

    res.status(200).json({updated})
})
router.delete('/:name', validateName, (req, res) => {
    const found = items.findIndex(e=>e.name===req.params.name)
    items.splice(found, 1)
    res.json({msg:"Deleted"})
})
