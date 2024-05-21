from rest_framework import  serializers
from core.models import Cliente
class SerializadorCliente(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Cliente
        fields = ['nombre', 'identificacion', 'correo', 'fecha_agregado', 'telefono', 'direccion']