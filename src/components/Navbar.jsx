import {Link} from "react-router-dom"
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export function Navbar() {
      const [logo, setLogo] = useState(null);
      const [searchActive, setSearchActive] = useState(false);

    useEffect(() => {
      fetch("http://127.0.0.1:8000/api/about/")
        .then((res) => res.json())
        .then((data) => {
          setLogo(data.site_logo);
        })
        .catch((error) => console.error("Error fetching site logo:", error));
    }, []);
    const toggleSearch = () => {
        setSearchActive(!searchActive);
      };
      
const navigate = useNavigate();
const [searchQuery, setSearchQuery] = useState('');

const handleSearch = (e) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchActive(false);
    setSearchQuery(''); 
  }
};
  return (
    <>
        <div className="header-logo py-5 d-none d-lg-block">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 text-center">
                        <Link className="navbar-brand" to="/">
                            {logo ? (<img 
                                        src={`http://127.0.0.1:8000${logo}`} 
                                        alt="Site Logo"
                                        className="img-fluid w-100 site-logo"/>
                            ) : (
                            <p>Loading logo...</p>
                            )}
                        </Link>
                </div>
            </div>
        </div>
        </div>
        <header className="header-top bg-grey justify-content-center">
            <nav className="navbar navbar-expand-lg navigation">
                <div className="container">
                    <Link  className="navbar-brand d-lg-none" 
                        to="index.html">
                            <p>بلاگ من</p>
                    </Link>

                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent"
                        aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="ti-menu"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarContent">
                        <ul id="menu" className="menu navbar-nav ">
                            <li className="nav-item pl-0"><Link className="nav-link dropdown-toggle" to="/">خانه</Link></li>
                            <li className="nav-item"><Link to="/blog" className="nav-link">بلاگ</Link></li>
                            <li className="nav-item"><Link to="/about" className="nav-link">درباره ما</Link></li>
                            <li className="nav-item"><Link to="/contact" className="nav-link">تماس با ما</Link></li>
                            <li className="nav-item d-lg-none">
                            <div 
                            className={searchActive ? "search_toggle active p-3 d-inline-block bg-white" : "search_toggle p-3 d-inline-block bg-white"} 
                            onClick={toggleSearch}>
                                <i className="ti-search">
                                    </i>
                            </div>
                            </li>
                        </ul>
                    </div>

                    <div className="text-right search d-none d-lg-block">
                        <div 
                            className={searchActive ? "search_toggle active" : "search_toggle"} 
                            onClick={toggleSearch}>
                            <i className="ti-search"></i>
                        </div>
                    </div>
                </div>
            </nav>

        </header>
        {/* search overlay start */}
        <div className="search-wrap" >
            <div className={`overlay ${searchActive ? 'open' : ''}`}>  
              <form onSubmit={handleSearch} className="search-form">
                <div className="container">
                  <div className="row">
                    <div className="col-md-10 col-9">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="جستجو کنید ..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 col-3 text-right">
                      <div 
                        className="search_toggle toggle-wrap d-inline-block"
                        onClick={toggleSearch}>
                        <i className="ti-close"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
        </div>
        </div>
        {/* search overlay end */}
        </>
 )
}


