from rest_framework import routers
from django.urls import path, include
from core.views import *
router_clientes = routers.DefaultRouter()
router_clientes.register(r'clientes', ClientesViewSet)
