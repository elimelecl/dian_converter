from django.db import models

# Create your models here.

class TipoCuentaContable(models.Model):
    nombre = models.CharField(max_length=100)
    codigo = models.CharField(max_length=30, null = True)
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
    def __str__(self) -> str:
        return self.nombre
    def serializar(self):
        return {
            'id':self.id,
            'nombre':self.nombre,
            'identificacion':self.identificacion,
        }
    def cuentas_contables(self):
        return [cuenta.serializar() for cuenta in CuentaContableCliente.objects.all()]
class CuentaContableCliente(models.Model):

    tipo_cuenta_contable = models.ForeignKey(TipoCuentaContable, on_delete = models.PROTECT)
    cliente = models.ForeignKey(Cliente, on_delete = models.CASCADE)
    descripcion = models.TextField(null = True)
    estado_activo = models.BooleanField(default = True)
    fecha_apertura = models.DateTimeField(auto_created=True)
    fecha_cierre = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f'{self.tipo_cuenta_contable.codifo} || {self.cliente.nombre} || {self.descripcion}'

class TipoDocumento(models.Model):
    nombre = models.CharField(max_length = 100)
    prefijo = models.CharField(max_length = 50)

    def __str__(self):
        return self.nombre

class Entrada(models.Model):
    """
        Es la información que ingresa el usuario. Se guarda con el fin de llevar control de la información procesada.
    """
    timestamp = models.DateTimeField(auto_created=True)
    folio = models.CharField(max_length=50)
    fecha_emision = models.DateField()
    emisor = models.ForeignKey(Cliente, on_delete = models.CASCADE)
    base = models.FloatField()
    iva = models.FloatField()
    exc = models.FloatField(null = True)

    def __str__(self) -> str:
        return f'{self.id} ||  {self.timestamp.__str__()}'

class LineaSalida(models.Model):
    entrada = models.ForeignKey(Entrada, on_delete = models.CASCADE) # De aqu´´i se debe extraer alginos campos por ejemplo:
    ## Consecutivo Comprobante, Fecha de Elaboraci´´on, Codigo Cuenta Contable, Idetificaci´´on Tercero
    cuenta_contable_cliente = models.ForeignKey(CuentaContableCliente, on_delete = models.CASCADE)
    debito = models.FloatField(null = True, blank = True)
    credito = models.FloatField(null = True, blank = True)
    observaciones = models.TextField(null = True, blank = True)
    base_gravable = models.FloatField(null = True, blank = True)
    base_extra = models.FloatField(null = True, blank = True)
    mes_corriente = models.CharField(
        max_length=50,
        choises = (
            ('SI', 'SI'),
            ('NO', 'NO'),
        )
    )

