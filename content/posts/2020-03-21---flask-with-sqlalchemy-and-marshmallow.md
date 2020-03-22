---
title: "Flask with SQLAlchemy & Marshmallow"
date: "2020-03-21T00:12:03.284Z"
template: "post"
draft: false
slug: "/blog/flask-with-sqlalchemy-and-marshmallow/"
category: "Python"
tags:
  - "Flask"
  - "REST-API"
description: "In the article we will build a simple REST API using Flask, SQLAlchemy and Marshmallow. We will be building a note taking application where these two API endpoints /note/ and /note/<id>/ will be available."
---

![Flask with SQLAlchemy & Marshmallow](/media/pixabay/flask-marshmallow-sqlalchemy.jpg "Flask with SQLAlchemy & Marshmallow")
[<center><span style="color:black">Image Source</span></center>](https://pixabay.com/photos/field-cereals-summer-sun-sunshine-192179/)


In the article we will build a simple REST API using <strong>Flask</strong>, <strong>SQLAlchemy</strong> and <strong>Marshmallow</strong>. We will be building a note taking application where these two API endpoints ```/note/``` and ```/note/<id>/``` will be available. 

We will be able to create new note or get all the notes by doing a <strong>POST</strong> or a <strong>GET</strong> request to ```/note/``` api endpoint. Not only that we will be able to get the details of the note or update the note or delete the note with a <strong>GET</strong> or a  <strong>PATCH</strong> or a <strong>DELETE</strong> request to ```/note/<id>/``` api endpoint.

First of all, we will give a brief descriptions of the libraries that we will be using in this article.

<strong>[Flask](https://palletsprojects.com/p/flask/ "Flask")</strong> is a lightweight WSGI web application framework in Python. It is designed to make getting started very quickly and very easily.

<strong>[marshmallow](https://marshmallow.readthedocs.io/en/stable/ "marshmallow")</strong> is an ORM/ODM/framework-agnostic library for converting complex datatypes, such as objects, to and from native Python datatypes.

<strong>[Flask-Marshmallow](https://flask-marshmallow.readthedocs.io/en/latest/ "Flask-Marshmallow")</strong> is a thin integration layer for Flask and marshmallow that adds additional features to marshmallow.

<strong>[SQLAlchemy](https://www.sqlalchemy.org/ "SQLAlchemy")</strong> is the Python SQL toolkit and Object Relational Mapper that gives application developers the full power and flexibility of SQL.


<strong>[Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/ "Flask-SQLAlchemy")</strong> is an extension for Flask that adds support for SQLAlchemy to your application. It aims to simplify using SQLAlchemy with Flask.

<strong>[marshmallow-sqlalchemy](https://marshmallow-sqlalchemy.readthedocs.io/en/latest/index.html "marshmallow-sqlalchemy")</strong> An SQLAlchemy integration with the marshmallow (de)serialization library.

We will be using <strong>pipenv</strong> as our dependency manager. We are assuming that pipenv is already installed in your system. 

Follow the steps bellow and at the end you will have a simple note application running on http://localhost:5000/.

<strong>Step 1: Setup Project Environment</strong>

```python
pipenv --three
```

<strong>Step 2: Install Flask and Other Dependencies</strong>

Run the following commands to install all the dependencies including Flask.
```python 
pipenv install flask
pipenv install flask-marshmallow
pipenv install flask-sqlalchemy
pipenv install marshmallow-sqlalchemy
```
After running those commands marshmallow and SQLAlchemy will be installed internally as dependency.

<strong>Step 3: Create ```app.py``` File</strong>

```cmd
touch app.py
```
<strong>Step 4: Add This Code to ```app.py``` File</strong>

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)    
```

<strong>Step 5: Start pipenv Shell</strong>

```cmd
pipenv shell
```

<strong>Step 6: Run Flask Server</strong>

```python
python app.py
```
<strong>Step 7: Go to the Browser</strong>

Start your favorite browser and go to the http://localhost:5000/ url and you will see ```Hello, World!``` printed.

<strong>Step 8: Integrate SQLAlchemy & Marshmallow</strong>

Add the following imports into the ```app.py``` file.
```python
import os
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
```
And add the following code after the creation of Flask app instance.
```python
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+ \
                os.path.join(basedir, 'db.sqlite3')

db = SQLAlchemy(app)
ma = Marshmallow(app)
```

<strong>Step 9: Create Model</strong>

Declare the model like following.
```python
class NoteModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    content = db.Column(db.String(255))

    def __init__(self, title, content):
        self.title = title
        self.content = content
```

<strong>Step 10: Create Schema</strong>

Generate marshmallow schema from the model.
```python
class NoteSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = NoteModel
```

<strong>Step 11: Build Out API Actions</strong>

```python

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

```

<strong>Step 12: Setup Database</strong>

Enter in python shell

```python```

```python
>> from app import db
>> db.create_all()
```

<strong>Step 13: Test APIs</strong>

We can use the tool [Postman](https://www.postman.com/ "Postman") to test our APIs. But before that please ensure your development server is up and running using this command ```python app.py``` from <strong>Step 6</strong>.

![Flask with SQLAlchemy & Marshmallow](/media/flask-with-sqlalchemy-and-marshmallow.png "Flask with SQLAlchemy & Marshmallow")


The complete code of this article can be found on [this repository](https://github.com/nahidsaikat/Flask-with-SQLAlchemy-and-Marshmallow "GitHub").
