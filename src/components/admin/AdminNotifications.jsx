// src/components/admin/AdminNotifications.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminStyles from './Admin.module.css';

const AdminNotifications = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setPendingCount(5); // Mock data: 5 pending inquiries
      setLoading(false);
    }, 500);

    // 30초마다 미답변 문의 수 업데이트 (목업에서는 의미 없지만 구조 유지를 위해 남겨둠)
    const interval = setInterval(() => {
      setPendingCount(Math.floor(Math.random() * 10)); // Random mock count
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={adminStyles.notificationContainer}>
      <Link
        to="/admin/support"
        className={`${adminStyles.notificationLink} ${pendingCount > 0 ? adminStyles.hasNotification : ''}`}
        title={`미답변 문의 ${pendingCount}건`}
      >
        <span className={adminStyles.notificationIcon}>📧</span>
        <span className={adminStyles.notificationText}>문의</span>
        {pendingCount > 0 && (
          <span className={adminStyles.notificationBadge}>
            {pendingCount > 99 ? '99+' : pendingCount}
          </span>
        )}
      </Link>
    </div>
  );
};

export default AdminNotifications;