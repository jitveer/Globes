import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/Main Layout/mainLayout";
import Home from "./pages/Home/Home";
import Blogs from "./pages/Blogs/Blogs";
import Contact from "./pages/Contact/Contact";
import About from "./pages/About/AboutUs";
import Properties from "./pages/Properties/Properties";
import Notification from "./pages/Notifications/Notification";
import Post from "./pages/Post/Post";
import Navbar from "./components/Navbar";

// New Pages
import PropertyDetails from "./pages/Properties/PropertyDetails";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import Wishlist from "./pages/Wishlist/Wishlist";
import Auth from "./pages/Auth/Auth";
import NotFound from "./pages/NotFound/NotFound";
import Inquiry from "./pages/Inquiry/Inquiry";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";
import TermsConditions from "./pages/Legal/TermsConditions";
import AdminDashboard from "./pages/Admin/dashboard/AdminDashboard";
import SuperAdminDashboard from "./pages/Super Admin/SuperAdminDashboard";
import SuperAdminLogin from "./pages/Super Admin/SuperAdminLogin";
import AdminLogin from "./pages/Admin/auth/AdminLogin";
import AddEditProperty from "./pages/Admin/dashboard/components/PropertiesTab/AddEditProperty";
import BlogEditor from "./pages/Admin/dashboard/components/BlogsTab/BlogEditor";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin Routes (No MainLayout/Website Navbar) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-property" element={<AddEditProperty />} />
          <Route
            path="/admin/edit-property/:id"
            element={<AddEditProperty />}
          />
          <Route path="/admin/blogs_editor" element={<BlogEditor />} />
          <Route path="/admin/add-blog" element={<BlogEditor />} />
          <Route path="/admin/edit-blog/:id" element={<BlogEditor />} />

          {/* Super Admin Routes (No MainLayout/Website Navbar) */}
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />
          <Route path="/super-admin" element={<SuperAdminDashboard />} />

          {/* Website Routes with Main Layout */}
          <Route
            path="/"
            element={
              <>
                {" "}
                <Navbar /> <MainLayout />{" "}
              </>
            }
          >
            <Route index element={<Home />} />
            <Route path="properties" element={<Properties />} />
            <Route path="property/:id" element={<PropertyDetails />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="blog/:slug" element={<Post />} />
            <Route path="post" element={<Post />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="notifications" element={<Notification />} />
            <Route path="user_dashboard" element={<UserDashboard />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="login" element={<Auth />} />
            <Route path="register" element={<Auth />} />
            <Route path="inquiry/:id" element={<Inquiry />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsConditions />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
