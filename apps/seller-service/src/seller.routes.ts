import { isSeller } from '@packages/error-handler/authorizeRoles';
import isAuthenticated from '@packages/error-handler/isAuthenticated';
import { Router } from 'express';
import { followShop, getFollowerCount, getSellerNotifications, isFollowing, markAsRead, unfollowShop, updateShopInfo } from './seller.controller';

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

router.post("/follow-shop/:shopId", isAuthenticated, followShop);
router.delete("/unfollow-shop/:shopId", isAuthenticated, unfollowShop);
router.get("/followers-count/:shopId", getFollowerCount);
router.get("/is-following/:shopId", isAuthenticated, isFollowing);

export default router;
