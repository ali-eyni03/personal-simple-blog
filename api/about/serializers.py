from rest_framework import serializers
from .models import About, Gallery

class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = ["image", "title"]

class AboutSerializer(serializers.ModelSerializer):
    gallery = GallerySerializer(many=True)
    profile_pic = serializers.SerializerMethodField()
    def get_profile_pic(self, obj):
            return obj.get_profile_pic()
    class Meta:
        model = About
        fields = [
            "name",
            "bio",
            "how_you_describe_yourself",
            "profile_pic",
            "vision",
            "main_image",
            "site_logo",
            "social_facebook",
            "social_twitter",
            "social_instagram",
            "social_youtube",
            "gallery",
        ]
