from django.contrib import admin
from .models import Acta, Compromiso, Gestion

@admin.register(Acta)
class ActaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'estado', 'fecha')
    search_fields = ('titulo', 'estado')

admin.site.register(Compromiso)
admin.site.register(Gestion)
