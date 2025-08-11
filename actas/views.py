from rest_framework.views import APIView
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from django.http import FileResponse, Http404
from django.conf import settings
import os

from .models import Acta, Compromiso, Gestion
from .serializers import ActaSerializer, GestionSerializer


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        correo = (
            request.data.get("correo")
            or request.data.get("email")
            or request.data.get("username")
        )
        password = (
            request.data.get("password")
            or request.data.get("contraseña")
            or request.data.get("contrasena")
        )

        if not correo or not password:
            return Response(
                {"detail": "correo y password son requeridos"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=correo)
        except User.DoesNotExist:
            try:
                user = User.objects.get(username=correo)
            except User.DoesNotExist:
                return Response(
                    {"detail": "Credenciales inválidas"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if not user.check_password(password):
            return Response(
                {"detail": "Credenciales inválidas"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        token, _ = Token.objects.get_or_create(user=user)
        role = "Administrador" if user.is_staff else "Usuario Base"

        return Response(
            {
                "token": token.key,
                "role": role,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username,
                },
            }
        )


class ActaListView(generics.ListAPIView):
    serializer_class = ActaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Acta.objects.all().order_by("-fecha")
        user = self.request.user
        if not user.is_staff:
            qs = qs.filter(participantes=user)
        estado = self.request.query_params.get("estado")
        titulo = self.request.query_params.get("titulo")
        fecha = self.request.query_params.get("fecha")
        if estado:
            qs = qs.filter(estado__iexact=estado)
        if titulo:
            qs = qs.filter(titulo__icontains=titulo)
        if fecha:
            qs = qs.filter(fecha=fecha)
        return qs


class ActaDetailView(generics.RetrieveAPIView):
    serializer_class = ActaSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Acta.objects.all()

    def get_object(self):
        obj = super().get_object()
        if not self.request.user.is_staff and self.request.user not in obj.participantes.all():
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("No tiene acceso a este acta")
        return obj


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
    file_path = os.path.join(settings.MEDIA_ROOT, filename)
    if not os.path.exists(file_path):
        raise Http404()
    return FileResponse(open(file_path, "rb"), as_attachment=False)
