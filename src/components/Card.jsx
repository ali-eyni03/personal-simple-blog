import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
export default function Card() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    fetch("http://127.0.0.1:8000/api/blog/posts/")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  };

  useEffect(() => {
    fetchPosts(); 
    const interval = setInterval(fetchPosts, 5000);

    return () => clearInterval(interval); 
  }, []);

  return (
    <main>
      <div className="cards">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article className="card" key={post.id}>
                <Link to={`/blog/${post.id}`}>
                    <img src={`http://127.0.0.1:8000${post.post_cover}`} alt={post.title} />
                </Link>
              <div className="content">
              <p className="post__date">
                <span className="day">{post.jalali_day_month.split(" ")[0]}</span>
                <span className="month">{post.jalali_day_month.split(" ")[1]}</span>
              </p>

                <p className="post__category">{post.category || "دسته‌بندی نشده"}</p>
                <Link to={`/blog/${post.id}`}>
                  <p className="post__title">{post.title}</p>
                </Link>
                <p className="post__desc">{post.content.substring(0, 100)}...</p>
              </div>
            </article>
          ))
        ) : (
          <p>هیچ پستی وجود ندارد</p>
        )}
      </div>
    </main>
  );
}
