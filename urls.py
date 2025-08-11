from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from actas.views import LoginView, ActaListView, ActaDetailView, GestionCreateView, protected_media

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/login/', LoginView.as_view(), name='login'),
    path('api/actas/', ActaListView.as_view(), name='actas-list'),
    path('api/actas/<int:pk>/', ActaDetailView.as_view(), name='acta-detail'),
    path('api/gestiones/', GestionCreateView.as_view(), name='gestion-create'),
    path('media/<str:filename>/', protected_media, name='protected-media'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
