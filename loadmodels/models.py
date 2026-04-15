from django.db import models

# Create your models here.


class Environment(models.Model):
    name = models.CharField(max_length=100,verbose_name="Название окружения")

    def __str__(self):
        return self.name

class Scene(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название сцены")
    envir = models.ForeignKey(Environment,on_delete=models.CASCADE, verbose_name="Окружение")
    fname_json = models.CharField(max_length=100,verbose_name="Название файла JSON")
    map_image = models.FileField(upload_to="loadmodels/static/images/maps/",
                                 verbose_name="Файл изображения карты",
                                 default="blank_map.png")

    scale = models.FloatField(verbose_name="Масштаб - отношение истинного расстояния к пиксельному", default=1)

    def __str__(self):
        return self.name


class Model3D(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название модели")
    fname = models.FileField(upload_to="loadmodels/static/models",verbose_name="Файл модели (OBJ)")
    fname_mtl = models.FileField(upload_to="loadmodels/static/models",verbose_name="Файл с материалами модели (MTL)")
    height =  models.IntegerField(verbose_name="Высота объекта, м")
    descr = models.CharField(max_length=300,verbose_name="Краткое описание модели")
    scene = models.ForeignKey(Scene,on_delete=models.CASCADE,default=1,verbose_name="3D сцена")


    def __str__(self):
        return self.name

class Model3DSize(models.Model):
    model3d = models.ForeignKey(Model3D,on_delete=models.CASCADE)
    xmin = models.FloatField()
    xmax = models.FloatField()
    ymin = models.FloatField()
    ymax = models.FloatField()
    zmin = models.FloatField()
    zmax = models.FloatField()

    length = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()

    def __str__(self):
        return "Size of -- " + str(self.model3d)



class TextureImage(models.Model):
    name = models.CharField(max_length=100,verbose_name="Название текстуры")
    model3d = models.ForeignKey(Model3D,on_delete=models.CASCADE,verbose_name="3D  модель")
    fname = models.FileField(upload_to="loadmodels/static/models/textures/",verbose_name="Файл текстуры")

    def __str__(self):
        return self.name

class HistoryInfo(models.Model):
    title = models.CharField(max_length=150,verbose_name="Заголовок")
    model3d = models.ForeignKey(Model3D,on_delete=models.CASCADE,verbose_name="3D  модель")
    fname_info = models.FileField(upload_to="templates/history_info/",verbose_name="Файл html  с исторической справкой")


    def __str__(self):
        return self.title
class Polygon(models.Model):
    model3d = models.ForeignKey(Model3D, on_delete=models.CASCADE)
    scene = models.ForeignKey(Scene, on_delete=models.CASCADE)

    X = models.CharField(max_length=200)
    Y = models.CharField(max_length=200)
    color = models.CharField(max_length=200,default="rgb(255,0,0,1.0)")


class Position(models.Model):
    model3d = models.ForeignKey(Model3D,on_delete=models.CASCADE)
    scene = models.ForeignKey(Scene,on_delete=models.CASCADE)
    x = models.IntegerField()
    y = models.IntegerField()
    z = models.IntegerField()
    scaleX = models.IntegerField()
    scaleY = models.IntegerField()
    scaleZ = models.IntegerField()
    rotX = models.IntegerField()
    rotY = models.IntegerField()
    rotZ = models.IntegerField()

    def __str__(self):
        return str(self.model3d) + " - " + str(self.scene)


class TripOnScene(models.Model):
    name = models.CharField(max_length=200,verbose_name="Название маршрута")
    scene = models.ForeignKey(Scene,on_delete=models.CASCADE, verbose_name="3В сцена")


class Coord(models.Model):
    trip = models.ForeignKey(TripOnScene,on_delete=models.CASCADE)
    x = models.IntegerField()
    y = models.IntegerField()
    z = models.IntegerField()
    phi = models.IntegerField()
    theta = models.IntegerField()


