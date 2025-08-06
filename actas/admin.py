from django.contrib import admin
from .models import Usuario, Acta, Compromiso, Gestion

admin.site.register(Usuario)
admin.site.register(Acta)
admin.site.register(Compromiso)
admin.site.register(Gestion)
