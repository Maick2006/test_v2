"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path
from actas.views import LoginView, ActaListView, ActaDetailView, GestionCreateView, protected_media

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("actas/", ActaListView.as_view(), name="acta-list"),
    path("actas/<int:pk>/", ActaDetailView.as_view(), name="acta-detail"),
    path("gestiones/", GestionCreateView.as_view(), name="gestion-create"),
    path("media/<str:filename>/", protected_media, name="protected-media"),
]


