from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from loadmodels.forms import UploadModelForm, MakeSceneForm, MakeEnvirForm, HistoryInfoForm,\
    AddTextureForm
from loadmodels.models import Model3D, Scene, Model3DSize, Polygon
from loadmodels.process_obj import calc_box3d
# Create your views here.


def main(req):
	html = render(req,"index.html")
	return HttpResponse(html)

def show_start_menu(req):
    html = render(req,"main.html")
    return HttpResponse(html)

#@login_required("/")
def upload_model3d(req):
    if req.method == "GET":
        upload_form = UploadModelForm()
        html = render(req, "upload_model.html", {"form": upload_form})
        return HttpResponse(html)
    else:
        upload_form = UploadModelForm(req.POST,req.FILES)
        if upload_form.is_valid():
            upload_form.save()
            url = upload_form.instance.fname.url
            model3d = upload_form.instance
            fname = url[1:]
            box = calc_box3d(fname)
            model_size = Model3DSize(model3d=model3d,
                                     xmin=box[0],xmax=box[1],ymin=box[2],ymax=box[3],
                                     zmin=box[4],zmax=box[5],
                                     length=box[6],width=box[7],height=box[8])
            model_size.save()
            return HttpResponseRedirect("/manage/upload_model3d/")
            # name = upload_form.cleaned_data["name"]
            # fname = upload_form.cleaned_data["fname"]
            # fname_mtl = upload_form.cleaned_data["fname_mtl"]
            # height = upload_form.cleaned_data["height"]
            # descr = upload_form.cleaned_data["descr"]
            # model3d = Model3D(name,fname,fname_mtl,height,descr)
            # model3d.save()

def make_scene(req):
    if req.method == "GET":
        scene_form = MakeSceneForm()
        html = render(req,"make_scene.html",{"form":scene_form})
        return HttpResponse(html)
    else:
        scene_form = MakeSceneForm(req.POST,req.FILES)
        if scene_form.is_valid():
            scene_form.save()
            return HttpResponseRedirect("/manage/make_scene/")


def make_envir(req):
    if req.method == "GET":
        envir_form = MakeEnvirForm()
        html = render(req,"make_envir.html",{"form":envir_form})
        return HttpResponse(html)
    else:
        envir_form = MakeEnvirForm(req.POST)
        if envir_form.is_valid():
            envir_form.save()
            return HttpResponseRedirect("/manage/make_environment/")

def upload_history_info(req):
    if req.method == "GET":
        history_form = HistoryInfoForm()
        html = render(req,"upload_history_info.html",{"form":history_form})
        return HttpResponse(html)
    else:
        history_form = HistoryInfoForm(req.POST,req.FILES)
        if history_form.is_valid():
            history_form.save()
            return HttpResponseRedirect("/manage/upload_history_info/")

def add_texture(req):
    if req.method == "GET":
        texture_form = AddTextureForm()
        html = render(req,"add_texture.html",{"form":texture_form})
        return HttpResponse(html)
    else:
        texture_form = AddTextureForm(req.POST,req.FILES)
        if texture_form.is_valid():
            texture_form.save()
            return HttpResponseRedirect("/manage/add_texture/")


def scene_list(req):
    scenes = Scene.objects.all()
    html = render(req,"scene_list.html",{"scenes":scenes})
    return HttpResponse(html)

def model_list(req,id_scene):
    id_scene = int(id_scene)
    scene = Scene.objects.get(id=id_scene)
    models3d = Model3D.objects.filter(scene=scene)

    html = render(req,"model_list.html",{"models3d":models3d,"scene":scene})
    return HttpResponse(html)


def add_history_info(req,id_model):
    id_model = int(id_model)
    model3d = Model3D.objects.get(id=id_model)
    if req.method == "GET":
        history_form = HistoryInfoForm()
        html = render(req,"add_history_info.html",{"form":history_form,"model":model3d})
        return HttpResponse(html)
    else:
        history_form = HistoryInfoForm(req.POST,req.FILES)
        if history_form.is_valid():
            history_form.save()
            return HttpResponseRedirect("/")


def add_texture_to_model(req,id_model):
    id_model = int(id_model)
    model3d = Model3D.objects.get(id=id_model)
    if req.method == "GET":
        texture_form = AddTextureForm()
        html = render(req, "add_texture_to_model.html", {"form": texture_form,"model":model3d})
        return HttpResponse(html)
    else:
        texture_form = AddTextureForm(req.POST, req.FILES)
        if texture_form.is_valid():
            texture_form.save()
            return HttpResponseRedirect("/")

def set_position(req,id_scene):
    if req.method == "GET":
        id_scene = int(id_scene)
        scene = Scene.objects.get(id=id_scene)
        url_map = "/" + "/".join(scene.map_image.url.split("/")[-4:])
        models3d = Model3D.objects.filter(scene=scene)
        html = render(req,"set_position.html",{"scene":scene,"models":models3d,"url_map":url_map})
        return HttpResponse(html)
    else:
        id_scene = int(id_scene)
        scene = Scene.objects.get(id=id_scene)
        id_model = int(req.POST["model3d"])
        model3d = Model3D.objects.get(id=id_model)
        Xcor = req.POST["Xcoords"]
        Ycor = req.POST["Ycoords"]
        poly = Polygon(scene=scene,model3d=model3d,X=Xcor,Y=Ycor)
        poly.save()

        return HttpResponseRedirect("/manage/set_position/" + str(id_scene))


