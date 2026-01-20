from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def main(req):
	html = render(req,"index.html")
	return HttpResponse(html)
