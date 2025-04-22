
from rest_framework import generics
from .models import BlogPost
from .serializers import BlogPostSerializer, TagShowSerializer
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import BlogPost , Comment
from .serializers import BlogPostSerializer,CommentSerializer
from rest_framework.generics import RetrieveAPIView
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from . models import Tag,ContactMessage
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json
import random
from django.db.models import Q
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import render, redirect
from .forms import ContactForm
class BlogDetailView(RetrieveAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer

class PostContentView(APIView):
    def get(self , request,post_id):
        try:
            post = BlogPost.objects.get(id=post_id)
        except BlogPost.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = BlogPostSerializer(post,context={'request': request})
        return Response(serializer.data)
    
class BlogPostPagination(PageNumberPagination):
    page_size = 6 
    page_size_query_param = 'size' 
    max_page_size = 20 
    def get_paginated_response(self, data):
            return Response({
                'count': self.page.paginator.count,
                'total_pages': self.page.paginator.num_pages,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'results': data
            })
class BlogPostListCreate(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    pagination_class = BlogPostPagination  
    def get_queryset(self):
        queryset = BlogPost.objects.all().order_by("-jalali_created_at")
        
        tag_id = self.request.query_params.get('tag')
        if tag_id:
            queryset = queryset.filter(tags__id=tag_id)
            
        return queryset
class ShowTags(APIView):
    def get(self ,request):
        tags = Tag.objects.order_by('?')[:6] 
        serializer = TagShowSerializer(tags,many=True)
        return Response(serializer.data)
class LikePostView(APIView):
    def post(self, request, post_id):
        try:
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return Response({
                    'status': 'error',
                    'message': 'Invalid JSON'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            post = get_object_or_404(BlogPost, id=post_id)
            
            ip_address = request.META.get('REMOTE_ADDR')
            
            action = data.get('action')
            
            if action == 'like':
                if ip_address not in post.liked_ips:
                    post.liked_ips.append(ip_address)
                    
                    if request.user.is_authenticated:
                        post.likes.add(request.user)
                        
                    post.save()
                    return Response({
                        'status': 'liked', 
                        'total_likes': len(post.liked_ips)
                    })
                else:
                    return Response({
                        'status': 'already_liked', 
                        'total_likes': len(post.liked_ips)
                    })
                    
            elif action == 'unlike':
                if ip_address in post.liked_ips:
                    post.liked_ips.remove(ip_address)
                    
                    if request.user.is_authenticated:
                        post.likes.remove(request.user)
                        
                    post.save()
                    return Response({
                        'status': 'unliked', 
                        'total_likes': len(post.liked_ips)
                    })
                else:
                    return Response({
                        'status': 'not_liked', 
                        'total_likes': len(post.liked_ips)
                    })
            
            return Response({
                'status': 'error', 
                'message': 'Invalid action'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            

class CommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.filter(parent_comment__isnull=True) 
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  
        


@api_view(['POST'])
def create_comment(request, post_id):
    try:
        post = BlogPost.objects.get(id=post_id)
    except BlogPost.DoesNotExist:
        return Response({"error": "پست مورد نظر یافت نشد"}, status=status.HTTP_404_NOT_FOUND)
    
    data = {
        'post': post.id,
        'name': request.data.get('name'),
        'email': request.data.get('mail'), 
        'content': request.data.get('comment'),  
    }
    
    parent_id = request.data.get('parent_id')
    if parent_id:
        try:
            parent_comment = Comment.objects.get(id=parent_id)
            data['parent_comment'] = parent_id
        except Comment.DoesNotExist:
            return Response(
                {"error": "کامنت والد یافت نشد"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    serializer = CommentSerializer(data=data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RandomBlogPostView(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    
    def get_queryset(self):
        all_posts = list(BlogPost.objects.all())
        return random.sample(all_posts,min(3,len(all_posts)))
    
    
class SearchPostsView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        
        if not query:
            return Response(
                {"error": "Search query is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        posts = BlogPost.objects.filter(
            Q(title__icontains=query) | 
            Q(content__icontains=query) |
            Q(tags__name__icontains=query)
        ).distinct()
        
        serializer = BlogPostSerializer(posts, many=True)
        return Response(serializer.data)
    
    
    
def contact_view(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            message = form.save()
            
            send_mail(
                'پیام شما دریافت شد',
                f'سلام {message.name}، پیام شما با موفقیت ثبت شد. به زودی پاسخ می‌دهیم.',
                settings.DEFAULT_FROM_EMAIL,
                [message.email],
                fail_silently=False,
            )
            return redirect('contact_success')
    else:
        form = ContactForm()
    return render(request, 'contact.html', {'form': form})

@api_view(['POST'])
def contact_form_api(request):
    name = request.data.get('name')
    email = request.data.get('email')
    message = request.data.get('message')

    if not name or not email or not message:
        return Response({'error': 'تمام فیلدها الزامی هستند'}, status=400)

    ContactMessage.objects.create(
        name=name,
        email=email,
        message=message
    )

    return Response({'message': 'پیام دریافت شد'}, status=200)