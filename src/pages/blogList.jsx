import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Social } from "../components/Social";
import { General } from '../components/General';
export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch blog posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/blog/posts/");
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-4">
          <p>در حال بارگذاری...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-4">
          <p>خطا: {error}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">پست های بلاگ</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.id} className="border rounded-lg overflow-hidden shadow-lg">
              <Link to={`/blog/${post.id}`}>
                <img 
                  src={`http://127.0.0.1:8000${post.post_cover}`} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="day">{post.jalali_day_month.split(" ")[0]}</span>
                  <span className="month mr-2">{post.jalali_day_month.split(" ")[1]}</span>
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  {post.category || "دسته‌بندی نشده"}
                </p>
                <Link to={`/blog/${post.id}`}>
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                </Link>
                <p className="text-gray-700">
                  {post.content.substring(0, 100)}...
                </p>
              </div>
            </article>
          ))}
        </div>
        {posts.length === 0 && (
          <p className="text-center text-gray-600">هیچ پستی وجود ندارد</p>
        )}
      </main>
      <Social />
      <Footer />
    </>
  );
}