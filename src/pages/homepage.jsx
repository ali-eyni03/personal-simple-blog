import { Navbar } from "../components/Navbar"
import {Footer} from "../components/Footer"
import { SideBar } from "../components/LeftSideBar"
import { HomePosts } from "../components/HomePosts"
import { useState,useEffect } from "react"
function Home(){
	const [posts, setPosts] = useState("")

	useEffect(
			()=>{
			fetch("http://127.0.0.1:8000/api/blog/posts-overview/")
			.then((response)=>response.json())
			.then((jsonResponse)=>setPosts(jsonResponse))
			.catch((error)=>console.log("Error fetching about data:",error))
		},[]
	);
    return (
        <>
            <Navbar/>
            {/* <SearchOverlay/> */}
            <section className="section-padding">
                <div className="container">
                    <div className="row">
                    </div>
                </div>
	        </section>
            <section className="section-padding pt-4">
		<div className="container">
			<div className="row">
				<div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
					<div className="row">
						<HomePosts
						posts={posts.results}
						/>
					</div>
				</div>
				<SideBar/>
			</div>
		</div>
		</section>
		<Footer/>
        </>
)}
export default Home