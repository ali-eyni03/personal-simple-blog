from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from .models import ContactMessage

@staff_member_required
def send_reply_view(request, message_id):
    contact = get_object_or_404(ContactMessage, id=message_id)
    
    if request.method == 'POST':
        reply_message = request.POST.get('reply_message')
        if reply_message:
            subject = f"پاسخ به پیام شما"
            email_message = f"""سلام {contact.name}،

{reply_message}

با تشکر،
تیم ما
"""
            try:
                send_mail(
                    subject,
                    email_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [contact.email],
                    fail_silently=False,
                )
                contact.is_answered = True
                contact.save()
                
                messages.success(request, f"پاسخ با موفقیت به {contact.email} ارسال شد.")
                return redirect('admin:your_app_name_contactmessage_changelist')  # Replace 'your_app_name' with your actual app name
            except Exception as e:
                messages.error(request, f"خطا در ارسال ایمیل: {str(e)}")
        else:
            messages.error(request, "متن پاسخ نمی‌تواند خالی باشد.")
    
    return render(request, 'admin/send_reply.html', {
        'contact': contact,
        'title': f'ارسال پاسخ به {contact.name}',
    })