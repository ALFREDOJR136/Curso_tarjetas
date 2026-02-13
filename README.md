# 🎓 Curso de Tarjetas, Microchips y Ciberseguridad

Este repositorio contiene los proyectos desarrollados durante un curso especializado en tarjetas inteligentes, microchips y ciberseguridad. Los proyectos combinan conceptos de criptografía clásica y sistemas de pago con tarjetas prepagadas.

## 📚 Contenido del Repositorio

### 1. 🔐 Cifrado César (`codigo_cesar.py`)

Implementación del clásico cifrado César, uno de los métodos de cifrado más antiguos y conocidos en criptografía.

**Características:**
- Cifrado y descifrado de mensajes con desplazamiento personalizable
- Validación de entrada robusta
- Interfaz de línea de comandos interactiva
- Soporte para mayúsculas y caracteres especiales

**Uso:**
```bash
python codigo_cesar.py
```

**Ejemplo:**
```
Introduce el mensaje a cifrar: Hola Mundo
Introduce el codigo: 5
Mensaje cifrado: MTQF RZSJT
```

---

### 2. 🎫 Sistema de Tarjetas de Festival (`Tarjetas_Festival/`)

Sistema completo de pago con tarjetas prepagadas diseñado para festivales y eventos cerrados. Permite a los organizadores gestionar tarjetas, usuarios y transacciones, mientras los asistentes realizan pagos de forma segura.

#### 🏗️ Estructura del Proyecto

```
Tarjetas_Festival/
├── Codigo/              
│   ├── organizer.py     
│   ├── bank_terminal.py 
│   ├── payment_terminal.py 
│   ├── database.py      
│   ├── errors.py        
│   └── demo.py         
└── Pagina_web/       
    ├── index.html       
    ├── styles.css     
    └── app.js          
```

#### 🎯 Características Principales

**Para Organizadores:**
- ✅ Crear usuarios del evento
- ✅ Emitir tarjetas prepagadas
- ✅ Recargar saldo en tarjetas
- ✅ Gestión completa del evento

**Para Usuarios:**
- ✅ Consultar saldo y historial
- ✅ Realizar pagos en stands y tiendas
- ✅ Usar tarjetas físicas del evento

**Seguridad:**
- 🔒 Tarjetas no reembolsables
- 🔒 Validación de saldo antes de cada pago
- 🔒 Registro completo de transacciones
- 🔒 Sistema de control de acceso por roles

#### 🚀 Ejecutar Demo del Backend

```bash
cd Tarjetas_Festival/Codigo
python demo.py
```

Esto ejecuta 3 escenarios de demostración:
1. **Ciclo de vida normal** - Crear usuario, emitir tarjeta, recargar y pagar
2. **Saldo insuficiente** - Validación de fondos
3. **Tarjeta inválida** - Manejo de errores

#### 🌐 Ejecutar Interfaz Web

1. Abrir `Tarjetas_Festival/Pagina_web/index.html` en un navegador
2. Usar el selector de modo para cambiar entre:
   - **Modo Usuario**: Consultar saldo y realizar pagos
   - **Modo Administrador**: Gestionar evento, crear usuarios y tarjetas

**Funcionalidades de la Web:**
- Interfaz interactiva con dos modos (Usuario/Administrador)
- Simulación de productos para compra
- Consulta de saldo en tiempo real
- Panel administrativo completo
- Diseño responsive y moderno

## 👨‍💻 Autor

Desarrollado como parte de un curso sobre tarjetas inteligentes, microchips y ciberseguridad.