from rest_framework import viewsets, permissions
from .models import Media
from .serializers import MediaSerializer
from rest_framework import generics
from .serializers import RegisterSerializer
from django.contrib.auth.models import User




class MediaViewSet(viewsets.ModelViewSet):
    """
    CRUD for the current user's watchlist items.

    GET    /api/media/          -> list (optionally ?status=WATCHED|UNWATCHED)
    POST   /api/media/          -> create
    GET    /api/media/<id>/     -> retrieve
    PATCH  /api/media/<id>/     -> partial update (e.g. rating)
    DELETE /api/media/<id>/     -> delete
    """

    serializer_class = MediaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Media.objects.filter(owner=self.request.user)
        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param.upper())
        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]