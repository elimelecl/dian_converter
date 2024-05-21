from django.contrib import admin
from core.models import *
# Register your models here.

admin.site.register(Cliente)
admin.site.register(TipoCuentaContable)
admin.site.register(CuentaContableCliente)
admin.site.register(TipoDocumento)
admin.site.register(Sesion)
admin.site.register(Entrada)