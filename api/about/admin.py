from django.contrib import admin
from .models import About, Gallery

@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    list_display = ("name", "vision") 
    search_fields = ("name", "vision")

@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ("title", "image")
    search_fields = ("title",)
