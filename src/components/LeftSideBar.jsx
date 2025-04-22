import { Link , useLocation} from "react-router-dom"
import { useState, useEffect } from "react"

export function SideBar({ onTagSelect, selectedTag }) {
    const [about, setAbout] = useState(null);
    const [tags, setTags] = useState([]);
	const location = useLocation();

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/about/')
            .then((res) => res.json())
            .then((data) => setAbout(data))
            .catch((error) => console.log("Error fetching about data:", error));
    }, []);
    
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/blog/tags/')
            .then((response) => response.json())
            .then((jsonResponse) => setTags(jsonResponse))
            .catch((error) => console.log(error));
    }, []);
    
    if (!about) return <p>در حال بارگذاری...</p>;

    const handleTagClick = (tagId, event) => {
        event.preventDefault();
        onTagSelect(tagId);
    };

    return(
        <>
        {/* left sidebar start */}
        <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
            <div className="sidebar sidebar-right">
                <div className="sidebar-wrap mt-5 mt-lg-0">
                    <div className="sidebar-widget about mb-5 text-center p-3">
                        <div className="about-author">
                            <img src={`http://127.0.0.1:8000${about.profile_pic}`} alt="" className="img-fluid"/>
                        </div>
                        <h4 className="mb-0 mt-4">{about.name}</h4>
                        <p>{about.how_you_describe_yourself}</p>
                        <p>{about.vision}</p>
                    </div>
                    <div className="sidebar-widget follow mb-5 text-center">
                        <h4 className="text-center widget-title">در شبکه های مجازی مارا دنبال کنید</h4>
                        <div className="follow-socials">
                            <Link to={about.social_facebook}><i className="ti-facebook"></i></Link>
                            <Link to={about.social_twitter} ><i className="ti-twitter"></i></Link>
                            <Link to={about.social_instagran} ><i className="ti-instagram"></i></Link>
                            <Link to={about.social_youtube}><i className="ti-youtube"></i></Link>
                        </div>
                    </div>
					{location.pathname.includes('/blog') && (
						<div className="sidebar-widget category mb-5">
                        <h4 className="text-center widget-title">دسته بندی</h4>
                        <ul className="list-unstyled">
                            {tags.map((tag) => (
                                <li key={tag.id} className="align-items-center d-flex justify-content-between">
                                    <Link 
                                        to="#" 
                                        onClick={(e) => handleTagClick(tag.id, e)}
                                        className={selectedTag === tag.id ? "active-tag" : ""}
                                    >
                                        {tag.name}
                                    </Link>
                                    <span>{tag.post_count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
					)}
                    
                </div>
            </div>
        </div>
        {/* left sidebar end */}
        </>
    )
}