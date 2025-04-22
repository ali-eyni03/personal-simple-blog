import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export function About() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/about/")
      .then((res) => res.json())
      .then((data) => setAbout(data))
      .catch((error) => console.error("Error fetching about data:", error));
  }, []);

  if (!about) return <p>در حال بارگذاری...</p>;

  return (
    <>
      <Navbar />
      <div className="breadcrumb-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 text-center">
              <h2 className="lg-title">درباره ما</h2>
            </div>
          </div>
        </div>
      </div>

      <section className="pt-5 padding-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <img src={`http://127.0.0.1:8000${about.main_image}`} alt="About" className="img-fluid w-100" />
            </div>
          </div>

          <div className="row justify-content-center mt-5">
            <div className="col-lg-4">
              <h5 className="text-uppercase mb-4">من چه کسی هستم؟</h5>
              <p>{about.bio}</p>
            </div>
            <div className="col-lg-4">
              <h5 className="text-uppercase mb-4">چشم انداز من</h5>
              <p>{about.vision}</p>
            </div>
            <div className="col-lg-4">
              <h5 className="text-uppercase mb-4">دنبال کنید</h5>
              <div className="follow-socials">
                <a href={about.social_facebook} className="fb"><i className="ti-facebook"></i></a>
                <a href={about.social_twitter} className="twt"><i className="ti-twitter"></i></a>
                <a href={about.social_instagram} className="inst"><i className="ti-instagram"></i></a>
                <a href={about.social_youtube} className="youtube"><i className="ti-youtube"></i></a>
                <a href={about.social_pinterest} className="pint"><i className="ti-pinterest"></i></a>
              </div>
            </div>
          </div>

          <h3 className="mb-3 mt-5">سفرهای من</h3>
          <div className="row">
            {about.gallery.map((item, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="about-widget mb-4 mb-lg-0">
                  <img src={`http://127.0.0.1:8000${item.image}`} alt={item.title} className="img-fluid gallery-about" />
                  <h4 className="mt-3">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
