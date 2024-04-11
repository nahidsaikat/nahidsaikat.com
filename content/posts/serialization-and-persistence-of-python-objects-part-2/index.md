
---
title: "Serialization and Persistence of Python Objects - Part 2"
date: "2024-04-11T16:12:26+06:00"
tags:
  - "Python"
description: "Python has some build-in modules that offers us to serialize and persists python object into a file and also allows us to de-serialize and use them from the file."
---

![Serialization and Persistence of Python Objects](serialization-persistence.png "Serialization and Persistence of Python Objects")
<center>
Image by <a href="https://pixabay.com/users/acatxio-20233758/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7955446">AcatXIo</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7955446">Pixabay</a>
</center>

<br>

This is the second part of this two part article series on Serialization and Persistence of Python Objects. For the first part [click here](https://nahidsaikat.com/posts/serialization-and-persistence-of-python-objects-part-1/ "Serialization and Persistence of Python Objects - Part 1").

## Marshal module
Marshal module can serialize and de-serialize python values into byte stream. The format is specific to Python and it is machine independent. That means we can serialize a python value, send it over network and de-serialize it in another machine and it will work just fine if both machine has the same version of Python. The purpose of this module is to reading and writing of "pseudo-compiled" code for Python module and for that reason maintainers reserves the right to change the marshal format in incompatible mode. Thus this module should not be used for general purpose. For the general purpose usage use the [pickle and shelve](https://nahidsaikat.com/posts/serialization-and-persistence-of-python-objects-part-1/) module. 

Not all the types are supported by the marshal module. The supported types are booleans, integers, floating point numbers, complex numbers, strings, bytes, bytearrays, tuples, lists, sets, frozensets, dictionaries, and code objects. Point to be noted is that tuples, lists, sets, frozensets, dictionaries will be supported only if they contains element from the supported types. 

Marshal module has four functions,
1. `marshal.dump(value, file)`: This function is used to serialize the `value` and write the byte stream in a file. If the value is not a supported type a `ValueError` exception is raised. In the following example, we are saving data in `data.marshal` file which will contain serialized byte stream.
```python
import marshal

data = {
    "int": 1233, 
    "str": "a string",
    "list": [1, 2, 3],
    "complex": 1+2j
}

with open("data.marshal", "wb") as file:
    marshal.dump(data, file)
```

2. `marshal.load(file)`: Reads the serialized byte streams from the file, de-serialize it and returns the value. If the byte streams contains a value of unsupported type it will raised a `ValueError` exception. In following example, we will read the data back that we have save in previous example.
```python
import marshal

with open("data.marshal", "rb") as file:
    data = marshal.load(file)

print(data)
# {'int': 1233, 'str': 'a string', 'list': [1, 2, 3], 'complex': (1+2j)}
```

3. `marshal.dumps(value)`: Returns the byte streams of the vlaue that would be saved when called with the `marshal.dump(value, file)` function. `ValueError` exception is raised when an unsupported type is used. We can then save the byte value in a file or a database or transfer via network.
```python
import marshal

data = {
    "int": 1233, 
    "str": "a string",
    "list": [1, 2, 3],
    "complex": 1+2j
}

serialized_data = marshal.dumps(data)
print(serialized_data)
# b'\xfb\xda\x03int\xe9\xd1\x04\x00\x00\xda\x03str\xfa\x08a string\xda\x04list[\x03\x00\x00\x00\xe9\x01\x00\x00\x00\xe9\x02\x00\x00\x00\xe9\x03\x00\x00\x00\xda\x07complex\xf9\x00\x00\x00\x00\x00\x00\xf0?\x00\x00\x00\x00\x00\x00\x00@0'
```

4. `marshal.loads(bytes)`: The loads function takes a string of bytes,  de-serialize it and returns the data. During de-serialization it will raise `ValueError` exception for the unsupported types. It is used to de-serialize the data that is serialized with `marshal.dumps(value)`.
```python
import marshal

data = {
    "int": 1233, 
    "str": "a string",
    "list": [1, 2, 3],
    "complex": 1+2j
}

serialized_data = marshal.dumps(data)

deserialized_data = marshal.loads(serialized_data)

print(deserialized_data)
# {'int': 1233, 'str': 'a string', 'list': [1, 2, 3], 'complex': (1+2j)}
```

Marshal module has one attribute `version` that indicates the format used by the module.  Currently the latest versioin is 4.

---

## DBM module:
Python's `dbm` module provides a dictionary like interface for DBM database. The keys and values are always stored as bytes. If we pass a string vaue it will be implicitly converted to bytes. The basic dictionary functionality like value store, retrieval, delation, in operation, keys() method are available with get() and setdefault() methods.

Under the hood dbm library used `dbm.gnu`, `dbm.ndbm`, or `dbm.dump` interface based on the platform. We can explicitely import and use these interfaces directly. When not specified, the library will try to choose the most suitable interface based on the platform. 

Let's try writing some data on dbm database,
```python
import dbm

db = dbm.open("database.db", "c")

db["title"] = "The greatest book"
db["author"] = "The great author"
db["year"] = str(2024)

db.close()
```
In this example we have opened a database file, set three values and then close the file. We can also use `dbm.open()` as a context manager as well. Note that we have used `c` as file flag, it means to open the database file for reading and writing, create the file if not exists. There are some other flags for use as well, `r` means open the file for reading only, `w` means open the file for reading and writing and `n` means always create a new empty databse for reading and writing.

Let's try to read the data that we have written earlier,
```python
import dbm

with dbm.open("database.db", "c") as db:
    print(db["title"])
    print(db["author"])
    print(db["year"])

# b'The greatest book'
# b'The great author'
# b'2024'
```

We can also loop through the keys and get the data as well,
```python
import dbm

with dbm.open("database.db", "c") as db:
    for key in db.keys():
        print(db[key])

# b'The greatest book'
# b'The great author'
# b'2024'
```

Note that the dbm library is very handy and is only for the basic storage purposes only. If you require to store more complex data and the performance is key factor for you then you should use SQLite or NoSQL database instead.

<hr>

##### References
* [marshal — Internal Python object serialization](https://docs.python.org/3/library/marshal.html)
* [Understanding Internal Python Object Serialization with Marshal](https://blog.finxter.com/understanding-internal-python-object-serialization-with-marshal/)
* [dbm — Interfaces to Unix “databases”](https://docs.python.org/3/library/dbm.html)
* [Python Dbm Module](https://thetechthunder.com/python-dbm-module/)
