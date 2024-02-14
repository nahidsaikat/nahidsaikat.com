---
title: "Structure Your Project with Flask Blueprint"
date: "2020-04-10T00:12:03+06:00"
tags:
  - "Python"
  - "Flask"
  - "REST-API"
description: "Blueprint is a way to organize related code in the same module. Blueprint allows us to simplify complex project by dividing it in smaller modules."
---

![Structure Your Project with Flask Blueprint](flask-structure-blueprint.jpg "Structure Your Project with Flask Blueprint")
[<center><span style="color:black">Image Source</span></center>](https://pixabay.com/photos/prague-czech-republic-city-river-1168302/)

Flask is a lightweight WSGI web application framework based on Python. It is designed in such a way that it will only supply the core components of a web application and it lets the developer choose rest of the things. It leaves all the design and architecture level decisions to the developer.

As a result it is very easy to get started start with Flask. But day by day when the application gets bigger and more complex, it become very tough to maintain the code base. To resolve this problem Flask comes with <strong>Blueprint</strong>. 

<strong>Flask Blueprint</strong> or <strong>Blueprint</strong> for short, is a way to organize the related code base between python modules or packages. In this article we will learn how to use Blueprint to structure a Flask project.

At the beginning, lets first create a hello world application in Flask. Create a file ```app.py``` and put the following code in it.
```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)
```
What we have done here is that, first we have created an Flask application object by passing the name of the application's module or package. Then we define a function ```hello_world``` and associates it with ```'/'``` url endpoint using route decorator of the ```app``` object. 

Now open up your terminal and write this command ```python app.py``` and hit enter. It will run your application on port 5000 of your machine.

While the application is running, go to ```http://localhost:5000``` in your favorite browser and see that ```Hello, World!``` is printed on it.

As your basic Flask application is up and running. Now create a new file ```views.py``` and write the following code in it.
```python
from flask import Blueprint

index_blueprint = Blueprint('index_blueprint', __name__)

@index_blueprint.route('/index/')
def index():
    return 'This is flask blueprint example'
```
<br>

Here we have done the following things.
* We import ```Blueprint``` from ```flask```.
* Created a Blueprint object and name it ```index_blueprint```.
* And associates our ```index``` function with ```/index/``` url endpoint using route decorator of ```index_blueprint```.

While creating the ```index_blueprint``` object, first we have passed the name of the blueprint that will be used in Flask's routing mechanism. And then we have passed ```__name__``` as the second argument which will be used by Flask to locate the Blueprint's resources.

Now that we have our blueprint object, we need to register it with ```app``` object. The following code base shows how to register ```index_blueprint``` with ```app``` object in ```app.py``` file.
```python
from views import index_blueprint

app = Flask(__name__)
app.register_blueprint(index_blueprint)
```
```app.register_blueprint``` is the method we used here to register the blueprint with the ```app``` object.

As we have registered our blueprint with the application, it's time to check if our blueprint is actually working. 

To check that open your terminal and run this command ```python app.py```, then go to ```http://localhost/index/``` in your browser and see that ```This is flask blueprint example``` is printed.

<br>

![Structure Your Project with Flask Blueprint](https://media.giphy.com/media/T0WzQ475t9Cw/source.gif "Structure Your Project with Flask Blueprint")
[<center><span style="color:black">Source</span></center>](https://media.giphy.com/media/T0WzQ475t9Cw/source.gif)

<br>

We have successfully used <strong>Flask Blueprint</strong> in our project and we have structured our project in different python modules using the Blueprint.

When the project will grow bigger and bigger that time we can adopt the following project structure to keep it more maintainable.
```
project_root/
|
|--app.py
|--app_module/
    |
    |--__init__.py
    |--views.py
```

<br>

The complete code of this article can be found at [this repository](https://github.com/nahidsaikat/Structure-Your-Project-with-Flask-Blueprint.git "GitHub").
