from django.urls import path
from .views import BlogPostListCreate,SearchPostsView, CommentListCreateView, LikePostView,PostContentView,contact_form_api, ShowTags,RandomBlogPostView
from . import views
from .admin_views import send_reply_view

urlpatterns = [
    path('posts-overview/', BlogPostListCreate.as_view(), name='post-list'),
    path('posts/<int:post_id>/', PostContentView.as_view(), name='post_content'),
    path('tags/', ShowTags.as_view(), name='tags'),
    path('like-post/<int:post_id>/', LikePostView.as_view(), name='like_post'),
    path('comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('posts/<int:post_id>/comments/', views.create_comment, name='create_comment'),
    path('random/', RandomBlogPostView.as_view(), name='random-blog-posts'),
    path('search/', SearchPostsView.as_view(), name='search_posts'),
    path('contact/', contact_form_api, name='contact_form_api'),

    path('admin/send_reply/<int:message_id>/', send_reply_view, name='admin_send_reply'),


]
