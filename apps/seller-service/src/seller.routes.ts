import { isSeller } from '@packages/error-handler/authorizeRoles';
import isAuthenticated from '@packages/error-handler/isAuthenticated';
import { Router } from 'express';
import { getSellerNotifications, markAsRead, updateShopInfo } from './seller.controller';

const router = Router();

router.get(
  '/seller-notifications',
  isAuthenticated,
  isSeller,
  getSellerNotifications
);
router.put('/mark-as-read/:notificationId', isAuthenticated, markAsRead);
router.put(
  '/update-shop-info',
  isAuthenticated,
  isSeller,
  updateShopInfo
);

export default router;
