from django.conf.urls import url, include

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^create$', views.create, name='create'),
    url(r'^do_create$', views.do_create, name='do_create'),
    url(r'^edit$', views.edit, name='edit'),
    url(r'^do_edit$', views.do_edit, name='do_edit'),
]
