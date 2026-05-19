import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  // Derived state: calculate unread count automatically from notifications array
  const unreadCount = React.useMemo(() => {
    const userId = user?.id || user?._id;
    if (!userId || !notifications.length) return 0;
    return notifications.filter(
      (n) => !n.readBy.some((id) => id.toString() === userId.toString()),
    ).length;
  }, [notifications, user]);

  const fetchNotifications = async (currentUser) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user-notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user-notifications/${id}/read`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const userId = user?.id || user?._id;
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === id &&
            !n.readBy.some((rid) => rid.toString() === userId?.toString())
              ? { ...n, readBy: [...n.readBy, userId] }
              : n,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  // Socket Connection setup
  useEffect(() => {
    if (user) {
      // Connect to socket server (Backend URL)
      const socketInstance = io(import.meta.env.VITE_API_BASE_URL, {
        withCredentials: true,
      });

      setSocket(socketInstance);

      // Join private user room
      socketInstance.emit("join", user.id || user._id);

      // Listen for new notifications
      socketInstance.on("new-notification", (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev]);
        // Optional: Trigger a sound or alert here
        console.log("New real-time notification received!", newNotif);
      });

      socketInstance.on(
        "notification-read",
        ({ userId: rUserId, notificationId }) => {
          setNotifications((prev) => {
            const alreadyRead = prev
              .find((n) => n._id === notificationId)
              ?.readBy.some((id) => id.toString() === rUserId);
            if (alreadyRead) return prev;

            return prev.map((n) =>
              n._id === notificationId
                ? { ...n, readBy: [...n.readBy, rUserId] }
                : n,
            );
          });
        },
      );

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [user]);

  // Initialize user from localStorage on app load
  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("accessToken");

      if (savedUser && token) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        fetchNotifications(parsedUser);
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", token);
    setUser(userData);
    fetchNotifications(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    setNotifications([]);
    if (socket) socket.disconnect();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        notifications,
        unreadCount,
        fetchNotifications,
        markNotificationAsRead,
        setNotifications,
        socket,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
