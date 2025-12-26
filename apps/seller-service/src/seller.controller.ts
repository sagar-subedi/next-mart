import { ValidationError } from '@packages/error-handler';
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
    const { name, description, address, phoneNumber, zipCode, avatar, cover, socialLinks } =
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

    if (avatar) {
      const isAvatarExist = await prisma.images.findFirst({
        where: {
          shopId: shop.id,
        },
      });

      if (isAvatarExist) {
        await prisma.images.update({
          where: {
            id: isAvatarExist.id,
          },
          data: {
            fileUrl: avatar,
          },
        });
      } else {
        await prisma.images.create({
          data: {
            fileUrl: avatar,
            fileId: '123', // Mock fileId as we are using external URLs
            userId: sellerId,
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
