import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { Comments } from "./Comments";

const CommentForm = ({ postId, onCommentAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        mail: '',
        comment: '',
        parent_id: null 
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const API_BASE_URL = "http://127.0.0.1:8000";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/blog/posts/${postId}/comments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error('خطا در ارسال نظر');
            }
            
            const data = await response.json();
            
            // Reset form
            setFormData({ name: '', mail: '', comment: '', parent_id: null });
            setSuccess(true);
            
            if (onCommentAdded) {
                onCommentAdded(data);
            }
            
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (error) {
            setError('خطا در ارسال نظر. لطفا دوباره تلاش کنید.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="comment-form mb-5 gray-bg p-5" id="comment-form">
            <h3 className="mb-4 text-center">کامنت بگذارید</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">نظر شما با موفقیت ثبت شد.</div>}
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <input
                            className="form-control"
                            type="text"
                            name="name"
                            id="name"
                            placeholder="نام:"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <input
                            className="form-control"
                            type="email"
                            name="mail"
                            id="mail"
                            placeholder="ایمیل:"
                            value={formData.mail}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="col-lg-12">
                    <textarea
                        className="form-control mb-3"
                        name="comment"
                        id="comment"
                        cols="30"
                        rows="5"
                        placeholder="کامنت"
                        value={formData.comment}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
            </div>

            <input
                className="btn btn-primary"
                type="submit"
                name="submit-contact"
                id="submit_contact"
                value="ارسال پیام"
                disabled={isSubmitting}
            />
        </form>
    );
};

export function SinglePost(props) {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_BASE_URL = "http://127.0.0.1:8000";
    const [about, setAbout] = useState("");
    const [comments, setComments] = useState([]);

    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    const toPersianNumber = (number) => {
        if (number === undefined || number === null) return '۰';
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return number.toString().replace(/\d/g, (match) => persianDigits[parseInt(match)]);
    };

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/about/')
            .then((response) => response.json())
            .then((jsonResponse) => setAbout(jsonResponse))
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        DOMPurify.setConfig({
            ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
                'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'figure', 'img', 'span'],
            ALLOWED_ATTR: ['href', 'name', 'target', 'src', 'alt', 'class', 'id', 'style', 'width', 'height']
        });
    }, []);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/blog/posts/${props.postId}/`);
                if (!response.ok) {
                    throw new Error("Network response was not OK");
                }
                const data = await response.json();
                setPost(data);

                if (data.total_likes !== undefined) {
                    setLikes(data.total_likes);
                }
                if (data.liked_by_current_user !== undefined) {
                    setLiked(data.liked_by_current_user);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [props.postId]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/blog/comments/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch comments");
                }
                const data = await response.json();
                setComments(data.results); // Set the comments data
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        fetchComments();
    }, [props.postId]);

    useEffect(() => {
        if (props.post) {
            const imgRegex = /src="([^"]+)"/g;
            let match;
            const contentImageUrls = [];

            while ((match = imgRegex.exec(props.post.content)) !== null) {
                contentImageUrls.push(match[1]);
            }
        }
    }, [props.post]);

    const fixImageUrls = (htmlContent) => {
        if (!htmlContent) return "";
        return htmlContent.replace(/src="\/media\//g, `src="${API_BASE_URL}/media/`);
    };

    const handleLike = async () => {
        if (likeLoading) return;

        setLikeLoading(true);
        try {
            const action = liked ? 'unlike' : 'like';

            const response = await fetch(`${API_BASE_URL}/api/blog/like-post/${props.postId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: action }),
            });

            if (!response.ok) {
                throw new Error('Failed to like/unlike post');
            }

            const data = await response.json();

            if (data.status === 'liked' || data.status === 'unliked') {
                setLiked(!liked);
                setLikes(data.total_likes);
            }
        } catch (error) {
            console.error('Error liking/unliking post:', error);
        } finally {
            setLikeLoading(false);
        }
    };

    const handleCommentAdded = (newComment) => {
        setComments([...comments, newComment]);
    };

    if (loading) {
        return <div>در حال بارگذاری...</div>;
    }

    if (error) {
        return <div>خطا: {error}</div>;
    }

    if (!post) {
        return <div>پستی یافت نشد.</div>;
    }

    const sanitizedContent = DOMPurify.sanitize(post.content);
    const contentWithFixedUrls = fixImageUrls(sanitizedContent);

    return (
        <>
            <div className="single-post">
                <div className="post-header mb-5 text-center">
                    <div className="meta-cat">
                        {post.tags.map((tag, index) => (
                            <Link
                                key={index}
                                className="post-category font-extra text-color text-uppercase font-sm letter-spacing-1"
                                to="#"
                            >
                                {tag.name}
                                {index < post.tags.length - 1 ? ", " : ""}
                            </Link>
                        ))}
                    </div>

                    <h2 className="post-title mt-2">
                        {post.title}
                    </h2>

                    <div className="post-meta">
                        <span className="text-uppercase font-sm letter-spacing-1 mr-3">
                            توسط {post.author}
                        </span>
                        <span className="text-uppercase font-sm letter-spacing-1">
                            {post.jalali_day_month}
                        </span>
                    </div>
                    <div className="post-featured-image mt-5">
                        <img
                            src={`${API_BASE_URL}${post.post_cover}`}
                            className="img-fluid w-100"
                            alt="featured-image"
                            onError={(e) => {
                                console.error("Failed to load image:", e.target.src);
                                e.target.src = "https://via.placeholder.com/800x400?text=Image+Not+Found";
                            }}
                        />
                    </div>
                </div>

                <div className="post-body">
                    <div className="entry-content">
                        <div
                            dangerouslySetInnerHTML={{ __html: contentWithFixedUrls }}
                            className="post-content-container"
                        />
                    </div>

                    <div className="post-tags py-4">
                        {post.tags.map((tag, index) => (
                            <Link key={index} to="#">
                                #{tag.name}
                            </Link>
                        ))}
                    </div>
                    <div className="
                        tags-share-box 
                        center-box 
                        d-flex 
                        text-center 
                        justify-content-between 
                        border-top 
                        border-bottom 
                        py-3"
                    >
                        <span className="single-comment-o">
                            <i className="fa fa-comment-o"></i>{comments ? toPersianNumber(comments.length) : toPersianNumber(0)} نظر
                        </span>
                        <div className="post-share">
                            <div>
                                <Link
                                    className={`penci-post-like single-like-button ${liked ? 'liked' : ''}`}
                                    onClick={handleLike}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        className={`bi bi-heart ${liked ? 'liked' : ''}`}
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                                        />
                                    </svg>
                                </Link>
                            </div>
                            <div className="count-number-like">{toPersianNumber(likes)}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* post author start */}
            <div className="post-author d-flex my-5">
                <div className="author-img">
                    <img
                        alt=""
                        src={`http://127.0.0.1:8000${about.profile_pic}`}
                        className="avatar avatar-100 photo"
                        width="100"
                        height="100"
                    />
                </div>

                <div className="author-content pl-4">
                    <h4 className="mb-3"><Link to="#" title="" rel="author" className="text-capitalize">
                        {about.name}
                    </Link>
                    </h4>
                    <p>
                        {about.vision}
                    </p>
                </div>
            </div>
            {/* post author end */}

            {/* users comment start */}
            <div className="comment-areLink my-5">
                <h3 className="mb-4 text-center">کامنت ها -{comments ? toPersianNumber(comments.length) : toPersianNumber(0)}-</h3>

                {/* Pass comments data to the Comments component */}
                <Comments comments={comments || []}/>
            </div>
            {/* users comment end */}

            {/* Use the CommentForm component */}
            <CommentForm 
                postId={props.postId} 
                onCommentAdded={handleCommentAdded}
            />
        </>
    );
}