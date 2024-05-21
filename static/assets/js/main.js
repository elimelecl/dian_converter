$( document ).ready( function() {
    //alert('funcionando')
} )

var id_cliente_seleccionado = null;

function getCookie(c_name) {
    if (document.cookie.length > 0) {
      c_start = document.cookie.indexOf(c_name + "=");
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1;
        c_end = document.cookie.indexOf(";", c_start);
        if (c_end == -1) c_end = document.cookie.length;
        return unescape(document.cookie.substring(c_start, c_end));
      }
    }
    return "";
  }


async function consultar_clientes() {
    let clientes = await $.ajax({
        url:'/clientes/clientes/',
        dataType:'json',
        type:'get',
    });
    return clientes;
}

function nuevo_cliente() {
    let html =  `
    <div class="creacion_modal">
    <!-- Small modal -->
    <button id="activador-modal" type="button" class="btn btn-primary" data-toggle="modal" data-target=".bs-example-modal-lg"></button>

    <div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">

        <div class="modal-header">
            <h4 class="modal-title" id="myModalLabel">Nuevo Cliente</h4>
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span>
            </button>
        </div>
        <div class="modal-body">
            <form>
                <div class="col-12">
                    <div class="form-group">
                        <label>Nombre</label>
                        <input id="nombre-cliente-inp" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <label>Identificacion</label>
                        <input id="identificacion-cliente-inp" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <label>Teléfono</label>
                        <input type="number" id="telefono-cliente-inp" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <label>Correo</label>
                        <input type="email" id="correo-cliente-inp" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <label>Dirección</label>
                        <input type="text" id="direccion-cliente-inp" class="form-control"/>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary cerrar-modal" data-dismiss="modal">Cancelar</button>
            <button type="button" onClick="guardar_cliente()" class="btn btn-primary">Guardar</button>
        </div>

        </div>
    </div>
    </div>
    <!-- /modals -->
    `
    $('.modales').html(html);
    $('#activador-modal').click();
}



async function guardar_cliente() {
    let nombre_cliente = $('#nombre-cliente-inp').val()
    let identificacion_cliente = $('#identificacion-cliente-inp').val()
    let correo_cliente = $('#identificacion-cliente-inp').val()
    let telefono_cliente = $('#identificacion-cliente-inp').val()
    let direccion_cliente = $('#identificacion-cliente-inp').val()
    let resp = await $.ajax({
        data:{
          'nombre':nombre_cliente,
          'identificacion':identificacion_cliente,
          'correo_cliente':correo_cliente,
          'telefono_cliente':telefono_cliente,
          'direccion_cliente':direccion_cliente
        },
        type:'post',
        dataType:'json',
        url:'/clientes/clientes/',
        headers:{'X-CSRFToken':getCookie('csrftoken')},
    });
    $('.cerrar-modal').click();
    $('#creacion_modal').remove();
    let html = `<tr class="even pointer">
    <td class=" ">${resp.identificacion}</td>
    <td class=" ">${resp.nombre}</td>
    <td class=" ">121000210 <i class="success fa fa-long-arrow-up"></i></td>
    <td class=" ">John Blank L</td>
    <td class=" ">Paid</td>
    <td class="a-right a-right ">$7.45</td>
    <td class=" last"><a href="#">View</a></td>
  </tr>`
  $('#cuerpo-tabla-clientes').prepend(html);
}

async function listar_clientes(){
    let clientes = await consultar_clientes();
    let tabla_clientes = `<table id="tabla-clientes" class="table table-striped jambo_table bulk_action">
    <thead>
      <tr class="headings">
      <th class="column-title">Fecha</th>
        <th class="column-title">Identificacion </th>
        <th class="column-title">Nombre</th>
        <th class="column-title">Correo </th>
        <th class="column-title">Teléfono </th>
        <th class="column-title">Dirección </th>
        <th class="column-title"></th>
      </tr>
    </thead>
    <tbody id="cuerpo-tabla-clientes">
    ${clientes.map((cliente)=>{
        return `<tr class="even pointer">
        <td class=" ">${cliente.fecha_agregado?cliente.fecha_agregado.split('T')[0]:''}</td>
        <td class=" ">${cliente.identificacion??''}</td>
        <td class=" ">${cliente.nombre??''}</td>
        <td class=" ">${cliente.correo??''}</td>
        <td class=" ">${cliente.telefono??''}</td>
        <td class=" ">${cliente.direccion??''}</td>
        <td class="last">
          <i style="font-size: 1rem;cursor: pointer;" onclick="vista_detalle_cliente(${cliente.identificacion})" class="fa fa-eye text-primary"></i>
          &nbsp;&nbsp;
          <i style="font-size: 1rem;cursor: pointer;" onclick="editar_cliente(${cliente.identificacion})" class="fa fa-edit text-warning"></i>
        </td>
      </tr>`
    }).join('')}
  </tbody>
  </table>`
$('.table-responsive').html(tabla_clientes);
}

function volver_lista_clientes(){
  $('#contenedor-principal').attr('hidden', false);
  $('#detalle-cliente').html('')
  $("#nuevo-cliente-btn").attr('hidden', false);
}


async function vista_detalle_cliente(id_cliente) {
  id_cliente_seleccionado= id_cliente;
    let data = await  $.ajax({
      data:{'id_cliente':id_cliente},
      url:'/detalle_cliente',
      dataType:'json',
      type:'get'
    });
    let html_detalle_cliente=`
    <div class="x_panel">
      <div onClick="volver_lista_clientes()" style="font-size: 1rem;cursor: pointer;" class="row btn font-weight-bold text-secondary"><i class="fa fa-arrow-left"></i>&nbsp; Volver</div>
      <section class="content invoice">
        <!-- title row -->
        <div class="row">
          <div class="  invoice-header">
            <h1>
                <i class="fa fa-user"></i> ${data.cliente.nombre}
            </h1>
          </div>
          <!-- /.col -->
        </div>
        <!-- info row -->
        <div class="row invoice-info">
          <div class="col-sm-4 invoice-col">
            <address>
                <strong>${data.cliente.direccion}</strong>
                <br>Phone: ${data.cliente.telefono}
                <br>Email: ${data.cliente.correo}
            </address>
          </div>
          <!-- /.col -->                       
        </div>
        <!-- /.row -->

        <!-- Table row -->
        <div class="row mb-3 w-100"><h3>Sesiones</h3></div>
        <div class="row">
          <div class="  table">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha Ingreso</th>
                  <th>Fecha Elaboracón</th>
                  <th>Folio</th>
                  <th>Base</th>
                  <th>Iva</th>
                  <th>Exc</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${data.entradas.length>0?data.entradas.map((ent)=>{
                  return `<tr>
                  <td>${ent.id}</td>
                  <td>${ent.sesion}</td>
                  <td>${ent.fecha_emision}</td>
                  <td>${ent.folio}</td>
                  <td>${ent.base}</td>
                  <td>${ent.iva}</td>
                  <td>${ent.exc}</td>
                  <td>Ver</td>
                </tr>`
                }).join(''):`<tr><td colspan="8"><div class="alert alert-secondary">Este Cliente aún no ha registrado ningún movimiento</div></td></tr>`}
                
              </tbody>
            </table>
          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->

        <div class="row">
          <!-- accepted payments column -->
          <!-- /.col -->
          <div class="col-md-6">
            <div class="row w-100 p-3"><h3>Cuentas Activas</h3><div class="ml-auto"><button onClick="modal_nueva_cuenta()" class="btn btn-secondary btn-sm"><i class="fa fa-plus"></i> Agregar</button></div></div>
            <div class="table-responsive"><table class="table">
                <thead>
                  <th>Tipo</th><th>Descipcion</th><th>Estado</th>
                </thead>
                <tbody id="body-cuentas-cliente">
                  ${data.cuentas_activas.length>0?`
                      ${data.cuentas_activas.map((ct)=>{
                        return `<tr>
                          <td>${ct.tipo_cuenta.nombre}</td>
                          <td>${ct.descripcion}</td>
                          <td id="td_btn_cuenta_${ct.id}">${boton_ativo(ct.id, ct.estado_activo)}</td>
                          </tr>`
                      }).join('')}`
                      :`<tr><div class="alert alert-secondary mensaje-cuenta-vacia"> No has agregado ninguna cuenta para este cliente</div></tr>`}
                </tbody>
              </table>
            </div>
          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->

        <!-- this row will not appear when printing -->
      </section>
  </div>`;
  $("#detalle-cliente").html(html_detalle_cliente);
  $("#detalle-cliente").attr('hidden', false);
  $("#contenedor-principal").attr('hidden', true);
  $("#nuevo-cliente-btn").attr('hidden', true);
}

function modal_cargar_excel() {
    $('.modales').html('');
    let html =  `
    <div class="creacion_modal">
    <!-- Small modal -->
    <div id="activador-modal" data-toggle="modal" data-target=".bs-example-modal-lg"></div>

    <div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
        <div class="modal-header">
            <h4 class="modal-title" id="myModalLabel">Cargar Archivo</h4>
        </div>
        <div class="modal-body">
            <form>
                <div class="col-12">
                    <div class="form-group">
                        <label>Cargar Archivo</label>
                        <input type="file" id="archivo-excel-inp" accept=".xlsx" class="form-control">
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary cerrar-modal" data-dismiss="modal">Cancelar</button>
            <button type="button" onClick="Upload()" class="btn btn-primary">Guardar</button>
        </div>
        </div>
    </div>
    </div>
    <!-- /modals -->
    `
    $('.modales').html(html);
    $('#activador-modal').click();
}

async function modal_nueva_cuenta() {
  let tipos_cuentas = await $.ajax({
    url:'/tipos_cuentas',
    type:'get',
    dataType:'json',
  });
  $('.modales').html('');
  let html =  `
  <div class="creacion_modal">
  <!-- Small modal -->
  <div id="activador-modal" data-toggle="modal" data-target=".bs-example-modal-lg"></div>
  <div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-lg">
      <div class="modal-content">
      <div class="modal-header">
          <h4 class="modal-title" id="myModalLabel">Nueva Cuenta</h4>
      </div>
      <div class="modal-body">
          <form>
            <div class="col-12">
              <div class="form-group">
                <label>Tipo de Cuenta</label>
                <select id="tipo-cuenta" class="form-control">
                  <option selected>Seleccione una opcion</option>
                  ${tipos_cuentas.map((tp)=>{
                    return `<option value="${tp.id}">${tp.nombre}</option>`
                  }).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Descripcion</label>
                <textarea class="form-control" id="descripcion-nueva-cuenta"></textarea>
              </div>
            </div>
        </form>
      </div>
      <div class="modal-footer">
          <button type="button" class="btn btn-secondary cerrar-modal" data-dismiss="modal">Cancelar</button>
          <button type="button" onClick="guardar_tipo_cuenta()" class="btn btn-primary">Guardar</button>
      </div>
      </div>
  </div>
  </div>
  <!-- /modals -->
  `
  $('.modales').html(html);
  $('#activador-modal').click();
}
async function cambiar_estado_cuenta(id_cuenta, estado_actual) {
  let cambio_estado = await $.ajax({
    data:{'estado_actual':estado_actual, 'id_cuenta':id_cuenta},
    type:'post',
    dataType:'json',
    url:'/cambiar_estado_cuenta',
    headers:{'X-CSRFToken':getCookie('csrftoken')},
  });
  console.log(estado_actual)
  if (cambio_estado.estado == true && estado_actual == true) {
    $('#td_btn_cuenta_'+id_cuenta).html(boton_ativo(id_cuenta, false))
  }
  if (cambio_estado.estado == true && estado_actual == false) {
    $('#td_btn_cuenta_'+id_cuenta).html(boton_ativo(id_cuenta, true))
  }
}
function boton_ativo(id_cuenta, estado_actual) {
  if (estado_actual == true) {
    return `<button onclick="cambiar_estado_cuenta(${id_cuenta}, ${estado_actual})" class="btn btn-success btn-sm"><i class="fa fa-check"></i> Activo</button>`;
  }
  return `<button onclick="cambiar_estado_cuenta(${id_cuenta}, ${estado_actual})"  class="btn btn-danger btn-sm"><i class="fa fa-times"></i>Inactivo</button>`;
}

async function guardar_tipo_cuenta() {
  let id_tipo_cuenta = $('#tipo-cuenta').val();
  let descripcion = $('#descripcion-nueva-cuenta').val()
  let resp = await $.ajax({
    data:{
      'id_tipo_cuenta':id_tipo_cuenta,
      'descripcion':descripcion,
      'id_cliente':id_cliente_seleccionado,
    },
    url:'/cuentas_contables_cliente',
    type:'post',
    dataType:'json',
    headers:{'X-CSRFToken':getCookie('csrftoken')},
  });

  $('#body-cuentas-cliente').prepend(`<tr>
  <td>${resp.tipo_cuenta.nombre}</td>
  <td>${resp.descripcion}</td>
  <td id="td_btn_cuenta_${resp.id}">${boton_ativo(resp.id, resp.estado_activo)}</td>
  </tr>`)
  $('.cerrar-modal').click();
  $('.mensaje-cuenta-vacia').attr('hidden', true);
}


async function Upload() {
  var fileUpload = document.getElementById("archivo-excel-inp");
  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
  if (regex.test(fileUpload.value.toLowerCase())) {
      if (typeof (FileReader) != "undefined") {
          var reader = new FileReader();
          if (reader.readAsBinaryString) {
              reader.onload = function (e) {
                  ProcessExcel(e.target.result);
              };
              reader.readAsBinaryString(fileUpload.files[0]);
          } else {
              reader.onload = function (e) {
                  var data = "";
                  var bytes = new Uint8Array(e.target.result);
                  for (var i = 0; i < bytes.byteLength; i++) {
                      data += String.fromCharCode(bytes[i]);
                  }
                  ProcessExcel(data);
              };
              reader.readAsArrayBuffer(fileUpload.files[0]);
          }
      } else {
          alert(" Este Navegador No Soporta HTML5.");
      }
  } else {
  alert("Por Favor Suba un Archivo Valido de Excel.");
  }
};
function ProcessExcel(data) {
    //Read the Excel File data.
  $('.modal-body').html('<h1>Recopilando Datos...</h1>')
  $('.modal-footer').hide()
    let workbook = XLSX.read(data, {type: 'binary'});
  //Fetch the name of First Sheet.
  let firstSheet = workbook.SheetNames[0];
  //Read all rows from First Sheet into an JSON array.
  let excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
  $('.modal-body').html('<h1>Guardando Los Datos...</h1>')
  console.log(excelRows)
  let salida = $.ajax({
          data:{'registros': JSON.stringify(excelRows)},
          headers: { "X-CSRFToken": getCookie("csrftoken") },
          url:"registrar_entrada/",
          type:'post',
          dataType:'json',
        });
console.log(salida)
return salida 
};
