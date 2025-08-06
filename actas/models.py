from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings


class Usuario(AbstractUser):
    ROL_CHOICES = [
        ('admin', 'Administrador'),
        ('usuario', 'Usuario'),
    ]
    rol = models.CharField(max_length=10, choices=ROL_CHOICES, default='usuario')

    
class Acta(models.Model):
    ESTADOS = (
        ('abierta', 'Abierta'),
        ('cerrada', 'Cerrada'),
        ('en progreso', 'En Progreso'),
    )

    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    fecha = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADOS, default='abierta')
    participantes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='actas_participa')
    creador = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='actas_creadas')
    archivo_pdf = models.FileField(upload_to='actas_pdfs/', null=True, blank=True)

    def __str__(self):
        return self.titulo


class Compromiso(models.Model):
    acta = models.ForeignKey(Acta, on_delete=models.CASCADE, related_name='compromisos')
    descripcion = models.TextField()
    responsable = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    fecha_limite = models.DateField()

    def __str__(self):
        return f"{self.descripcion} ({self.responsable})"


class Gestion(models.Model):
    compromiso = models.ForeignKey(Compromiso, on_delete=models.CASCADE, related_name='gestiones')
    descripcion = models.TextField()
    fecha = models.DateField()
    archivo = models.FileField(upload_to='gestiones/', null=True, blank=True)

    def __str__(self):
        return f"Gestión {self.id} de {self.compromiso}"
