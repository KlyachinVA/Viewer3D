"""view3D URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
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
from django.contrib import admin
from django.urls import path, re_path
from loadmodels.views import main, upload_model3d, make_scene, make_envir,\
    upload_history_info, add_texture,show_start_menu, scene_list,\
    model_list, add_history_info, add_texture_to_model, set_position,\
    view_scene, get_json_data

urlpatterns = [
    path('admin/', admin.site.urls),
    path('show_scene/',main),
    re_path('view_scene/([0-9]+)',view_scene),
    path('',show_start_menu),
    path('manage/upload_model3d/',upload_model3d),
    path('manage/make_scene/',make_scene),
    path('manage/make_environment/',make_envir),
    path('manage/upload_history_info/',upload_history_info),
    path('manage/add_texture/',add_texture),
    path('manage/scene_list/',scene_list),
    re_path('get_json_data/([a-z]+)',get_json_data),
    re_path('manage/model_list/([0-9]+)',model_list),
    re_path('manage/add_history_info/([0-9]+)',add_history_info),
    re_path('manage/add_texture_to_model/([0-9]+)',add_texture_to_model),
    re_path('manage/set_position/([0-9]+)',set_position)
]
