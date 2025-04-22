from django.contrib import admin
from django import forms
from .models import Comment, BlogPost, ContactMessage
from django.utils.html import format_html
from django.core.mail import send_mail
from django.conf import settings

class ReplyForm(forms.ModelForm):
    reply_content = forms.CharField(widget=forms.Textarea, required=False, 
                                    label="Reply to this comment")
    
    class Meta:
        model = Comment
        fields = ['is_approved', 'reply_content']

class CommentInline(admin.TabularInline):
    model = Comment
    fields = ('user', 'name', 'email', 'content', 'created_at', 'is_approved')
    readonly_fields = ('user', 'name', 'email', 'content', 'created_at')
    extra = 0
    max_num = 0  
    verbose_name = "Reply"
    verbose_name_plural = "Replies"
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if self.parent_obj:  
            return qs.filter(parent_comment=self.parent_obj)
        return qs.none()

    def get_formset(self, request, obj=None, **kwargs):
        self.parent_obj = obj 
        if obj and obj.parent_comment: 
            self.max_num = 0
        return super().get_formset(request, obj, **kwargs)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('comment_summary', 'post_title', 'user_or_name', 'created_at', 'is_approved', 'has_replies')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('content', 'user__username', 'name', 'post__title')
    readonly_fields = ('created_at', 'post', 'user', 'name', 'email', 'parent_comment', 'content')
    actions = ['approve_comments']
    inlines = [CommentInline]
    form = ReplyForm
    
    def comment_summary(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    comment_summary.short_description = "Comment"
    
    def post_title(self, obj):
        return obj.post.title[:30] + '...' if len(obj.post.title) > 30 else obj.post.title
    post_title.short_description = "Post"
    
    def user_or_name(self, obj):
        return obj.user.username if obj.user else obj.name
    user_or_name.short_description = "Commenter"
    
    def has_replies(self, obj):
        return obj.replies.exists()
    has_replies.boolean = True
    has_replies.short_description = "Has Replies"
    
    def approve_comments(self, request, queryset):
        queryset.update(is_approved=True)
    approve_comments.short_description = "Approve selected comments"
    
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        
        reply_content = form.cleaned_data.get('reply_content')
        if reply_content:
            admin_reply = Comment(
                post=obj.post,
                user=request.user,  
                parent_comment=obj,
                content=reply_content,
                is_approved=True   
            )
            admin_reply.save()
    
    def response_change(self, request, obj):
        return super().response_change(request, obj)
    
    def get_fieldsets(self, request, obj=None):
        if obj is None:
            return [(None, {'fields': ('post', 'user', 'name', 'email', 'content', 'is_approved')})]
        
        if obj.parent_comment: 
            return [
                ('Reply Details', {'fields': ('content', 'is_approved', 'created_at')}),
                ('Original Comment', {
                    'fields': ('parent_comment', 'post'),
                    'classes': ('collapse',)
                }),
                ('User Information', {
                    'fields': ('user', 'name', 'email'),
                    'classes': ('collapse',)
                }),
            ]
        else: 
            return [
                ('Comment Details', {'fields': ('content', 'is_approved', 'created_at')}),
                ('Post Information', {'fields': ('post',)}),
                ('User Information', {
                    'fields': ('user', 'name', 'email'),
                    'classes': ('collapse',)
                }),
                ('Reply to this comment', {'fields': ('reply_content',)}),
            ]

class CommentInlineForPost(admin.TabularInline):
    model = Comment
    fields = ('user_or_name', 'content_preview', 'created_at', 'is_approved', 'has_replies')
    readonly_fields = ('user_or_name', 'content_preview', 'created_at', 'has_replies')
    extra = 0
    max_num = 0 
    
    def user_or_name(self, obj):
        return obj.user.username if obj.user else obj.name
    user_or_name.short_description = "Commenter"
    
    def content_preview(self, obj):
        return obj.content[:100] + '...' if len(obj.content) > 100 else obj.content
    content_preview.short_description = "Comment"
    
    def has_replies(self, obj):
        return obj.replies.exists()
    has_replies.boolean = True
    has_replies.short_description = "Has Replies"
    
    def get_queryset(self, request):
        qs = super(CommentInlineForPost, self).get_queryset(request)
        return qs.filter(parent_comment__isnull=True)

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    inlines = [CommentInlineForPost]
    list_display = ('title', 'author', 'jalali_created_at', 'total_comments', 'total_views')
    search_fields = ('title', 'content')
    filter_horizontal = ('tags',)

class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at', 'replied')
    readonly_fields = ('name', 'email', 'message', 'created_at')
    fields = ('name', 'email', 'message', 'reply', 'replied', 'created_at')

    def save_model(self, request, obj, form, change):
        if obj.reply and not obj.replied:
            try:
                send_mail(
                    subject="پاسخ به پیام شما",
                    message=obj.reply,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[obj.email],
                    fail_silently=False,
                )
                obj.replied = True 
            except Exception as e:
                self.message_user(request, f"خطا در ارسال ایمیل: {str(e)}", level='error')
        super().save_model(request, obj, form, change)
admin.site.register(ContactMessage, ContactMessageAdmin)