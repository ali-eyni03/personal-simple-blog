from rest_framework import serializers
from .models import BlogPost, Tag, Comment
import re
from django.utils.html import strip_tags

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['name']
        
class BlogPostSerializer(serializers.ModelSerializer):
    post_cover = serializers.SerializerMethodField()
    jalali_day_month = serializers.SerializerMethodField()
    tags = TagSerializer(many=True, read_only=True)
    summary = serializers.SerializerMethodField()
    total_likes = serializers.SerializerMethodField()
    liked_by_current_user = serializers.SerializerMethodField()
    total_comments = serializers.SerializerMethodField()

    def get_post_cover(self, obj):
        return obj.post_cover.url if obj.post_cover else None

    def convert_to_persian_numbers(self, text):
        persian_digits = "۰۱۲۳۴۵۶۷۸۹"
        english_digits = "0123456789"
        translation_table = str.maketrans(english_digits, persian_digits)
        return text.translate(translation_table)
    def get_jalali_day_month(self, obj):
        if obj.jalali_created_at:
            jalali_date = str(obj.jalali_created_at).split('-')

            months_dict = {
                "1": 'فروردین',
                "2": 'اردیبهشت',
                "3": 'خرداد',
                "4": 'تیر',
                "5": 'مرداد',
                "6": 'شهریور',
                "7": 'مهر',
                "8": 'آبان',
                "9": 'آذر',
                "10": 'دی',
                "11": 'بهمن',
                "12": 'اسفند',
            }

            try:
                year = self.convert_to_persian_numbers(jalali_date[0])
                month_number = str(int(jalali_date[1]))  # اصلاح این خط
                month = months_dict[month_number]
                day = self.convert_to_persian_numbers(jalali_date[2])
                return f"{day} {month} {year}"
            except (IndexError, KeyError):
                return "تاریخ نامعتبر"
            
        return None
    def get_summary(self, obj):
        plain_text = strip_tags(obj.content)
        words = re.findall(r'\S+', plain_text)
        return " ".join(words[:20]) + "..." if words else ""

    def get_total_likes(self, obj):
        return len(obj.liked_ips)

    def get_liked_by_current_user(self, obj):
        request = self.context.get('request')
        if request:
            ip_address = request.META.get('REMOTE_ADDR')
            return ip_address in obj.liked_ips
        return False

    def get_total_comments(self, obj):
        return obj.total_comments()

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'author', 'post_cover', 'content', 'jalali_day_month', 'tags', 'summary', 'total_likes', 'liked_by_current_user', 'total_comments']


class BlogContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = '__all__'
        

class TagShowSerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()

    class Meta:
        model = Tag
        fields = ['id', 'name', 'post_count']

    def get_post_count(self, obj):
        return obj.posts.count()
    

class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    commenter_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'commenter_name', 'post', 'content', 'created_at', 'parent_comment', 'replies', 'name', 'email']
        extra_kwargs = {
            'email': {'write_only': True},  
        }

    def get_commenter_name(self, obj):
        """Returns either the username or the provided name."""
        if obj.user:
            return str(obj.user)
        return obj.name
        
    def get_replies(self, obj):
        """Recursively serialize replies."""
        if obj.is_reply:
            return None 
        replies = obj.get_replies
        return CommentSerializer(replies, many=True, context=self.context).data
        
    def create(self, validated_data):
        request = self.context.get('request')
        
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
            
        return Comment.objects.create(**validated_data)