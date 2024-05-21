# Generated by Django 5.0.4 on 2024-04-27 03:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Cliente',
            fields=[
                ('identificacion', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='TipoCuentaContable',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('codigo', models.CharField(max_length=30, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='TipoDocumento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('prefijo', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='CuentaContableCliente',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_apertura', models.DateTimeField(auto_created=True)),
                ('descripcion', models.TextField(null=True)),
                ('estado_activo', models.BooleanField(default=True)),
                ('fecha_cierre', models.DateTimeField(blank=True, null=True)),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.cliente')),
                ('tipo_cuenta_contable', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.tipocuentacontable')),
            ],
        ),
        migrations.CreateModel(
            name='Entrada',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_created=True)),
                ('folio', models.CharField(max_length=50)),
                ('fecha_emision', models.DateField()),
                ('base', models.FloatField()),
                ('iva', models.FloatField()),
                ('exc', models.FloatField(null=True)),
                ('emisor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.cliente')),
            ],
        ),
        migrations.CreateModel(
            name='LineaSalida',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('debito', models.FloatField(blank=True, null=True)),
                ('credito', models.FloatField(blank=True, null=True)),
                ('observaciones', models.TextField(blank=True, null=True)),
                ('base_gravable', models.FloatField(blank=True, null=True)),
                ('base_extra', models.FloatField(blank=True, null=True)),
                ('mes_corriente', models.CharField(choices=[('SI', 'SI'), ('NO', 'NO')], max_length=50)),
                ('cuenta_contable_cliente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.cuentacontablecliente')),
                ('entrada', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.entrada')),
            ],
        ),
    ]