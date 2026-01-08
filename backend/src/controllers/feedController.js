import prisma from "../db.js";

export const getFeed = async (req, res) => {
  try {
    const userId = req.userId;

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map(f => f.followingId);

    if (followingIds.length === 0) {
      return res.json({ recipes: [] });
    }

    const recipes = await prisma.recipePost.findMany({
      where: {
        authorId: { in: followingIds },
      },
      include: {
        author: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ recipes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load feed" });
  }
};

