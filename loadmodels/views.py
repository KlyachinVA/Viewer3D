import re

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from loadmodels.forms import UploadModelForm, MakeSceneForm, MakeEnvirForm, HistoryInfoForm,\
    AddTextureForm
from loadmodels.models import Model3D, Scene, Model3DSize, Polygon, HistoryInfo
from loadmodels.process_obj import calc_box3d
# Create your views here.
import json
import numpy as np
from view3D.settings import PATH_JSON
def main(req):
	html = render(req,"index.html")
	return HttpResponse(html)

def view_scene(req,id_scene):
    id_scene = int(id_scene)
    scene = Scene.objects.get(id=id_scene)
    html = render(req,"view_scene.html",{"scene":scene})
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
            fname = upload_form.instance.fname.name
            # print(fname)
            fname_json = PATH_JSON  + upload_form.instance.scene.fname_json

            data_scene = json.load(open(fname_json))
            objmodels = data_scene["objmodels"]
            houses = data_scene["houses"]
            # print(objmodels)



            model3d = upload_form.instance
            fname_url = model3d.fname.url
            fname_mtl_url = model3d.fname_mtl.url
            fname_url = "/" + "/".join(fname_url.split("/")[2:])
            fname_mtl_url = "/" + "/".join(fname_mtl_url.split("/")[2:])
            data_model = {
                "id":model3d.id,
                "path" : fname_url,
                "mtlpath" : fname_mtl_url,
                "scale": [1.0,1.0,1.0],
                "position": [0, 0, 0],
                "rotation": [0, 3.14, 0]
            }

            objmodels.append(data_model)
            houses.append({})

            json.dump(data_scene,open(fname_json,"w"))
            # fname = url[1:]
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
            fname_json = str(PATH_JSON) + scene_form.instance.fname_json

            data = {"objmodels":[],"houses":[]}
            json.dump(data,open(fname_json,"w"))
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

def list_scene_for_view(req):
    scenes = Scene.objects.all()
    html = render(req, "list_scene_for_view.html", {"scenes": scenes})
    return HttpResponse(html)

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
    rx = re.compile(r"/(.*?\.[a-z]+)")
    if req.method == "GET":
        texture_form = AddTextureForm()
        html = render(req, "add_texture_to_model.html", {"form": texture_form,"model":model3d})
        return HttpResponse(html)
    else:
        texture_form = AddTextureForm(req.POST, req.FILES)
        if texture_form.is_valid():
            print("Save texture")
            fname_mtl = model3d.fname_mtl
            f = open(fname_mtl,"r")
            mtl = f.read()

            texture_form.save()
            return HttpResponseRedirect("/")

def set_position(req,id_scene):
    if req.method == "GET":
        id_scene = int(id_scene)
        scene = Scene.objects.get(id=id_scene)

        url_map = "/" + "/".join(scene.map_image.url.split("/")[-4:])
        models3d = Model3D.objects.filter(scene=scene)
        models_data = []
        for model3d in models3d:
            polygon = Polygon.objects.filter(scene=scene,model3d=model3d)
            XX = []
            YY = []
            drawn = 'false'
            color = 'red'
            if len(polygon)>0:
                XX = polygon[0].X.split(":")

                YY = polygon[0].Y.split(":")
                drawn = 'true'
                color = polygon[0].color

            models_data.append({'model':model3d,
                                'X':XX,
                                'Y':YY,
                                'drawn':drawn,
                                'color':color})

        html = render(req,"set_position.html",{"scene":scene,"models":models_data,"url_map":url_map})
        return HttpResponse(html)
    else:
        id_scene = int(id_scene)
        scene = Scene.objects.get(id=id_scene)
        id_model = int(req.POST["model3d"])
        model3d = Model3D.objects.get(id=id_model)
        box3d = Model3DSize.objects.filter(model3d=model3d)[0]
        L = box3d.length
        Ws = box3d.height
        Xcor = req.POST["Xcoords"]
        Ycor = req.POST["Ycoords"]
        color = req.POST["color"]
        polys = Polygon.objects.filter(scene=scene,model3d=model3d)
        if len(polys) > 0:
            poly = polys[0]
            poly.X = Xcor
            poly.Y = Ycor
            poly.color = color
        else:
            poly = Polygon(scene=scene,model3d=model3d,X=Xcor,Y=Ycor,color=color)
        poly.save()

        XX = Xcor.split(":")
        YY = Ycor.split(":")
        X = []
        Y = []
        for i in range(len(XX)):
            X.append(int(XX[i]))
            Y.append(int(YY[i]))

        X = np.array(X)
        Y = np.array(Y)
        W = 1000
        H = 620
        cx = (X - W/2).mean()
        cy = (Y - H/2).mean()

        scale = scene.scale

        # maxx = X.max() * scale
        # minx = X.min() * scale
        # maxy = Y.max() * scale
        # miny = Y.min() * scale
        x1 = (X[0] - W/2)* scale
        x2 = (X[1] - W/2)* scale
        x3 = (X[2] - W/2)* scale
        x4 = (X[3] - W/2)* scale
        z1 = (Y[0] - H/2)* scale
        z2 = (Y[1] - H/2)* scale
        z3 = (Y[2] - H/2)* scale
        z4 = (Y[3] - H/2)* scale

        # print(x1,x2,x3,x4,z1,z2,z3,z4)

        cx *= scale
        cy *= scale

        dx = max(x1,x2,x3,x4) - min(x1,x2,x3,x4)
        dz = max(z1,z2,z3,z4) - min(z1,z2,z3,z4)
        kx = L/dx
        kz = Ws/dz

        x1 = (x1 - cx) * kx + cx
        x2 = (x2 - cx) * kx + cx
        x3 = (x3 - cx) * kx + cx
        x4 = (x4 - cx) * kx + cx
        z1 = (z1 - cy) * kz + cy
        z2 = (z2 - cy) * kz + cy
        z3 = (z3 - cy) * kz + cy
        z4 = (z4 - cy) * kz + cy

        url = model3d.fname.url
        fname_json = PATH_JSON + scene.fname_json
        print(fname_json)

        data_scene = json.load(open(fname_json))
        objmodels = data_scene["objmodels"]
        houses = []

        for i in range(len(objmodels)):
            if objmodels[i]["id"] == model3d.id:
                data_model = objmodels[i]
                data_model["position"] = [cx,0,cy]
                data_model["rect"] = {"z1": z1, "x1": x1,
                                      "z2": z2, "x2": x2,
                                      "z3": z3, "x3": x3,
                                      "z4": z4, "x4": x4, "H": 10.0}
                # data_model["rect"] = {"z1": maxy, "x1": minx,
                #                       "z2": maxy, "x2": maxx,
                #                       "z3": miny, "x3": maxx,
                #                       "z4": miny, "x4": minx, "H": 10.0}
                break
        for i in range(len(objmodels)):
            if "rect" in objmodels[i]:
                houses.append(objmodels[i]["rect"])
            else:
                houses.append({})
        data_scene["houses"] = houses
        json.dump(data_scene,open(fname_json,"w"),ensure_ascii=False)

        return HttpResponseRedirect("/manage/set_position/" + str(id_scene))

def get_json_data(req,fname):
    fname += ".json"
    path = PATH_JSON + fname
    f = open(path)
    data = f.read()
    # print(data)
    f.close()
    return HttpResponse(data, content_type="text/json", charset='utf8')

def get_history_info(req,id_model):
    id_model = int(id_model)
    model3d = Model3D.objects.get(id=id_model)
    history_info = HistoryInfo.objects.filter(model3d=model3d)
    if len(history_info) > 0:
        history_info = history_info[0]
        fname = history_info.fname_info.name
        dirs = fname.split("/")
        fname = "/".join(dirs[1:])
        html = render(req, fname)
        return HttpResponse(html)
    else:
        return HttpResponse("")



def delete_model3d(req,id_model):
    id_model = int(id_model)
    model3d = Model3D.objects.get(id=id_model)
    scene = Scene.objects.get(id=model3d.scene.id)
    fname_json = PATH_JSON + scene.fname_json
    data_scene = json.load(open(fname_json))
    objmodels = data_scene["objmodels"]
    houses = data_scene["houses"]
    objmodels_new = []
    houses_new = []
    data_scene_new = {}

    for i in range(len(objmodels)):
        if objmodels[i]["id"] != model3d.id:
            objmodels_new.append(objmodels[i])
            houses_new.append(houses[i])
    data_scene_new["objmodels"] = objmodels_new
    data_scene_new["houses"] = houses_new

    json.dump(data_scene_new, open(fname_json, "w"), ensure_ascii=False)
    model3d.delete()
    return HttpResponseRedirect("/")

def list_models_on_scene(req,id_scene):
    id_scene = int(id_scene)
    scene = Scene.objects.get(id=id_scene)
    models3d = Model3D.objects.filter(scene=scene)
    html = render(req,"list_models_on_scene.html",{"scene":scene,"models3d":models3d})
    return HttpResponse(html)




