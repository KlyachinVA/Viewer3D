import json

with open('models_scene.json', 'r') as file:
    data = json.load(file)
    print(data["objmodels"][1]["position"])
    print(data["houses"][1])
