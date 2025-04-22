from django.http import JsonResponse

def custom_upload_file(request):
    return JsonResponse({'message': 'File uploaded successfully'})