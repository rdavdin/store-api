const ProductModel = require("../models/product");
const { createCustomAPIError } = require("../errors/custom-error");

const getAllProductsStatic = async (req, res, next) => {
  const products = await ProductModel.find({
    price: { $gt: 30 },
    price: { $lt: 100 },
  })
    .sort("price name")
    .select("name price")
    .limit(30)
    .skip(0); //get 10 item starting from the 3nd item
  res.status(200).json({ products, nbHits: products.length });
};

function createConditionFilter(prop, operator, value) {
  let condObj = {};
  if (prop) {
    condObj = prop;
  }
  condObj[operator] = value;
  return condObj;
}

const getAllProducts = async (req, res, next) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }

  if (name) {
    // queryObject.name = new RegExp(name, 'i'); //or
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regex = /\b(>|>=|=|<|<=)\b/g;
    const filters = numericFilters
      .replace(/ +/g, "")
      .replace(regex, (match) => `-${operatorMap[match]}-`)
      .split(",");

    const options = ['price', 'rating']; //options: must talk in document
    filters.forEach((element) => {
      const [field, operator, value] = element.split("-");
      if(options.includes(field)){
        if (queryObject[field]) {
          queryObject[field][operator] = Number(value);
        } else {
          queryObject[field] = { [operator]: Number(value) };
        }
      }
    });
  }

  const result = ProductModel.find(queryObject);
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result.sort(sortList);
  } else {
    result.sort("createdAt");
  }
  if (fields) {
    const selectList = fields.split(",").join(" ");
    result.select(selectList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result.skip(skip).limit(limit);
  const products = await result;
  res.status(200).json({ nbHits: products.length, products });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
