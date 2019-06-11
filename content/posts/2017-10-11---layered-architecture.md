---
title: "Layered Architecture"
date: "2017-10-11T22:12:03.284Z"
template: "post"
draft: false
slug: "/blog/2017/10/11/layered-architecture/"
category: "Software Engineering"
tags:
  - "Software Architecture"
description: "The most common architectural pattern is the Layered Architectural pattern. It is the most widely used architectural pattern in today industry. This pattern is easy to implement and it has similarity with the organizational architecture."
---

![Layered Architecture](/media/pixabay/layered-architecture.jpg "Layered Architecture")
[<center><span style="color:black">Image Source</span></center>](https://pixabay.com/photos/floor-wood-hardwood-floors-1256804/)

**Description**

The most common architectural pattern is the Layered Architectural pattern. It is the most widely used architectural pattern in today industry. This pattern is easy to implement and it has similarity with the organizational architecture. This nature of the pattern makes people use it in their application.

The concept of layered architecture pattern is that it breaks down the components of an application into separate layers. This layers are independent of each other. Layered architecture pattern does not specify the number and type of layers in an application, but most commonly there are four layers in an application, Presentation, Business, Persistence and Database. Presentation layer deals with the use interfaces and browser communications while business layers handles all the business logic in an application. Persistence layer ensure the persistency of data while database layers defines the physical database. Sometimes the business and persistence layers are combined to one business layer because of the closely relationship between these two layers. Thus small applications may have contain three layers while other large business applications may have contain five or more layers.

Components in layered architecture has separation in concern. Means component in business layer deals only with the logic related to business. It does not need to know how data is represented in the interfaces or from where data is coming from. This layer only get data from persistence layer perform the business logic to that data and passes the data to the presentation layer.
<br /><br />

**Core Concepts**

One of the most important concept of layered architecture is that the layers are closed. Closed layer means all the requests needs to go through each layer one by one to complete the request. It is not allowed for a request to bypass any layer. The presentation layer can not have direct access to persistence layer or database layer with out going through business layer. The reason why presentation layer can not have access to persistence layer can be termed as 'layer of isolation'. Layer of isolation means changes to one layer does not have effect to other layers. If presentation layer can have access to persistence layer then it will be tightly coupled and any change made to persistence layer would have effect on both business layer and persistence layer. That will make the application tightly coupled and will reduce maintainability in future.

But if business layer has some common task then it will be wise to separate these common task in separate optional service layer. If we place this service layer after business layer then all the request must cross this service layer to go to persistence layer. Which should not be. Because all request may not need to access this service layer. But every request have to pass the service layer because of this architectures nature. To remove this problem there is a concept called open layer. Open layer is a layer that can be by-passed while passing the request through layers. In our case if we make service layer as open then the request can omit the layer to go to persistence layer from the business layer. Which eliminates the problem related to optional layer.
<br /><br />

**Anti-Pattern**

Layered architecture pattern is a pattern that has easy maintainability. One can easily adapt it for their application if he does not have any idea about what architectural pattern he should follow. Because this architectural pattern is a solid general purpose pattern. However this pattern needs a proper concern while using it because in some particular cases it can act like an anti-pattern.

Common scenario of layered architecture is that request will go through each layer to process a request. But there can be some request on which there is no need to apply any logic. But those requests also needs to pass all of the layers. Which may create performance issue. All the application contains this kind of request where applying business logic is not required. But it is okay if your application has 20 percent of these kind of request. It may contain 80 percent request that needs to perform business logic and others 20 percent does not require to apply logic. But if reverse case occurred then it is better to consider architecture once again. Although open layer can reduce the problem but it also make the application closely coupled.
<br /><br />

**Pros and Cons**

* Layered architecture is easy to adapt quickly (for inexperienced person).
* As the application is divided into layers which increase the maintainability of application.
* Separate independent layers can be mocked easily to perform test.
<br /><br />
* Layered architecture has poor perfect for continuously changing applications.
* Requests need to pass through all the layers which create performance issue.
* Depending on implementation layered architecture can have deployment issue. Sometimes applications that  followed layered architecture may take huge time to compile each layer which can make deployment process slower.
<br /><br />

**Best For**

Following are the cases where layered architecture is good to implement -
* If your team has less experience then layer architecture is a good choice.
* For the application the needs to build quickly.
* Business or enterprise application that needs to maintain traditional business process.
* Maintainability and test-ability of layered architecture is high. If application requires these two benefits then it will be best choice.
