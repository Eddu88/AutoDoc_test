
# Sources: AutoDoc - BCPServer
---

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AutoDoc es un herramienta que automatiza la generación de documentación de los pases en JIRA del flujo SDLC y automatiza tareas manuales.

[AutoDoc Releases](https://bitbucket.lima.bcp.com.pe/projects/LKDVBCP/repos/bcpserver-autodoc-release/browse?at=refs%2Ftags%2Flatest)
# Contenido
---
1. [Prerequisitos](#prerequisitos)
1. [Clona el repositorio](#clona-el-repositorio)
1. [Compilar](#compilar)
1. [Ejecutar](#ejecutar)
1. [Publicar](#publicar)

<br>

# 1. Prerequisitos <a name="prerequisitos"></a>
---
  Para poder ejecutar el projecto es necesario tener instalado:

  - [Git](https://git-scm.com)
  - [.NET SDK](https://dotnet.microsoft.com/en-us/download)
  - [NodeJS](https://nodejs.org/en/download/)
  - [Visual Studio Code](https://code.visualstudio.com/) (Opcional)

<br>

# 2. Clona el repositorio <a name="clona-el-repositorio"></a>
---

  ```bash
    git clone https://bitbucket.lima.bcp.com.pe/projects/LKDVBCP/repos/bcpserver-autodoc-sources/
  ```

  Tendrás la siguiente estructura de carpetas:

  ```bash
  AutoDoc-BCPServer/
  ├── ClientApp
  ├── Controllers
  ├── Dto
  ├── Generator
  ├── Options
  ├── Responses
  ├── Services
  └── publish.bat
  ```

<br>

# 3. Compilar el projecto <a name="compilar"></a>
---

  ```bash
  dotnet build 
  ```
  Debemos optener un resultado satisfactorio, es posible que resulten warnings en la compilación.

<br>

# 4. Ejecutar <a name="ejecutar"></a>
---

  Una vez compilado puede ejecutarse el proyecto:
  
  ```bash
  dotnet run
  ```

  Esto iniciara el servidor de desarrollo: [http://localhost:5186](http://localhost:5186)

  > **Nota:** Se puede revisar todos los end-points expuestos por el servidor local en [http://localhost:5186/swagger](http://localhost:5186/swagger/index.html)

<br>

# 3. Publicar <a name="publicar"></a>
---
  
  Para construir el bundle del proyecto se tiene el siguente archivo .bat:

  ```bash
  AutoDoc-BCPServer/
  └── publish.bat
  ```

  La ejecución de este fichero se iniciaran las siguientes acciones:

  - Limpieza de la carpeta de salida:
  - Compilación del projecto ClientApp (mode=production)
  - Limpieza del projecto general
  - Generación del componente para distribución

  La carpeta de salida es la siguiente: `..\bcpserver-autodoc-release\BCPServer`.

