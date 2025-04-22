from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("ckeditor5/", include('django_ckeditor_5.urls')),
    path('ckeditor/', include('ckeditor_uploader.urls')),
    path('api/blog/', include('blog.urls')),
    path('api/about/', include('about.urls')),
    path('custom-upload-file/', views.custom_upload_file, name='custom_upload_file'),
    
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
