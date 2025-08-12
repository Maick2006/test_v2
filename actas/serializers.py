from rest_framework import serializers
from actas.models import Acta, Gestion

class ActaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Acta
        fields = "__all__"

class GestionSerializer(serializers.ModelSerializer):
    archivo = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = Gestion
        fields = "__all__"

    def validate_archivo(self, value):
        if value:
            ext = value.name.split('.')[-1].lower()
            if ext not in ['pdf', 'jpg', 'jpeg']:
                raise serializers.ValidationError("Solo se permiten archivos PDF o JPG.")
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("El archivo no debe superar los 5MB.")
        return value
