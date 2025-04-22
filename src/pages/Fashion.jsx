import { Navbar } from "../components/Navbar"
import {Footer} from "../components/Footer"
import { useEffect, useState } from "react"
import { SideBar } from "../components/LeftSideBar"
import { PostsList } from "../components/PostsList"
import { Pagination } from "../components/Pagination"

export function Fashion(){
    const [about, setAbout] = useState(null);
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedTag, setSelectedTag] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/about/')
            .then((res) => res.json())
            .then((data) => setAbout(data))
            .catch((error) => console.log("Error fetching about data:", error));
    }, []);

    useEffect(() => {
        let url = `http://127.0.0.1:8000/api/blog/posts-overview/?page=${currentPage}`;
        
        if(selectedTag) {
            url += `&tag=${selectedTag}`;
        }
        fetch(url)
            .then((response) => response.json())
            .then((jsonResponse) => {
                setPosts(jsonResponse.results);
                setTotalPages(jsonResponse.total_pages || 1);
            })
            .catch((error) => console.log("Error fetching posts:", error));
    }, [currentPage, selectedTag]);

    const handleTagFilter = (tagId) => {
        setSelectedTag(tagId);
        setCurrentPage(1);
    };

    if (!about) return <p>در حال بارگذاری...</p>;
    return(
        <>
            <Navbar/>
            <div className="breadcrumb-wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="text-center">
                                <h2 className="lg-title">سفر</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                            <div className="row">
                                <PostsList posts={posts} />
                            </div>
                            
                            <Pagination 
                                totalPages={totalPages}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                        <SideBar 
                            onTagSelect={handleTagFilter} 
                            selectedTag={selectedTag} 
                        />
                    </div>
                </div>
            </section>
            <Footer/>
        </>
    )
}