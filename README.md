# Test Técnico - Gestión de Actas

## Backend (Django)
1. Crear entorno:
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

markdown
Copiar
Editar
2. Migrar y cargar demo:
python manage.py migrate
python manage.py seed_demo

markdown
Copiar
Editar
Usuarios demo:
- admin / adminpass (Administrador)
- base / basepass (Usuario Base)

3. Ejecutar:
python manage.py runserver

markdown
Copiar
Editar

## Frontend (React)
1. Entrar a carpeta `frontend` y ejecutar:
npm install
npm start

markdown
Copiar
Editar

