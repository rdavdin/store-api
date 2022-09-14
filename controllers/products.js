const ProductModel = require('../models/product');
const {createCustomAPIError} = require('../errors/custome-error')

const getAllProductsStatic = async (req, res, next) => {
    const products = await ProductModel.find({});
    res.status(200).json({products});
}

const getAllProducts = async (req, res, next) => {
    const {featured} = req.query;
    
    

    const products = await ProductModel.find(featured);
    res.status(200).json({products, nbHits: products.length});
}


module.exports = {
    getAllProducts,
    getAllProductsStatic
}