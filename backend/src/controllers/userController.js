import prisma from "../db.js";

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const viewerId = req.userId;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = viewerId
      ? await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: viewerId,
              followingId: user.id,
            },
          },
        })
      : null;

    const recipes = await prisma.recipePost.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      user: {
        ...user,
        followersCount: user._count.followers,
        followingCount: user._count.following,
        isFollowing: Boolean(isFollowing),
      },
      recipes,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { bio } = req.body;

    const avatarUrl = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : undefined;

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        bio,
        ...(avatarUrl && { avatarUrl }),
      },
      select: {
        id: true,
        username: true,
        bio: true,
        avatarUrl: true,
      },
    });

    res.json({ user: updatedUser });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) return res.json([]);

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: q,
          mode: "insensitive",
        },
      },
      take: 10,
      select: {
        id: true,
        username: true,
        avatarUrl: true,
      },
    });

    res.json(users);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleFollow = async (req, res) => {
  try {
    const { username } = req.params;

    const targetUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!targetUser || targetUser.id === req.userId) {
      return res.status(400).json({ message: "Invalid user" });
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.userId,
          followingId: targetUser.id,
        },
      },
    });

    if (existing) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: req.userId,
            followingId: targetUser.id,
          },
        },
      });

      return res.json({ following: false });
    }

    await prisma.follow.create({
      data: {
        followerId: req.userId,
        followingId: targetUser.id,
      },
    });

    res.json({ following: true });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.userId;

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map(f => f.followingId);

    const users = await prisma.user.findMany({
      where: {
        id: {
          notIn: [userId, ...followingIds],
        },
      },
      take: 5,
      select: {
        id: true,
        username: true,
        avatarUrl: true,
      },
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load suggested users" });
  }
};
