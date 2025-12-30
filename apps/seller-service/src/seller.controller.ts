import { ValidationError } from '@packages/error-handler';
import imageKit from '@packages/libs/imageKit';
import prisma from '@packages/libs/prisma';
import { NextFunction, Response, Request } from 'express';

export const getSellerNotifications = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const sellerId = req.seller.id;

    const notifications = await prisma.notifications.findMany({
      where: { receiverId: sellerId },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    return next(error);
  }
};

// Mark notification as read
export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { notificationId } = req.body;

    if (!notificationId) {
      return next(new ValidationError('Notification ID is required'));
    }

    const notification = await prisma.notifications.update({
      where: { id: notificationId },
      data: { status: 'Read' },
    });

    return res.status(200).json({ success: true, notification });
  } catch (error) {
    return next(error);
  }
};
// Update shop info
export const updateShopInfo = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, address, phoneNumber, avatar: newAvatar, cover, socialLinks } =
      req.body;
    const sellerId = req.seller.id;

    const shop = await prisma.shops.findUnique({
      where: {
        sellerId,
      },
    });

    if (!shop) {
      return next(new ValidationError('Shop not found'));
    }

    if (newAvatar) {

      const response = await imageKit.upload({
        file: newAvatar,
        fileName: `shop-avatar-${Date.now()}.jpg`,
        folder: 'shop-avatars',
      });

      const currentAvatar = await prisma.images.findFirst({
        where: {
          shopId: shop.id,
        },
      });

      if (currentAvatar) {
        await prisma.images.update({
          where: {
            id: currentAvatar.id,
          },
          data: {
            fileUrl: response.url
          },
        });
        imageKit.deleteFile(currentAvatar.fileId);
      } else {
        await prisma.images.create({
          data: {
            fileUrl: response.url,
            fileId: response.fileId,
            shopId: shop.id,
          },
        });
      }
    }

    // Update shop details
    await prisma.shops.update({
      where: {
        sellerId,
      },
      data: {
        name,
        bio: description,
        address,
        coverBanner: cover,
        socialLinks: socialLinks || [], // Ensure socialLinks is an array
      },
    });

    // Update seller phone number
    await prisma.sellers.update({
      where: {
        id: sellerId,
      },
      data: {
        phone: phoneNumber,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Shop info updated successfully',
    });
  } catch (error) {
    return next(error);
  }
};

export const followShop = async (req, res) => {
  const userId = req.user.id;
  const { shopId } = req.params;

  try {
    await prisma.$transaction([
      prisma.followers.create({
        data: { userId, shopId },
      }),
      prisma.shops.update({
        where: { id: shopId },
        data: { followersCount: { increment: 1 } },
      }),
    ]);

    res.status(201).json({ message: "Shop followed" });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Already following" });
    }
    res.status(500).json({ error: "Failed to follow shop" });
  }
};


export const unfollowShop = async (req, res) => {
  const userId = req.user.id;
  const { shopId } = req.params;

  await prisma.$transaction([
    prisma.followers.deleteMany({
      where: { userId, shopId },
    }),
    prisma.shops.update({
      where: { id: shopId },
      data: { followersCount: { decrement: 1 } },
    }),
  ]);

  res.json({ message: "Unfollowed successfully" });
};


export const getFollowerCount = async (req, res) => {
  const { shopId } = req.params;

  const shop = await prisma.shops.findUnique({
    where: { id: shopId },
    select: { followersCount: true },
  });

  res.json({ followersCount: shop?.followersCount ?? 0 });
};



export const isFollowing = async (req, res) => {
  const userId = req.user.id;
  const { shopId } = req.params;

  const follow = await prisma.followers.findUnique({
    where: {
      userId_shopId: { userId, shopId },
    },
  });

  res.json({ isFollowing: !!follow });
};


