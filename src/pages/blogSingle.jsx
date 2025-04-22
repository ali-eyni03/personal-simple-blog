import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

import { SinglePost } from "../components/SinglePost";
export default function BlogSingle() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = "http://127.0.0.1:8000";
  

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/blog/posts/${postId}/`);
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    if (post) {
      const imgRegex = /src="([^"]+)"/g;
      let match;
      const contentImageUrls = [];
      
      while ((match = imgRegex.exec(post.content)) !== null) {
        contentImageUrls.push(match[1]);
      }
      
    }
  }, [post]);
  if (!post) {
    return <div>پستی یافت نشد.</div>;
  }
  return (
    <>
      <Navbar />
        <section className="single-block-wrapper section-padding">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                      <SinglePost
                      post={post}
                      postId={postId}
                      />
                    </div>
                    {/* <SideBar /> */}
                </div>
            </div>
        </section>
      <Footer />
    </>
  );
}