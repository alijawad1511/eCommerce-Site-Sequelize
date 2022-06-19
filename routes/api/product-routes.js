const router = require('express').Router();
const { Product,Category,Tag,ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/',async (req,res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  const products = await Product.findAll({
    // Include Category and associated Tags with result
    include: [Category,Tag]
  });

  if (products === null) {
    res.status(404).json({ message: "No product found" });
  } else {
    res.status(200).json(products);
  }

});

// get one product
router.get('/:id',async (req,res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  const product = await Product.findByPk(req.params.id,{ include: [Category,Tag] });

  if (product === null) {
    res.status(404).json({ message: `Product with id ${req.params.id} not found` });
  } else {
    res.status(200).json(product);
  }

});

// create new product
router.post('/',(req,res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });

        // console.log(productTagIdArr);
        ProductTag.bulkCreate(productTagIdArr);
      }

      // if no product tags, just respond
      res.status(200).json(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id',(req,res) => {
  // update product data
  Product.update(req.body,{
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // console.log('Tags found in DB : '.productTags);
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);

      // console.log('Tags passed in Body: '.req.body.tagIds);

      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id',async (req,res) => {
  // delete one product by its `id` value
  let response = await Product.destroy({ where: { id: req.params.id } });

  if (response === 1) {
    res.status(200).json({ message: 'Product deleted' });
  } else {
    res.status(404).json({ message: `Product with id ${req.params.id} not found` });
  }

});

module.exports = router;
