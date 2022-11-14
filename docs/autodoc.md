
# AutoDoc
---

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AutoDoc es un herramienta que automatiza la generación de documentación de los pases en JIRA del flujo SDLC y automatiza tareas manuales.

[AutoDoc-BCPServer Sources](https://bitbucket.lima.bcp.com.pe/projects/LKDVBCP/repos/bcpserver-autodoc-sources/browse)

![Logo-autotoken](./img/logo-auto-doc.png)

# Contenido
---

1. [WorkFlow](#workflow)
1. [¿Cómo usarlo?](#uso)
1. [Validaciones](#validaciones) 

# 1. WorkFlow <a name="workflow"></a>
---

  ![WorkFlowImg](./img/workflow.gif)

<br>

# 2. ¿Cómo usarlo? <a name="uso"></a>
---

Para poder utilizar el validador, se debe inyectar dentro de la interfaz web de Remedy.

1. Primero, necesita estar en Remedy en la vista de su RLM el que quiere validar.
    
    <br>

1. Es necesario abrir la consola de chrome: 

    ```bash
    CtrlShiftJ (on Windows) or CtrlOptionJ (on Mac).
    ```
    <br>

1. En la consola: ingresar y ejecutar lo siguiente:

    ```javascript
    await fetch(new Request('https://unpkg.com/legacy-checker/dist/main.js')).then(js => js.text()).then(js => eval(js));
    ```
    <br>
   
1. Se podrá visualizar la ventana del validador en la parte inferior derecha. Para iniciar la validación, dar click al botón **'Validar'**

<br>

# 3. Validaciones <a name="validaciones"></a>
---

- Valida que se tenga la plantilla correcta.
- Valida los datos del campo resumen:
    - App
    - TA
then(js => eval(js));

<br>


