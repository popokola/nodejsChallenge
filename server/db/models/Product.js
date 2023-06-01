const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {

    class Product extends Model {
    }
    Product.init(
        {
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            price: DataTypes.INTEGER,
        },
        {
            sequelize: connection,
            tableName: "products",
        }
    );

    return Product;

}