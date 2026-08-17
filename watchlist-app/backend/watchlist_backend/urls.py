from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from media_tracker.views import RegisterView
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("media_tracker.urls")),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
     path("api/auth/register/", RegisterView.as_view(), name="register"),
]

