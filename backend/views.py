from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from django.http import FileResponse, Http404
from django.conf import settings
import os
from actas.models import Acta, Gestion
from actas.serializers import ActaSerializer, GestionSerializer
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser, FormParser

class LoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        correo = (request.data.get("correo") or request.data.get("email") or request.data.get("username") or "").strip().lower()
        password = request.data.get("password") or request.data.get("contraseña") or request.data.get("contrasena")
        if not correo or not password:
            return Response({"detail": "correo y password son requeridos"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(email__iexact=correo)
        except User.DoesNotExist:
            try:
                user = User.objects.get(username=correo)
            except User.DoesNotExist:
                return Response({"detail": "Credenciales inválidas"}, status=status.HTTP_400_BAD_REQUEST)
        if not user.check_password(password):
            return Response({"detail": "Credenciales inválidas"}, status=status.HTTP_400_BAD_REQUEST)
        token, _ = Token.objects.get_or_create(user=user)
        role = "admin" if user.is_staff else "user"
        return Response({
            "token": token.key,
            "role": role,
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
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
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        if user.is_staff or user in obj.participantes.all():
            return obj
        raise PermissionDenied("No tiene acceso a esta acta")

    def put(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied("Solo los administradores pueden modificar actas.")
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied("Solo los administradores pueden modificar actas.")
        return self.partial_update(request, *args, **kwargs)

class GestionCreateView(generics.CreateAPIView):
    serializer_class = GestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx.update({"request": self.request})
        return ctx

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def protected_media(request, filename):
    normalized_path = os.path.normpath(filename)
    full_path = os.path.join(settings.MEDIA_ROOT, normalized_path)
    if not full_path.startswith(os.path.abspath(settings.MEDIA_ROOT)):
        raise PermissionDenied("Acceso no autorizado al archivo")
    if not os.path.exists(full_path):
        raise Http404()
    return FileResponse(open(full_path, "rb"), as_attachment=False)
