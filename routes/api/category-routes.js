const router = require('express').Router();
const { Category,Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/',async (req,res) => {
  // Find all Categoris and assocaited Products
  const categories = await Category.findAll({
    include: [
      {
        model: Product,
        as: 'products',
        attributes: ["id","product_name","price","stock","category_id"],
      }
    ]
  });

  if (categories === null) {
    res.status(404).json({ message: "No categories found" });
  } else {
    res.status(200).json(categories);
  }

});

router.get('/:id',async (req,res) => {
  // Find a single Product and associated Products

  const category = await Category.findByPk(req.params.id,{
    // Add associated products with result
    include: [
      {
        model: Product,
        as: 'products',
        attributes: ["id","product_name","price","stock","category_id"],
      }
    ]
  });

  if (!category) {
    res.status(404).json({ message: `Category with id ${req.params.id} not found` });
  } else {
    res.status(200).json(category.dataValues);
  }

});

router.post('/',async (req,res) => {
  // Create a new Category

  const { category_name } = req.body;
  let response = await Category.create({ category_name });

  res.status(201).json(response.dataValues);

});

router.put('/:id',async (req,res) => {
  // Update a Category by Id

  let response = await Category.update(req.body,{ where: { id: req.params.id } });
  res.status(200).send({ message: "Category updated" });
});

router.delete('/:id',async (req,res) => {
  // delete a category by its `id` value
  let id = req.params.id;

  const response = await Category.destroy({
    where: {
      id: id
    }
  })

  if (response === 1) {
    res.status(200).json({ message: 'Category deleted' });
  } else {
    res.status(404).json({ message: `Category with id ${req.params.id} not found` });
  }

});

module.exports = router;
