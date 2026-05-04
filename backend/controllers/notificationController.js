import Notification from '../models/NotificationModel.js';

/**
 * Get the latest notifications for the logged-in user
 * Route: GET /api/notifications
 */
export const getUserNotifications = async (req, res) => {
  try {
    // req.user._id auth middleware (protect) se aayega
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 }) // Latest notifications pehle
      .limit(10);

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching notifications", 
      error: error.message 
    });
  }
};


export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );
    res.status(200).json({ success: true, message: "All marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};