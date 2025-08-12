from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.http import FileResponse, Http404
from django.conf import settings
import os

from actas.models import Acta, Gestion
from actas.serializers import ActaSerializer, GestionSerializer

class LoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        correo = request.data.get("correo")
        password = request.data.get("password")

        if not correo or not password:
            return Response({"detail": "correo y password son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=correo, password=password)
        if not user:
            return Response({"detail": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)
        role = "admin" if user.is_staff else "user"
        return Response({
            "token": token.key,
            "role": role,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_staff": user.is_staff
            }
        })

class ActaListCreateView(generics.ListCreateAPIView):
    serializer_class = ActaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Acta.objects.all().order_by("-fecha")
        return Acta.objects.filter(participantes=user).order_by("-fecha")

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            raise PermissionDenied("Solo los administradores pueden crear actas.")
        serializer.save()

class ActaDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ActaSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Acta.objects.all()

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        if user.is_staff or user in obj.participantes.all():
            return obj
        raise PermissionDenied("No tienes permiso para ver esta acta")

    def perform_update(self, serializer):
        if not self.request.user.is_staff:
            raise PermissionDenied("Solo los administradores pueden modificar actas.")
        serializer.save()

class GestionCreateView(generics.CreateAPIView):
    serializer_class = GestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def protected_media(request, filename):
    filepath = os.path.normpath(os.path.join(settings.MEDIA_ROOT, filename))
    media_root_abs = os.path.abspath(settings.MEDIA_ROOT)
    filepath_abs = os.path.abspath(filepath)

    if not filepath_abs.startswith(media_root_abs):
        raise PermissionDenied("Acceso no autorizado al archivo")

    if not os.path.exists(filepath_abs):
        raise Http404()

    return FileResponse(open(filepath_abs, "rb"), as_attachment=False)
