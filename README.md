
# 🌐 وبلاگ شخصی با Django و React

## 🚀 راه‌اندازی پروژه

### 🔧 راه‌اندازی بخش بک‌اند (Django)

1. ورود به پوشه‌ی `api`:

```bash
cd api
```

2. ساخت محیط مجازی و فعال‌سازی:

```bash
# ایجاد محیط مجازی
python -m venv env

# فعال‌سازی (ویندوز)
env\Scripts\activate

# فعال‌سازی (لینوکس یا مک)
source env/bin/activate
```

3. نصب کتابخانه‌های مورد نیاز:

```bash
pip install -r requirements.txt
```

4. انجام مایگریشن‌ها:

```bash
python manage.py makemigrations
python manage.py migrate
```

5. ساخت ادمین برای دسترسی به پنل مدیریت:

```bash
python manage.py createsuperuser
```

6. اجرای سرور بک-اند:

```bash
python manage.py runserver
```

> پنل مدیریت: http://127.0.0.1:8000/admin/

---

### 🎨 راه‌اندازی بخش فرانت‌اند (React)



1. نصب Dependency ها:

```bash
npm install
```

2. اجرای پروژه:

```bash
npm run dev
```

> آدرس پیش‌فرض: http://localhost:5173/

---


## 📄 لایسنس

این پروژه برای اهداف آموزشی ساخته شده و به صورت آزاد قابل استفاده است.

---

موفق باشید! 😉❤️
