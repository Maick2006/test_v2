from django.db import models
from django.contrib.auth.models import User

class Acta(models.Model):
    ESTADO_CHOICES = [
        ("abierta", "Abierta"),
        ("en_revision", "En revisión"),
        ("cerrada", "Cerrada"),
    ]
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    estado = models.CharField(max_length=30, choices=ESTADO_CHOICES, default="abierta")
    fecha = models.DateField()
    pdf = models.FileField(upload_to="actas_pdfs/", null=True, blank=True)
    participantes = models.ManyToManyField(User, related_name="actas")

    def __str__(self):
        return self.titulo


class Compromiso(models.Model):
    acta = models.ForeignKey(Acta, related_name="compromisos", on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    responsable = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_vencimiento = models.DateField(null=True, blank=True)
    estado = models.CharField(max_length=30, default="pendiente")

    def __str__(self):
        return f"{self.titulo} ({self.acta.titulo})"


class Gestion(models.Model):
    compromiso = models.ForeignKey(Compromiso, related_name="gestiones", on_delete=models.CASCADE)
    fecha = models.DateField()
    descripcion = models.TextField()
    archivo = models.FileField(upload_to="gestiones_files/", null=True, blank=True)
    creado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Gestión {self.id} - {self.compromiso.titulo}"
