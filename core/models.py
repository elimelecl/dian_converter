from django.db import models

# Create your models here.

class TipoCuentaContable(models.Model):
    nombre = models.CharField(max_length=100)
    codigo = models.CharField(max_length=30, null = True)
    estado_activo = models.BooleanField(default=True)
    def __str__(self) -> str:
        return self.nombre
    def serializar(self):
        return {
            'id':self.id,
            'nombre':self.nombre,
            'codigo':self.codigo,
        }
class Cliente(models.Model):
    identificacion = models.CharField(max_length = 100, primary_key=True)
    nombre = models.CharField(max_length=50)
    fecha_agregado = models.DateTimeField(auto_now_add=True, null=True)
    correo = models.EmailField(null=True, blank=True)
    telefono = models.CharField(max_length=50, null=True, blank=True)
    direccion = models.CharField(max_length=100, null=True, blank=True)
    class Meta:
        ordering = ['-fecha_agregado']
    def __str__(self) -> str:
        return self.nombre
    def serializar(self):
        return {
            'id':self.identificacion,
            'nombre':self.nombre,
            'fecha_agregado':self.fecha_agregado,
            'identificacion':self.identificacion,
            'correo':self.correo,
            'telefono':self.telefono,
            'direccion':self.direccion,
        }
    def cuentas_contables(self):
        return [cuenta.serializar() for cuenta in CuentaContableCliente.objects.all()]
class CuentaContableCliente(models.Model):
    tipo_cuenta_contable = models.ForeignKey(TipoCuentaContable, on_delete = models.PROTECT)
    cliente = models.ForeignKey(Cliente, on_delete = models.CASCADE)
    descripcion = models.TextField(null = True)
    estado_activo = models.BooleanField(default = True)
    fecha_apertura = models.DateTimeField(auto_now_add=True)
    fecha_cierre = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f'{self.tipo_cuenta_contable.codigo} || {self.cliente.nombre} || {self.descripcion}'
    def serializar(self):
        return {
            'id':self.id,
            'tipo_cuenta':self.tipo_cuenta_contable.serializar(),
            'descripcion':self.descripcion,
            'estado_activo':self.estado_activo,
        }
class TipoDocumento(models.Model):
    nombre = models.CharField(max_length = 100)
    prefijo = models.CharField(max_length = 50)
    def __str__(self):
        return self.nombre

class Sesion(models.Model):
    timestamp = models.DateTimeField(auto_now_add = True)
    def __str__(self):
        return self.timestamp.__str__()

class Entrada(models.Model):
    """
        Es la información que ingresa el usuario. Se guarda con el fin de llevar control de la información procesada.
    """
    sesion = models.ForeignKey(Sesion, on_delete = models.CASCADE, null=True)
    timestamp = models.DateTimeField(auto_now_add=True, null=True)
    folio = models.CharField(max_length=50, null=True)
    fecha_emision = models.DateField(null=True)
    emisor = models.ForeignKey(Cliente, on_delete = models.CASCADE, null=True)
    base = models.FloatField(null=True)
    iva = models.FloatField(null=True)
    exc = models.FloatField(null = True)

    def __str__(self) -> str:
        return f'{self.id} ||  {self.timestamp.__str__()}'
    def serializar(self):
        return {
            'id':self.id,
            'folio':self.folio,
            'emisor':self.emisor.serializar(),
            'fecha_emision':self.fecha_emision.__str__(),
            'sesion':self.sesion.timestamp.strftime("%d/%m/%Y %H:%M"),
            'base':self.base,
            'iva':self.iva,
            'exc':self.exc,
        }

class LineaSalida(models.Model):
    entrada = models.ForeignKey(Entrada, on_delete = models.CASCADE) # De aqu´´i se debe extraer alginos campos por ejemplo:
    ## Consecutivo Comprobante, Fecha de Elaboraci´´on, Codigo Cuenta Contable, Idetificaci´´on Tercero
    cuenta_contable_cliente = models.ForeignKey(CuentaContableCliente, on_delete = models.CASCADE)
    debito = models.FloatField(default = 0, blank = True)
    credito = models.FloatField(default = 0, blank = True)
    observaciones = models.TextField(default = 0, blank = True)
    base_gravable = models.FloatField(default = 0, blank = True)
    base_extra = models.FloatField(default = 0, blank = True)
    mes_corriente = models.CharField(
        max_length=50,
        choices=(
            ('SI', 'SI'),
            ('NO', 'NO'),
        ),
        default='No',
    )
    def serializar(self):
        return {
            'id': self.id,
            'cuenta':self.cuenta_contable_cliente.serializar(),
            'debito':self.debito,
            'credito':self.credito,
            'observaciones':self.observaciones,
            'base_gravable':self.base_gravable,
            'base_extra':self.base_extra,
            'mes_corriente':self.mes_corriente,
        }

