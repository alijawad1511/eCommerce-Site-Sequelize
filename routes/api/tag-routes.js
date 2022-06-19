const router = require('express').Router();
const { Tag,Product,ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/',async (req,res) => {
  // Find all Tags & associated Products
  const tags = await Tag.findAll({
    include: [
      {
        model: Product,
        as: 'products',
        attributes: ["id","product_name","price","stock","category_id"],
        through: {
          attributes: [],
        }
      }
    ]
  });

  if (tags === null) {
    res.status(404).json({ message: "No tag found" });
  } else {
    res.status(200).json(tags);
  }

});

router.get('/:id',async (req,res) => {
  // Find a single Tag & its all associated Products
  const tag = await Tag.findByPk(req.params.id,
    {
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ["id","product_name","price","stock","category_id"],
          through: {
            attributes: [],
          }
        }
      ]
    });

  if (!tag) {
    res.status(404).json({ message: `Tag with id ${req.params.id} not found` });
  } else {
    res.status(200).json(tag.dataValues);
  }

});

router.post('/',async (req,res) => {
  // Create a New Tag

  const { tag_name } = req.body;
  let response = await Tag.create({ tag_name });

  res.status(201).json(response.dataValues);

});

router.put('/:id',async (req,res) => {
  // Update a Tag by Id
  let response = await Tag.update(req.body,{ where: { id: req.params.id } });
  res.status(200).send({ message: "Tag updated" });
});

router.delete('/:id',async (req,res) => {
  // Delete a Tag by Id
  let id = req.params.id;

  const response = await Tag.destroy({
    where: {
      id: id
    }
  })

  if (response === 1) {
    res.status(200).json({ message: 'Tag deleted' });
  } else {
    res.status(404).json({ message: `Tag with id ${req.params.id} not found` });
  }

});

module.exports = router;
