require("dotenv").config();
const { readFile } = require("fs").promises;
const connectDB = require("./db/connect");
const ProductModel = require("./models/product");
/** Note: */
/* We can read the content of json file through require function
 * to get the JSON data as a Javascript object.
 * const text = require('./products.json');
 * but the result will be cached
 * so if products.json changes, text will get the same result as the first time you require it.
 */

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    await ProductModel.deleteMany({});
    const text = await readFile("./products.json", "utf8");
    await ProductModel.create(JSON.parse(text));
    console.log("Success!!! ...");
    process.exit(0);
  } catch (error) {
    console.log(
      "There is an error while connecting db or reading file \n",
      error
    );
    process.exit(1);
  }
};

start();
