# actas/views.py
from rest_framework import viewsets, permissions, serializers
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.http import FileResponse, Http404
from django.contrib.auth.decorators import login_required
from django.conf import settings
import os

from .models import Acta, Compromiso, Gestion, Usuario
from .serializers import ActaSerializer, CompromisoSerializer, GestionSerializer, UsuarioSerializer


class UsuarioViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAdminUser]


class CustomLoginView(ObtainAuthToken):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username,
            'rol': user.rol  
        })


class ActaViewSet(viewsets.ModelViewSet):
    queryset = Acta.objects.all()
    serializer_class = ActaSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['estado', 'fecha']
    search_fields = ['titulo']


class CompromisoViewSet(viewsets.ModelViewSet):
    queryset = Compromiso.objects.all()
    serializer_class = CompromisoSerializer
    permission_classes = [permissions.IsAuthenticated]


class GestionViewSet(viewsets.ModelViewSet):
    queryset = Gestion.objects.all()
    serializer_class = GestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        archivo = self.request.FILES.get('archivo')

        if archivo:
            if not archivo.name.endswith(('.pdf', '.jpg', '.jpeg')):
                raise serializers.ValidationError("El archivo debe ser PDF o JPG.")
            if archivo.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("El archivo no debe pesar más de 5MB.")

        serializer.save()


@login_required
def serve_protected_file(request, file_path):
    full_path = os.path.join(settings.MEDIA_ROOT, file_path)

    if os.path.exists(full_path):
        return FileResponse(open(full_path, 'rb'))
    else:
        raise Http404("Archivo no encontrado")
