from rest_framework import serializers
from .models import Acta, Compromiso, Gestion
from django.contrib.auth.models import User
import os

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "is_staff"]


class CompromisoSerializer(serializers.ModelSerializer):
    responsable = UserSerializer(read_only=True)
    responsable_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source="responsable", write_only=True, required=False
    )

    class Meta:
        model = Compromiso
        fields = ["id", "titulo", "descripcion", "responsable", "responsable_id", "fecha_vencimiento", "estado"]


class GestionSerializer(serializers.ModelSerializer):
    archivo = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = Gestion
        fields = ["id", "compromiso", "fecha", "descripcion", "archivo", "creado_por"]
        read_only_fields = ["creado_por"]

    def validate_archivo(self, value):
        if value:
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in [".pdf", ".jpg", ".jpeg"]:
                raise serializers.ValidationError("Solo se permiten archivos .pdf o .jpg")
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("El archivo no puede superar 5MB")
        return value

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user") and request.user.is_authenticated:
            validated_data["creado_por"] = request.user
        return super().create(validated_data)


class ActaSerializer(serializers.ModelSerializer):
    compromisos = CompromisoSerializer(many=True, read_only=True)
    participantes = UserSerializer(many=True, read_only=True)
    pdf = serializers.FileField(required=False, allow_null=True)
    pdf_path = serializers.SerializerMethodField()

    class Meta:
        model = Acta
        fields = ["id", "titulo", "descripcion", "estado", "fecha", "pdf", "pdf_path", "compromisos", "participantes"]

    def get_pdf_path(self, obj):
        return obj.pdf.name if obj.pdf else None

    def validate_pdf(self, value):
        if value:
            ext = os.path.splitext(value.name)[1].lower()
            if ext != ".pdf":
                raise serializers.ValidationError("Solo se permiten archivos PDF")
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("El archivo no puede superar 5MB")
        return value
