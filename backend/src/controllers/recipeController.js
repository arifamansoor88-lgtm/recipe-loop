import prisma from "../db.js";

// POST /recipes
export const createRecipe = async (req, res) => {
  const { title, description, source, rating } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const imageUrl = req.file
    ? `http://localhost:5000/uploads/${req.file.filename}`
    : null;

  const recipe = await prisma.recipePost.create({
    data: {
      title,
      description,
      source,
      rating: rating ? parseInt(rating) : null,
      imageUrls: imageUrl ? [imageUrl] : [],
      authorId: req.userId,
    },
  });

  res.status(201).json(recipe);
};

// GET /recipes
export const getAllRecipes = async (req, res) => {
  const recipes = await prisma.recipePost.findMany({
    include: {
      author: { select: { username: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(recipes);
};

// GET /recipes/me
export const getMyRecipes = async (req, res) => {
  const recipes = await prisma.recipePost.findMany({
    where: { authorId: req.user.id },
    orderBy: { createdAt: "desc" },
  });

  res.json(recipes);
};

// GET /recipes/:id
export const getRecipeById = async (req, res) => {
  const recipe = await prisma.recipePost.findUnique({
    where: { id: req.params.id },
    include: {
      author: { select: { username: true } },
    },
  });

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  res.json(recipe);
};

