---
title: "Oracle PL/SQL Blocks"
date: "2018-01-29T22:12:03.284Z"
template: "post"
draft: false
slug: "/blog/2018/01/29/oracle-pl-sql-blocks/"
category: "Database"
tags:
  - "PL/SQL"
  - "Oracle DB"
  - "Language"
description: "PL/SQL is a block structured language. Everything written in PL/SQL are divided in logical blocks. Each blocks has three parts declaration sections, executable sections and exception handling sections."
---

![PL/SQL Block](/media/pixabay/pl-sql-block.png "PL/SQL Block")
[<center><span style="color:black">Image Source</span></center>](https://pixabay.com/illustrations/cubes-assorted-random-toys-677092/)

PL/SQL is a block structured language. Everything written in PL/SQL are divided in logical blocks. Each blocks has three parts declaration sections, executable sections and exception handling sections.

**Declaration Section:** This is an optional section. This section contains declaration of variables, constants, cursors, subprograms and other elements necessary in program. **DECLARE** is the keyword that indicates the starts of declaration section.

**Executable Section:** Executable section is the main part of the program. This section start with the keyword **BEGIN** and end with keyword **END**. All the executable statements are placed inside this section. This section should not be empty, it should contains at least null command to indicate nothing should be execute.

**Exception Handling Section:** Exception handling section starts with the keyword **EXCEPTION**. It handles all the exception raises while executing the statements in executable section. It is also an optional section.

A typical PL/SQL block looks like following.

```ruby
DECLARE
    <declaration section>
BEGIN
    <executable section>
EXCEPTION
    <exception handling section>
END;
```

Here is the hello world program written in PL/SQL block.

```ruby
BEGIN
    DBMS_OUTPUT.PUT_LINE( 'Hello World!' );
EXCEPTION
```

Following is the same hello world program. This time a variable is declared which size is 100 bytes. This variable contains string "Hello World!" and is being used to show output. It also handles exception.

```ruby
DECLARE
    message VARCHAR2 (100) := 'Hello World!';
BEGIN
    DBMS_OUTPUT.PUT_LINE(message);
EXCEPTION
    WHEN OTHERS
    THEN DBMS_OUTPUT.PUT_LINE( 'Exception Occurred!' );
END;
```

Blocks can be nested. Following is the same program but this time we are using nested blocks.

```ruby
DECLARE
    message_one VARCHAR2 (100) := 'Hello';
BEGIN
    DECLARE
        message_two VARCHAR2 (100) := message_one || ' World!';
    BEGIN
        DBMS_OUTPUT.PUT_LINE(message_two);
    END;
EXCEPTION
    WHEN OTHERS
    THEN DBMS_OUTPUT.PUT_LINE( 'Exception Occurred!' );
END;
```

There are many tools available to run PL/SQL programs. SQL*PLUS is one of the tool to run PL/SQL program provided by Oracle. To execute the above programs in SQL*PLUS first connect with database using the command **CONNECT database_name**. After providing password you will be connected with database_name. You should run **SET SERVEROUTPUT ON** command to see output on screen. Then type the program in SQL*PLUS command prompt at the end type slash(/) to tell SQL*PLUS to execute. When executed you will see Hello World! written on the screen.

Following figure shows executing the hello world example in SQL*PLUS.

![Encapsulation](/media/pl_sql/hello-world.png "Hello World in PL/SQL")
**<center>Figure: Executing PL/SQL Program in SQL*PLUS.</center>**
 
 
[Visit here](https://www.nahidsaikat.com/tag/oracle-db/ "Oracle DB - Nahid Saikat") for other oracle database related post.
Learn Oracle Database basics from [here](http://www.oracle.com/webfolder/technetwork/tutorials/obe/db/12c/r1/odb_quickstart/odb_quick_start.html "Oracle Database Quick Start").
