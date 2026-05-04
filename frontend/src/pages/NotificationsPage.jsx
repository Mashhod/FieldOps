import { useMemo, useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { GlobalContext } from '../context/Context'
import Card from '../components/Card'
import Button from '../components/Button'

function NotificationsPage() {
  const { state } = useContext(GlobalContext);
  const { baseUrl } = state;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Backend se notifications fetch karna
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('fieldops_token');
      const res = await axios.get(`${baseUrl}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data.data);
    } catch (err) {
      console.error("Error fetching notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // 2. Mark as Read Logic (Single notification)
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('fieldops_token');
      // Backend pe patch request bhej rahe hain (Point 3 mein dekhein)
      await axios.patch(`${baseUrl}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setItems((prev) => 
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Error marking read", err);
    }
  };

  // 3. Mark All as Read
  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('fieldops_token');
      await axios.put(`${baseUrl}/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking all read", err);
    }
  };

  const unread = useMemo(() => items.filter((n) => !n.read).length, [items]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">Stay on top of assignments, client notes, and completions.</p>
        </div>
        <Button
          variant="secondary"
          onClick={markAllRead}
          disabled={unread === 0}
        >
          Mark all read
        </Button>
      </div>

      <Card title="Inbox" action={<span className="text-xs text-slate-500">{unread} unread</span>}>
        <div className="space-y-3">
          {loading ? (
            <p className="text-center text-sm text-slate-500 py-4">Loading notifications...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-4">No notifications yet.</p>
          ) : (
            items.map((n) => (
              <motion.button
                key={n._id}
                type="button"
                onClick={() => !n.read && markAsRead(n._id)}
                whileHover={{ y: -1 }}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  n.read
                    ? 'border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-950/40'
                    : 'border-indigo-200 bg-indigo-50/70 dark:border-indigo-900/40 dark:bg-indigo-950/25'
                }`}
              >
                <p className="text-sm text-slate-800 dark:text-slate-100">{n.message}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{new Date(n.createdAt).toLocaleString()}</span>
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    {n.read ? 'Read' : 'Tap to mark read'}
                  </span>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

export default NotificationsPage;