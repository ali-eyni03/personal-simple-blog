import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');
  
  useEffect(() => {
    if (!query) return;
    
    setLoading(true);
    setError(null);
    
    fetch(`http://127.0.0.1:8000/api/blog/search/?q=${encodeURIComponent(query)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Search failed');
        }
        return response.json();
      })
      .then(data => {
        setSearchResults(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Search error:', err);
        setError('Error fetching search results');
        setLoading(false);
      });
  }, [query]);
  
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">نتایج جستجو برای: {query}</h2>
          
          {loading && <div className="text-center"><p>در حال جستجو...</p></div>}
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          {!loading && !error && searchResults.length === 0 && (
            <div className="alert alert-info">هیچ نتیجه‌ای یافت نشد</div>
          )}
          
          {searchResults.map(post => (
            <div key={post.id} className="post-item mb-4">
              <div className="row">
                <div className="col-md-4">
                  {post.post_cover && (
                    <img 
                      src={`http://127.0.0.1:8000${post.post_cover}`} 
                      alt={post.title} 
                      className="img-fluid rounded"
                    />
                  )}
                </div>
                <div className="col-md-8">
                  <div className="post-content">
                    <h3 className="post-title mb-2">
                      <Link to={`/blog/${post.id}`}>{post.title}</Link>
                    </h3>
                    <div className="post-meta mb-2">
                      <div><span><i className="ti-calendar"></i></span><span> {post.jalali_day_month}</span></div>
                      <div><span><i className="ti-user"></i></span> <span>{post.author}</span></div>
                      <div><span><i className="ti-heart"></i></span><span> {post.total_likes}</span></div>
                      <div><span><i className="ti-comment"></i></span><span> {post.total_comments}</span></div>
                    </div>
                    <div className="tags mb-2">
                      {post.tags && post.tags.map(tag => (
                        <span key={tag.id} className="badge badge-secondary mr-1">{tag.name}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;



