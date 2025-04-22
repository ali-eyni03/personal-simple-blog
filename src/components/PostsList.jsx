import { Link } from "react-router-dom";

export function PostsList({ posts }) {
  const API_BASE_URL = "http://127.0.0.1:8000";

  const renderPost = (post, index) => {
    if (!post) return null; 
    let tagName = "بدون دسته‌بندی";
    if (post.tags && Array.isArray(post.tags) && post.tags.length > 0) {
      tagName = post.tags[0].name;
    }

    return (
      <article className="post-grid mb-5" key={index}>
        <Link className="post-thumb mb-4 d-block" to={`/blog/${post.id}`}>
          <img
            src={post.post_cover ? `${API_BASE_URL}${post.post_cover}` : "https://via.placeholder.com/800x400?text=تصویر+موجود+نیست"}
            alt={post.title}
            className="img-fluid w-100"
            onError={(e) => {
              console.error("Failed to load image:", e.target.src);
              e.target.src = "https://via.placeholder.com/800x400?text=تصویر+موجود+نیست";
            }}
          />
        </Link>
        <span className="cat-name font-extrLink text-uppercase font-sm text-color">
          {tagName}
        </span>
        <h3 className="post-title mt-1">
          <Link to={`/blog/${post.id}`}>{post.title || "در حال بارگذاری..."}</Link>
        </h3>
        <span className="text-muted text-uppercase font-sm">
          {post.jalali_day_month || "در حال بارگذاری..."}
        </span>
        <div className="post-content mt-4">
          <p>{post.summary || "در حال بارگذاری..."}</p>
          <Link to={`/blog/${post.id}`} className="btn btn-grey mt-3">
            بیشتر بخوانید
          </Link>
        </div>
      </article>
    );
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="row">
        <div className="col-12 text-center py-5">
          <p>هیچ پستی یافت نشد.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="col-lg-6 col-md-6 col-sm-6">
        {posts.slice(0, Math.min(3, posts.length)).map((post, index) => renderPost(post, index))}
      </div>
      <div className="col-lg-6 col-md-6 col-sm-6">
        {posts.length > 3 && posts.slice(3, Math.min(6, posts.length)).map((post, index) => renderPost(post, index + 3))}
      </div>
    </>
  );
}