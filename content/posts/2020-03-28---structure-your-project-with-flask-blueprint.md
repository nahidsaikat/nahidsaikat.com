---
title: "Structure Your Project with Flask Blueprint"
date: "2020-03-28T00:12:03.284Z"
template: "post"
draft: false
slug: "/blog/structure-your-project-with-flask-blueprint/"
category: "Python"
tags:
  - "Flask"
  - "REST-API"
description: "In the article we will build a simple REST API using Flask, SQLAlchemy and Marshmallow. We will be building a note taking application where these two API endpoints /note/ and /note/<id>/ will be available."
---

![Structure Your Project with Flask Blueprint](/media/pixabay/flask-structure-blueprint.jpg "Structure Your Project with Flask Blueprint")
[<center><span style="color:black">Image Source</span></center>](https://pixabay.com/photos/prague-czech-republic-city-river-1168302/)

Flask is lightweight WSGI web application framework based on Python. It is designed such a way that it will only supply the code components of a web application and it lets the developer choose rest of the things. It does not enforce to use any database ORM or not even enforce to use any project layout. It is the developer who will choose and use any library that he wants to.

The general nature of any software project is that it starts as a small project but day by day it grows and become a complex one. So at the beginning most of the developers does not think about how they will handle the project when it becames much more complex in stead they just starts the project. As a result when application gets bigger it also become very hard to manage the project.

So if you are using Flask as your web application framework then there is a higher chance that you will face with that problem in future. So what you can do is estimate how big the project can be in future and decide how you will structure your project so that you can maintain the project easily when it becomes bigger. 

In this article the discussion point is how you can structure your Flask project so that it remains maintainable in future. And we will be using Flask Blueprint here to structure the project.

We will use an existing code base that was built for my [previous article](https://nahidsaikat.com/blog/flask-with-sqlalchemy-and-marshmallow/ "Flask with SQLAlchemy & Marshmallow") and follow the  procedure discussed below to structure that code base using Flask Blueprint. We will discuss here two way to structure the code base. One will be for small and medium projects and the other one will be for large projects.

So follow the steps below to checkout [this repository](https://github.com/nahidsaikat/Flask-with-SQLAlchemy-and-Marshmallow "GitHub") and create the environment. Before that please ensure you have ```pipenv``` installed as we will be using it as the dependency manager. In this code base we have used Python 3.6, if your system doesn't have Python 3.6 then you can use ```pyenv``` to manage different versions of Python.

```
mkdir flask_blueprint
cd flask_blueprint
git clone https://github.com/nahidsaikat/Flask-with-SQLAlchemy-and-Marshmallow.git .
pipenv install --three
pipenv shell
```
When you have the environment prepared open ```app.py``` file in your favorite editor. The file contains following code.

```python
import os

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+ \
                os.path.join(basedir, 'db.sqlite3')

db = SQLAlchemy(app)
ma = Marshmallow(app)


class NoteModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    content = db.Column(db.String(255))

    def __init__(self, title, content):
        self.title = title
        self.content = content


class NoteSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = NoteModel

note_schema = NoteSchema()
notes_schema = NoteSchema(many=True)


@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/note/')
def note_list():
    all_notes = NoteModel.query.all()
    return jsonify(notes_schema.dump(all_notes))


@app.route('/note/', methods=['POST'])
def create_note():
    title = request.json.get('title', '')
    content = request.json.get('content', '')

    note = NoteModel(title=title, content=content)
    
    db.session.add(note)
    db.session.commit()
    
    return note_schema.jsonify(note)


@app.route('/note/<int:note_id>/', methods=["GET"])
def note_detail(note_id):
    note = NoteModel.query.get(note_id)
    return note_schema.jsonify(note)


@app.route('/note/<int:note_id>/', methods=['PATCH'])
def update_note(note_id):
    title = request.json.get('title', '')
    content = request.json.get('content', '')

    note = NoteModel.query.get(note_id)
    
    note.title = title
    note.content = content

    db.session.add(note)
    db.session.commit()

    return note_schema.jsonify(note)


@app.route('/note/<int:note_id>/', methods=["DELETE"])
def delete_note(note_id):
    note = NoteModel.query.get(note_id)
    
    db.session.delete(note)
    db.session.commit()

    return note_schema.jsonify(note)


if __name__ == '__main__':
    app.run(debug=True)
```
We will refactor this file and create a modular structure of the project.

First of all let's import the Blueprint class in the file and create an instalce of it. We will name it as ```note_blueprint```.

```python
from flask import Flask, Blueprint, ...

...

app = Flask(__name__)

note_blueprint = Blueprint('note_blueprint', __name__)
app.register_blueprint(note_blueprint)

...
```
What we have done is create a Blueprint instance and register it with our flask app. Now we have to use it. For that replace ```app.route()``` decorator the functions with ```note_blueprint.route()`` decorator.

```python
@note_blueprint.route('/')
def hello_world():
    return 'Hello, World!'
```
Do this for each functions. And with that our application is now using Blueprint for url routing.

Now create a folder ```src``` and in it create a file ```__init__.py```. Inside the ```src``` folder create another folder ```note``` and also the file ```__init__.py``` inside ```note``` folder.

So the directory structure will be as follow.
```
app.py
src
    __init__.py
    note
        __init__.py
```
Inside the ```note``` folder create a file and name it as ```models.py```. And move the defination of ```NoteModel``` model and SQLAlchemy related code inside that file with related imports. After that ```models.py``` file should contains following code.

```python
import os
from flask_sqlalchemy import SQLAlchemy
from app import app

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+ \
                os.path.join(basedir, 'db.sqlite3')

db = SQLAlchemy(app)


class NoteModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    content = db.Column(db.String(255))

    def __init__(self, title, content):
        self.title = title
        self.content = content
```

Inside the ```note``` folder create another file ```schemas.py`` and more schema related code inside it.

```python
from flask_marshmallow import Marshmallow

from app import app
from src.note.models import NoteModel

ma = Marshmallow(app)


class NoteSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = NoteModel
```

Now create ```views.py``` file inside ```note``` and move all the functions to it including blueprint. ```views.py``` file content will be
```python
from flask import Blueprint, request, jsonify

from src.note.models import NoteModel
from src.note.schemas import NoteSchema


note_blueprint = Blueprint('note_blueprint', __name__)

note_schema = NoteSchema()
notes_schema = NoteSchema(many=True)


@note_blueprint.route('/')
def hello_world():
    return 'Hello, World!'

@note_blueprint.route('/note/')
def note_list():
    all_notes = NoteModel.query.all()
    return jsonify(notes_schema.dump(all_notes))


@note_blueprint.route('/note/', methods=['POST'])
def create_note():
    title = request.json.get('title', '')
    content = request.json.get('content', '')

    note = NoteModel(title=title, content=content)
    
    db.session.add(note)
    db.session.commit()
    
    return note_schema.jsonify(note)


@note_blueprint.route('/note/<int:note_id>/', methods=["GET"])
def note_detail(note_id):
    note = NoteModel.query.get(note_id)
    return note_schema.jsonify(note)


@note_blueprint.route('/note/<int:note_id>/', methods=['PATCH'])
def update_note(note_id):
    title = request.json.get('title', '')
    content = request.json.get('content', '')

    note = NoteModel.query.get(note_id)
    
    note.title = title
    note.content = content

    db.session.add(note)
    db.session.commit()

    return note_schema.jsonify(note)


@note_blueprint.route('/note/<int:note_id>/', methods=["DELETE"])
def delete_note(note_id):
    note = NoteModel.query.get(note_id)
    
    db.session.delete(note)
    db.session.commit()

    return note_schema.jsonify(note)
```

At this state ```app.py``` file should have following content.
```python
from flask import Flask
from src.note.views import note_blueprint

app = Flask(__name__)

app.register_blueprint(note_blueprint)


if __name__ == '__main__':
    app.run(debug=True)
```

The directory structure will be like following.
```
app.py
src
    __init__.py
    note
        __init__.py
        models.py
        schemas.py
        views.py
```
Here ```note``` is the core component of the application. If there is authentication in the application then ```auth``` could be another core component. In that case the directory structure could be.

```
app.py
src
    __init__.py
    note
        __init__.py
        models.py
        schemas.py
        views.py
    auth
        __init__.py
        models.py
        schemas.py
        views.py
```

So the point is inside the ```src``` directory we keep only the core components and inside the the core components they has there related files. If we needs to place html files then we can put then in ```templates``` folder in each core components. For the html file loading there can be conflict for the same name. To resolve that we can create another folder with the same name as of the core component inside ```templates``` folder. In that case the directory structure can look like as following.

```
app.py
src
    __init__.py
    note
        __init__.py
        models.py
        schemas.py
        views.py
        templates
            note
                add.html
    auth
        __init__.py
        models.py
        schemas.py
        views.py
        templates
            auth
                add.html
```

The complete code of this article can be found at [this repository](https://github.com/nahidsaikat/Structure-Your-Project-with-Flask-Blueprint.git "GitHub").
