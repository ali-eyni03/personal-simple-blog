from rest_framework.views import APIView
from rest_framework.response import Response
from .models import About
from .serializers import AboutSerializer

class AboutView(APIView):
    def get(self, request):
        about = About.objects.first()
        if about:
            serializer = AboutSerializer(about)
            return Response(serializer.data)
        return Response({"error": "No data found"}, status=404)
