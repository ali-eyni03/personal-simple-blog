import { Link } from "react-router-dom";
export function SliderCardHome(props){
return(
<>
    {props.map(()=>{
        <div className="col-lg-4 col-md-4 col-sm-6">
        <div className="category-item">
            <div className="category-img">
                <Link to="blog-single.html"><img src="images/cat/cat-4.jpg" alt="" className="img-fluid w-100"/></Link>
            </div>
            <div className="content">
                <Link to="#" className="text-color text-uppercase font-sm font-extra">سبک زندگی</Link>
                <h4><Link to="blog-single.html">زمان خود را در ۳ مرحله مدیریت کنید</Link></h4>
            </div>
        </div>
    </div>
    })}
</>

)
}