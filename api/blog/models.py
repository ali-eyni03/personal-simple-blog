from django.db import models
from django_ckeditor_5.fields import CKEditor5Field
from django_jalali.db import models as jmodels
from django.utils import timezone
import jdatetime
from django.contrib.auth import get_user_model

User = get_user_model()

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    count = models.SmallIntegerField(default=0)
    def __str__(self):
        return self.name

def get_empty_list():
    return []

class BlogPost(models.Model):
    title = models.TextField()
    author = models.CharField(max_length=200, default='ali')
    post_cover = models.ImageField()
    content = CKEditor5Field('Content', config_name='extends')
    jalali_created_at = jmodels.jDateField(default=jdatetime.date.today)
    tags = models.ManyToManyField(Tag, related_name="posts", blank=True)
    likes = models.ManyToManyField(User, related_name="liked_posts", blank=True)
    liked_ips = models.JSONField(default=get_empty_list,editable=False)
    
    def total_views(self):
        return self.views.count()
    
    def total_likes(self):
        return len(self.liked_ips)

    def is_liked_by_ip(self, ip_address):
        return ip_address in self.liked_ips
        
    def total_comments(self):
        return self.comments.count()
        
    def __str__(self):
        return self.title

class PostView(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name="views")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    ip_address = models.CharField(max_length=100)
    viewed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"View by {self.user or 'Anonymous'} on {self.post.title}"
    
class Comment(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments", null=True, blank=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    parent_comment = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="replies"
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False) 

    def __str__(self):
        if self.user:
            return f"Comment by {self.user.username} on {self.post.title}"
        return f"Comment by {self.name} on {self.post.title}"
        
    @property
    def is_reply(self):
        return self.parent_comment is not None

    @property
    def get_replies(self):
        return self.replies.all().order_by('created_at')
        
    class Meta:
        ordering = ["-created_at"]
        

class ContactMessage(models.Model):
    name = models.CharField(max_length=100, verbose_name="نام")
    email = models.EmailField(verbose_name="ایمیل")
    message = models.TextField(verbose_name="پیام")
    reply = models.TextField(blank=True, null=True)
    replied = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")

    def __str__(self):
        return f"پیام از {self.name}"