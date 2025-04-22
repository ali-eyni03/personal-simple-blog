import { useState } from 'react';
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    
    const [status, setStatus] = useState({
        submitted: false,
        success: false,
        message: ''
    });
    
    const [errors, setErrors] = useState({});
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const validate = () => {
        let tempErrors = {};
        if (!formData.name) tempErrors.name = 'نام الزامی است';
        if (!formData.email) tempErrors.email = 'ایمیل الزامی است';
        if (!/\S+@\S+\.\S+/.test(formData.email) && formData.email) tempErrors.email = 'ایمیل معتبر نیست';
        if (!formData.message) tempErrors.message = 'پیام الزامی است';
        
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) return;
        
        setStatus({ submitted: true, success: false, message: 'در حال ارسال...' });
        
        try {
            const response = await fetch('http://localhost:8000/api/blog/contact/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken(),
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const data = await response.json();
                setStatus({
                    submitted: true,
                    success: true,
                    message: 'پیام شما با موفقیت ارسال شد.'
                });
                setFormData({ name: '', email: '', message: '' });
            } else {
                const errorData = await response.json().catch(() => ({}));
                setStatus({
                    submitted: true,
                    success: false,
                    message: errorData.error || 'مشکلی در ارسال پیام رخ داد. لطفا دوباره تلاش کنید.'
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setStatus({
                submitted: true,
                success: false,
                message: 'مشکلی در ارتباط با سرور رخ داد. لطفا دوباره تلاش کنید.'
            });
        }
    };
    function getCsrfToken() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return value;
            }
        }
        return '';
    }
    
    return (
        <>
            <Navbar />
            <div className="breadcrumb-wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="text-center">
                                <h2 className="lg-title">تماس با ما</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="pt-5 padding-bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="row">
                                <div className="col-lg-12">
                                    <img src="/images/contact.jpg" alt="" className="img-fluid w-100" />
                                </div>
                            </div>

                            <div className="row justify-content-center">
                                <div className="col-lg-8">
                                    <p className="mt-5 mb-5">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز...</p>

                                    <h2 className="mb-4">در ارتباط باشید</h2>

                                    {status.submitted && (
                                        <div className={`alert ${status.success ? 'alert-success' : 'alert-danger'}`}>
                                            {status.message}
                                        </div>
                                    )}

                                    <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label htmlFor="name">نام (الزامی)</label>
                                                    <input 
                                                        className={`form-control form-control-name ${errors.name ? 'is-invalid' : ''}`}
                                                        name="name"
                                                        id="name"
                                                        type="text"
                                                        placeholder="نام"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="email">ایمیل (الزامی)</label>
                                                    <input
                                                        className={`form-control form-control-email ${errors.email ? 'is-invalid' : ''}`}
                                                        name="email"
                                                        id="email"
                                                        type="email"
                                                        placeholder="ایمیل"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="message">متن پیام شما</label>
                                                    <textarea
                                                        className={`form-control form-control-message ${errors.message ? 'is-invalid' : ''}`}
                                                        name="message"
                                                        id="message"
                                                        placeholder="..."
                                                        rows="7"
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        required
                                                    ></textarea>
                                                    {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                                                </div>

                                                <button
                                                    className="btn btn-primary solid blank mt-3"
                                                    type="submit"
                                                    disabled={status.submitted && !status.success}
                                                >
                                                    {status.submitted && !status.success ? 'در حال ارسال...' : 'ارسال پیام'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}