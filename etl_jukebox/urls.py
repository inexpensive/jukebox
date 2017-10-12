from . import views
"""jukebox URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin

urlpatterns = [
    url(r'^$', views.home),
    url(r'^search/.*$', views.search),
    url(r'^play/.*$', views.play),
    url(r'^admin/', admin.site.urls),
    url(r'^add/.*', views.add),
    url(r'^current/.*$', views.current_details),
    url(r'^playlist/.*$', views.playlist_details),
    url(r'^pause/.*$', views.pause),
    url(r'^skip/.*$', views.skip),
    url(r'^add_station/.*$', views.add_station),
    url(r'^add_next/.*$', views.add_next),
    url(r'^remove/.*$', views.remove_song),
]
