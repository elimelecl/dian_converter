from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse,HttpResponseNotFound
from rest_framework import viewsets
from core.models import *
from core.serializadores import SerializadorCliente
import json
import datetime
# Create your views here.

def home(request):
    return render(request, 'cuentas/index.html')

def registrar_entrada(request):
    if request.method == 'POST':
        registros = json.loads(request.POST.get('registros', None))
        sesion = Sesion().save()
        salidas = []
        for registro in registros:
            id_cliente = registro.get('NIT Emisor', None)
            cliente = Cliente.objects.get(identificacion = id_cliente)
            entrada = Entrada(
                sesion = sesion,
                folio = registro.get('folio', None),
                fecha_emision = datetime.datetime.strptime(registro.get('Fecha Emisión'), '%d-%m-%Y'),
                emisor = cliente,
                base = registro.get('base', None),
                iva = registro.get('iva', None),
                exc = registro.get('exc', None),
            )
            entrada.save()
            cuentas_cliente = CuentaContableCliente.objects.filter(
                cliente = cliente,
                estado_activo = True,
            )
            for cuenta in cuentas_cliente:
                salida = LineaSalida(
                    entrada = entrada,
                    cuenta_contable_cliente = cuenta,
                ).save()
                salidas.append(salida.serializar())
    return JsonResponse(salidas, safe = False)

def vista_clientes(request):
    return render(request, 'clientes/index.html')

def detalle_cliente(request):
    id_cliente = request.GET.get('id_cliente', None)
    if not id_cliente:
        return HttpResponseNotFound('No se encontró el cliente')
    cliente = Cliente.objects.get(pk = id_cliente)
    entradas = Entrada.objects.filter(
        emisor = cliente
    )
    cuentas_activas = CuentaContableCliente.objects.filter(
        cliente = cliente
    )
    data = {
        'cliente':cliente.serializar(),
        'entradas':[entrada.serializar() for entrada in entradas],
        'cuentas_activas':[cuenta.serializar() for cuenta in cuentas_activas],
    }
    return JsonResponse(data, safe=False)
class ClientesViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = SerializadorCliente

def tipos_cuentas(request):
    cuentas = TipoCuentaContable.objects.filter(
        estado_activo = True
    )
    return JsonResponse([ct.serializar() for ct in cuentas], safe=False)

def cambiar_estado_cuenta(request):
    if request.method == 'POST':
        estado_actual = request.POST.get('estado_actual', None)
        id_cuenta = request.POST.get('id_cuenta', None)
        cuenta = CuentaContableCliente.objects.get(id = id_cuenta)
        if estado_actual == 'true' or estado_actual == True:
            cuenta.estado_activo = False
        else:
            cuenta.estado_activo = True
        cuenta.save()
        return JsonResponse({'estado':True}, safe=False)
def cuentas_contables_cliente(request):
    if request.method == 'POST':
        id_tipo_cuenta = request.POST.get('id_tipo_cuenta', None)
        tipo_cuenta = TipoCuentaContable.objects.get(id = id_tipo_cuenta)
        descripcion = request.POST.get('descripcion', None)
        id_cliente = request.POST.get('id_cliente', None)
        cliente = Cliente.objects.get(identificacion=id_cliente)
        nueva_cuenta= CuentaContableCliente(
            tipo_cuenta_contable = tipo_cuenta,
            cliente = cliente,
            descripcion = descripcion,
        )
        nueva_cuenta.save()
        return JsonResponse(nueva_cuenta.serializar(), safe=False)
    if request.method == 'GET':
        id_cliente = request.GET.get('id_cliente', None)
        if id_cliente:
            cliente = Cliente.objects.get(identificacion = id_cliente)
            cuentas = CuentaContableCliente.objects.filter(cliente = cliente)
            return JsonResponse([cuenta.serializar() for cuenta in cuentas], safe=False)

