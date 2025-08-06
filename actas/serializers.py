from rest_framework import serializers
from .models import Acta, Compromiso, Gestion, Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'rol']


class CompromisoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compromiso
        fields = '__all__'


class ActaSerializer(serializers.ModelSerializer):
    compromisos = CompromisoSerializer(many=True, read_only=True)

    class Meta:
        model = Acta
        fields = '__all__'


class GestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gestion
        fields = '__all__'

    def validate_archivo(self, archivo):
        max_size = 5 * 1024 * 1024  # 5MB
        valid_extensions = ['.pdf', '.jpg']

        if archivo.size > max_size:
            raise serializers.ValidationError("El archivo no debe superar los 5MB.")

        if not any(archivo.name.lower().endswith(ext) for ext in valid_extensions):
            raise serializers.ValidationError("Solo se permiten archivos PDF o JPG.")

        return archivo
