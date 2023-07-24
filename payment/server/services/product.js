const { Product } = require("../db");

module.exports = {
  findAll: async function (criteria, options = {}) {
    return Product.findAll({
      where: criteria,
      ...options,
      order: Object.entries(options.order || {}),
    });
  },
  findById: async function (id) {
    return Product.findByPk(id);
  },
  findBy: async function (criteria) {
    return Product.findOne({
      where: criteria,
    });
  },
  create: async function (data) {
    return Product.create(data);
  },
  update: async function (criteria, data) {
    const [nb, Products = []] = await Product.update(data, {
      where: criteria,
      returning: true,
      individualHooks: true,
    });
    console.log(nb, Products);
    return Products;
  },
  remove: async function (criteria) {
    return Product.destroy({
      where: criteria,
    });
  },
};
