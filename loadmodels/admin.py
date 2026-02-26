from django.contrib import admin
from loadmodels.models import Model3D, Scene, Position, Environment,\
     TextureImage, HistoryInfo, Model3DSize, Polygon

# Register your models here.

admin.site.register(Model3D)
admin.site.register(Scene)
admin.site.register(Position)
admin.site.register(Environment)
admin.site.register(TextureImage)
admin.site.register(HistoryInfo)
admin.site.register(Model3DSize)
admin.site.register(Polygon)