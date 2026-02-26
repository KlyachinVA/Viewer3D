from django.forms import Form, ModelForm

from loadmodels.models import *

class UploadModelForm(ModelForm):

    class Meta:
        model = Model3D
        fields = ["name","fname","fname_mtl","height","descr","scene"]



class MakeSceneForm(ModelForm):

    class Meta:
        model = Scene
        fields = ["name","envir","fname_json","map_image"]


class MakeEnvirForm(ModelForm):

    class Meta:
        model = Environment
        fields = ["name"]


class HistoryInfoForm(ModelForm):

    class Meta:
        model = HistoryInfo
        fields = ["title","model3d","fname_info"]


class AddTextureForm(ModelForm):

    class Meta:
        model = TextureImage
        fields = ["name","model3d","fname"]
