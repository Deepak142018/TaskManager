import Category from '../Models/Category.js';

export const getCategories = async (req, res) => {
  const categories = await Category.find({ userId: req.userId });
  res.json(categories);
};

export const createCategory = async (req, res) => {
  const category = new Category({ name: req.body.name, userId: req.userId });
  await category.save();
  res.status(201).json(category);
};

export const updateCategory = async (req, res) => {
  const category = await Category.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { name: req.body.name },
    { new: true }
  );
  res.json(category);
};

export const deleteCategory = async (req, res) => {
  await Category.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: 'Category deleted' });
};
