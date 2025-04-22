import {Link} from "react-router-dom"


export function Footer() {
  
    return (
        <>
        <footer className="footer-section bg-grey">
		<div className="instagram-photo-section">
			<div className="container">
				<div className="row">
					<div className="col-lg-12">
					</div>
				</div>

				<div className="row no-gutters" id="instafeed">

				</div>
			</div>
		</div>

		<div className="container">
			<div className="row">
				<div className="col-lg-12 text-center">
					<div className="mb-4">
						<h2 className="footer-logo">Revolve.</h2>
					</div>
					<ul className="list-inline footer-socials">
						<li className="list-inline-item">
							<Link to="#"><i className="ti-facebook mr-2"></i>فیسبوک</Link>
						</li>
						<li className="list-inline-item">
							<Link to="#"><i className="ti-twitter mr-2"></i>توییتر</Link>
						</li>
						<li className="list-inline-item">
							<Link to="#"><i className="ti-instagram mr-2"></i>اینستاگرام</Link>
						</li>
						<li className="list-inline-item">
							<Link to="#"><i className="ti-youtube mr-2"></i>یوتیوب</Link>
						</li>
					</ul>
				</div>

				<div className="col-md-12 text-center">
					<p className="copyright">© Copyright 2019 - Revolve. All Rights Reserved. Distribution <Link className="text-white"
							to="https://themewagon.com">ThemeWagon.</Link></p>
				</div>
			</div>
		</div>
	</footer>
        </>
   )
  }
  
  
  