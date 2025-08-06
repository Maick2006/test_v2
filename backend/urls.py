"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from rest_framework.routers import DefaultRouter
from actas.views import (
    UsuarioViewSet,
    ActaViewSet,
    CompromisoViewSet,
    GestionViewSet,
    CustomLoginView,
    serve_protected_file,
)
from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()
router.register('usuarios', UsuarioViewSet)
router.register('actas', ActaViewSet)
router.register('compromisos', CompromisoViewSet)
router.register('gestiones', GestionViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', CustomLoginView.as_view(), name='login'),  
    re_path(r'^media/(?P<file_path>.*)$', serve_protected_file),
]


urlpatterns += router.urls


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
