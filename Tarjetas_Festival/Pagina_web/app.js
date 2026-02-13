// ==================== CLASES DEL SISTEMA ====================

class Tarjeta {
    static contadorId = 1;

    constructor() {
        this.id = `TC${String(Tarjeta.contadorId++).padStart(6, '0')}`;
        this.saldo = 0;
        this.activa = false;
    }

    pagar(cantidad, concepto) {
        if (!this.activa) throw new Error('La tarjeta no está activa. El evento debe estar en curso.');
        if (cantidad <= 0) throw new Error('La cantidad debe ser mayor a cero.');
        if (this.saldo < cantidad) throw new Error(`Saldo insuficiente. Saldo actual: €${this.saldo.toFixed(2)}, Se requiere: €${cantidad.toFixed(2)}`);
        
        this.saldo -= cantidad;
        return true;
    }

    añadirSaldo(cantidad) {
        if (cantidad <= 0) throw new Error('La cantidad debe ser mayor a cero.');
        this.saldo += cantidad;
        return true;
    }

    consultarSaldo() {
        return {
            id: this.id,
            saldo: this.saldo,
            activa: this.activa
        };
    }

    activar() {
        this.activa = true;
    }

    desactivar() {
        this.activa = false;
    }
}

class Admin {
    crearTarjeta() {
        return new Tarjeta();
    }

    recargarTarjeta(tarjeta, cantidad) {
        if (cantidad <= 0) throw new Error('La cantidad debe ser mayor a cero.');
        tarjeta.añadirSaldo(cantidad);
        return true;
    }

    consultarSaldoTarjeta(tarjeta) {
        return tarjeta.consultarSaldo();
    }
}

class Evento {
    constructor() {
        this.tarjetas = [];
        this.iniciado = false;
    }

    agregarTarjeta(tarjeta) {
        this.tarjetas.push(tarjeta);
    }

    iniciarEvento() {
        if (this.iniciado) throw new Error('El evento ya está en curso.');
        this.tarjetas.forEach(tarjeta => tarjeta.activar());
        this.iniciado = true;
        return true;
    }

    finalizarEvento() {
        if (!this.iniciado) throw new Error('El evento no está iniciado.');
        this.tarjetas.forEach(tarjeta => tarjeta.desactivar());
        this.iniciado = false;
        return true;
    }

    obtenerTarjetaPorId(id) {
        return this.tarjetas.find(t => t.id === id);
    }
}

class Transaccion {
    constructor(tarjetaId, cantidad, tipo, concepto = '') {
        this.fecha = new Date();
        this.tarjetaId = tarjetaId;
        this.cantidad = cantidad;
        this.tipo = tipo;
        this.concepto = concepto;
    }

    obtenerInfo() {
        return {
            fecha: this.fecha.toLocaleString('es-ES'),
            tarjetaId: this.tarjetaId,
            cantidad: this.cantidad,
            tipo: this.tipo,
            concepto: this.concepto
        };
    }
}

// ==================== PRODUCTOS Y VARIABLES GLOBALES ====================

const PRODUCTOS = [
    { nombre: 'Hamburguesa', precio: 8 },
    { nombre: 'Hot Dog', precio: 6 },
    { nombre: 'Pizza Slice', precio: 5 },
    { nombre: 'Agua', precio: 2 },
    { nombre: 'Cerveza', precio: 4 },
    { nombre: 'Refresco', precio: 3 },
    { nombre: 'Ron-Cola', precio: 7 },
    { nombre: 'Aquarius', precio: 3 }
];

const admin = new Admin();
const evento = new Evento();
const transacciones = [];

// ==================== FUNCIONES DE UI ====================

function mostrarMensaje(texto, tipo = 'info') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = texto;
    messageDiv.className = `message ${tipo} show`;
    setTimeout(() => messageDiv.classList.remove('show'), 5000);
}

function cambiarModo(modo) {
    ['btn-modo-usuario', 'btn-modo-admin'].forEach(id => 
        document.getElementById(id).classList.toggle('active', id.includes(modo))
    );
    
    ['modo-usuario', 'modo-admin'].forEach(id => 
        document.getElementById(id).classList.toggle('active', id.includes(modo))
    );
    
    if (modo === 'usuario') {
        actualizarDropdownUsuario();
    } else {
        actualizarListaTarjetas();
        actualizarDropdownsAdmin();
    }
}

function actualizarDropdowns(selectId) {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">-- Seleccione una tarjeta --</option>';
    
    evento.tarjetas.forEach(tarjeta => {
        const option = document.createElement('option');
        option.value = tarjeta.id;
        option.textContent = `${tarjeta.id} (Saldo: €${tarjeta.saldo.toFixed(2)})`;
        select.appendChild(option);
    });
}

function actualizarDropdownUsuario() {
    actualizarDropdowns('usuario-tarjeta-select');
}

function actualizarDropdownsAdmin() {
    ['admin-recargar-select', 'admin-consultar-select'].forEach(actualizarDropdowns);
}

function generarProductos() {
    const grid = document.getElementById('productos-grid');
    grid.innerHTML = PRODUCTOS.map(p => `
        <button class="producto-btn" onclick="realizarPagoProducto('${p.nombre}', ${p.precio})">
            <div class="producto-nombre">${p.nombre}</div>
            <div class="producto-precio">€${p.precio.toFixed(2)}</div>
        </button>
    `).join('');
}

function mostrarSaldo(displayId, amountId, estadoId, info) {
    document.getElementById(amountId).textContent = `€${info.saldo.toFixed(2)}`;
    document.getElementById(estadoId).innerHTML = `
        <div style="margin-top: 10px;">
            <p><strong>ID:</strong> ${info.id}</p>
            <p><strong>Estado:</strong> ${info.activa ? 
                '<span class="badge badge-success">Activa</span>' : 
                '<span class="badge badge-secondary">Inactiva</span>'}</p>
        </div>
    `;
    document.getElementById(displayId).style.display = 'block';
}

// ==================== FUNCIONES MODO USUARIO ====================

function consultarSaldoUsuario() {
    const tarjetaId = document.getElementById('usuario-tarjeta-select').value;
    if (!tarjetaId) return mostrarMensaje('Por favor, seleccione una tarjeta.', 'error');

    const tarjeta = evento.obtenerTarjetaPorId(tarjetaId);
    if (!tarjeta) return mostrarMensaje('Tarjeta no encontrada.', 'error');

    mostrarSaldo('saldo-display-usuario', 'saldo-amount-usuario', 'estado-tarjeta-usuario', tarjeta.consultarSaldo());
    mostrarMensaje('Consulta realizada correctamente.', 'success');
}

function realizarPagoProducto(nombreProducto, precio) {
    const tarjetaId = document.getElementById('usuario-tarjeta-select').value;
    if (!tarjetaId) return mostrarMensaje('Por favor, seleccione una tarjeta antes de realizar el pago.', 'error');

    const tarjeta = evento.obtenerTarjetaPorId(tarjetaId);
    if (!tarjeta) return mostrarMensaje('Tarjeta no encontrada.', 'error');

    try {
        tarjeta.pagar(precio, nombreProducto);
        transacciones.push(new Transaccion(tarjetaId, precio, 'pago', nombreProducto));
        
        mostrarMensaje(`✅ Pago exitoso: ${nombreProducto} (€${precio.toFixed(2)}). Saldo restante: €${tarjeta.saldo.toFixed(2)}`, 'success');
        
        if (document.getElementById('saldo-display-usuario').style.display === 'block') {
            consultarSaldoUsuario();
        }
        actualizarDropdownUsuario();
    } catch (error) {
        mostrarMensaje(`❌ ${error.message}`, 'error');
    }
}

// ==================== FUNCIONES MODO ADMIN ====================

function crearTarjetaAdmin() {
    try {
        const tarjeta = admin.crearTarjeta();
        evento.agregarTarjeta(tarjeta);
        
        if (evento.iniciado) tarjeta.activar();
        
        actualizarListaTarjetas();
        actualizarDropdownsAdmin();
        actualizarDropdownUsuario();
        mostrarMensaje(`✅ Tarjeta creada exitosamente: ${tarjeta.id}`, 'success');
    } catch (error) {
        mostrarMensaje(`❌ Error: ${error.message}`, 'error');
    }
}

function recargarTarjetaAdmin() {
    const tarjetaId = document.getElementById('admin-recargar-select').value;
    const cantidad = parseFloat(document.getElementById('admin-recargar-cantidad').value);
    
    if (!tarjetaId) return mostrarMensaje('Por favor, seleccione una tarjeta.', 'error');
    if (isNaN(cantidad) || cantidad <= 0) return mostrarMensaje('Por favor, ingrese una cantidad válida mayor a cero.', 'error');

    const tarjeta = evento.obtenerTarjetaPorId(tarjetaId);
    if (!tarjeta) return mostrarMensaje('Tarjeta no encontrada.', 'error');

    try {
        admin.recargarTarjeta(tarjeta, cantidad);
        transacciones.push(new Transaccion(tarjetaId, cantidad, 'recarga', 'Recarga administrativa'));
        
        actualizarListaTarjetas();
        actualizarDropdownsAdmin();
        actualizarDropdownUsuario();
        mostrarMensaje(`✅ Recarga exitosa de €${cantidad.toFixed(2)}. Nuevo saldo: €${tarjeta.saldo.toFixed(2)}`, 'success');
        document.getElementById('admin-recargar-cantidad').value = '';
    } catch (error) {
        mostrarMensaje(`❌ Error: ${error.message}`, 'error');
    }
}

function consultarSaldoAdmin() {
    const tarjetaId = document.getElementById('admin-consultar-select').value;
    if (!tarjetaId) return mostrarMensaje('Por favor, seleccione una tarjeta.', 'error');

    const tarjeta = evento.obtenerTarjetaPorId(tarjetaId);
    if (!tarjeta) return mostrarMensaje('Tarjeta no encontrada.', 'error');

    mostrarSaldo('saldo-display-admin', 'saldo-amount-admin', 'estado-tarjeta-admin', admin.consultarSaldoTarjeta(tarjeta));
    mostrarMensaje('Consulta realizada correctamente.', 'success');
}

function verTransaccionesAdmin() {
    const container = document.getElementById('transacciones-container');
    
    if (transacciones.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No hay transacciones registradas.</p>';
        return mostrarMensaje('No hay transacciones para mostrar.', 'info');
    }

    container.innerHTML = transacciones.map(t => {
        const info = t.obtenerInfo();
        const signo = info.tipo === 'recarga' ? '+' : '-';
        const color = info.tipo === 'recarga' ? '#28a745' : '#dc3545';
        
        return `
            <div class="transaccion-item ${info.tipo}">
                <div class="transaccion-header">
                    <span class="transaccion-tipo">${info.tipo}</span>
                    <span class="transaccion-cantidad" style="color: ${color};">${signo}€${info.cantidad.toFixed(2)}</span>
                </div>
                <p><strong>Tarjeta:</strong> ${info.tarjetaId}</p>
                <p><strong>Concepto:</strong> ${info.concepto}</p>
                <p><strong>Fecha:</strong> ${info.fecha}</p>
            </div>
        `;
    }).reverse().join('');
    
    mostrarMensaje(`📊 Mostrando ${transacciones.length} transacciones.`, 'info');
}

function actualizarListaTarjetas() {
    const container = document.getElementById('tarjetas-container');
    
    if (evento.tarjetas.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No hay tarjetas creadas. Use el botón "Crear Nueva Tarjeta" para comenzar.</p>';
        return;
    }

    container.innerHTML = evento.tarjetas.map(t => `
        <div class="tarjeta-item ${!t.activa ? 'inactiva' : ''}">
            <div class="tarjeta-id">${t.id}</div>
            <div class="tarjeta-saldo">€${t.saldo.toFixed(2)}</div>
            <div class="tarjeta-estado">
                ${t.activa ? 
                    '<span class="badge badge-success">Activa</span>' : 
                    '<span class="badge badge-secondary">Inactiva</span>'}
            </div>
        </div>
    `).join('');
}

function iniciarEvento() {
    if (evento.tarjetas.length === 0) {
        return mostrarMensaje('No hay tarjetas creadas. Cree al menos una tarjeta antes de iniciar el evento.', 'error');
    }

    try {
        evento.iniciarEvento();
        document.getElementById('evento-estado-texto').textContent = 'Activo';
        document.getElementById('btn-iniciar-evento').style.display = 'none';
        document.getElementById('btn-finalizar-evento').style.display = 'inline-block';
        actualizarListaTarjetas();
        mostrarMensaje('✅ Evento activado. Todas las tarjetas han sido activadas.', 'success');
    } catch (error) {
        mostrarMensaje(`❌ Error: ${error.message}`, 'error');
    }
}

function finalizarEvento() {
    try {
        evento.finalizarEvento();
        document.getElementById('evento-estado-texto').textContent = 'Inactivo';
        document.getElementById('btn-iniciar-evento').style.display = 'inline-block';
        document.getElementById('btn-finalizar-evento').style.display = 'none';
        actualizarListaTarjetas();
        mostrarMensaje('✅ Evento desactivado. Todas las tarjetas han sido desactivadas.', 'success');
    } catch (error) {
        mostrarMensaje(`❌ Error: ${error.message}`, 'error');
    }
}

// ==================== INICIALIZACIÓN ====================

window.addEventListener('DOMContentLoaded', () => {
    generarProductos();
    mostrarMensaje('Sistema de tarjetas prepago cargado. Los administradores deben crear tarjetas para comenzar.', 'info');
});
