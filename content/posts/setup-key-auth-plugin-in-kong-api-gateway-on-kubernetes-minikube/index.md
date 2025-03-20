---
title: "Setup Key Auth Plugin in Kong API Gateway on Kubernetes (Minikube)"
date: "2025-03-09T17:55:08+06:00"
tags:
  - "Kubernetes"
  - "Kong"
description: "In this article we will be setting up the Key Auth plugin in the Kong API Gateway which is running on Kubernetes. For the purpose of this article we will be using Minikube to run the kubernetes cluster on our local machine."
---

![Setup Key Auth Plugin in Kong API Gateway on Kubernetes (Minikube)](setup-key-auth-kubernetes.jpeg "Setup Key Auth Plugin in Kong API Gateway on Kubernetes (Minikube)")
<center>
Image by <a href="https://pixabay.com/users/publicdomainpictures-14/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=20427">PublicDomainPictures</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=20427">Pixabay</a>
</center>

<br>

In this article we will be setting up the Key Auth plugin in the Kong API Gateway which is running on Kubernetes. For the purpose of this article we will be using [Minikube](https://minikube.sigs.k8s.io/docs/) to run the kubernetes cluster on our local machine. 

Following are the prerequisites to keep up with the article. Make sure that they are installed in your system.
* **[minikube](https://minikube.sigs.k8s.io/docs/) :** minikube is local Kubernetes, focusing on making it easy to learn and develop for Kubernetes.
* **[kubectl](https://kubernetes.io/docs/reference/kubectl/) :** Kubernetes provides a command line tool for communicating with a Kubernetes cluster's control plane, using the Kubernetes API. This tool is named kubectl.
* **[helm](https://helm.sh/) :** Helm helps you manage Kubernetes applications — Helm Charts help you define, install, and upgrade even the most complex Kubernetes application.

Now that we have everything installed in our system it's time to do some work. First we will need a kubernetes cluster. For that we will be using *minikube*. Run the following command in the terminal to spin up a cluster in the machine.

```bash
minikube start
```

Check that the cluster is up and running with the following command.
```bash
kubectl cluster-info
```

For this article we will be using `kong/httpbin` as a demo application. Which is a simple HTTP Request & Response Service.

Create a file `deploy.yaml` and copy paste the following content to it. This is a deployment for the kubernetes.
```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: httpbin
spec:
  replicas: 1
  selector:
    matchLabels:
      app: httpbin
  template:
    metadata:
      labels:
        app: httpbin
    spec:
      containers:
        - name: httpbin
          image: kong/httpbin:0.1.0
          ports:
            - containerPort: 80
```
Apply the file to the kubernetes cluster bu running the following command.
```bash
kubectl apply -f deploy.yaml
# deployment.apps/httpbin created
```
When applied, it will create a Deployment and a pod in the kubernetes cluster. You can check that by running the following commands in the terminal.
```bash
kubectl get deployment
# NAME      READY   UP-TO-DATE   AVAILABLE   AGE
# httpbin   1/1     1            1           108s

kubectl get pods
# NAME                       READY   STATUS    RESTARTS   AGE
# httpbin-574d58d46d-p2sdj   1/1     Running   0          3m5s
```

Now that we have a Deployment ready and a Pod running on the cluster for our *httpbin* application we need to create a Service in the cluster. A Service is a method of exposing network application that is running as one or more Pods in the cluster. You can learn more about the Service in kuberneter from [here](https://kubernetes.io/docs/concepts/services-networking/service/).

Create a new file and name it `service.yaml`. Put the following content in that file.
```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: httpbin-app
  labels:
    app: httpbin-app
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 80
      protocol: TCP
      name: http
  selector:
    app: httpbin
```
Apply the file to the cluster using the following command.
```bash
kubectl apply -f service.yaml
# service/httpbin-app created
```
This will create a service in the cluster which you can check by running the following command.
```bash
kubectl get service
# NAME          TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
# httpbin-app   NodePort    10.101.129.189   <none>        80:31268/TCP   4m8s
# kubernetes    ClusterIP   10.96.0.1        <none>        443/TCP        35m
```

We have all the required Deployment, Service and Pods running on the cluster. Now we will install Kong API Gateway in our cluster. We will be using `helm` for this purpose.
```bash
helm repo add kong https://charts.konghq.com
helm repo update
helm install kong kong/ingress -n kong --create-namespace
```
Run the above three commands in you terminal. The first command will add helm chart repository for Kong in your local helm configuration. The second command will update the local cache of charts from all repositores. And the third command will deploy the `kong/ingress` helm chart into our kubernetes cluster. Helm will take the chart, process it and applies the resulting kubernetes resources into the cluster. To know more about helm charts follow [this link](https://helm.sh/docs/topics/charts/).

While installing the Kong using the helm command we have passed `-n kong --create-namespace` parameter. We can specify a namespace using the `-n` option, in our case we set in to **kong** namespace. In case there is no namespace found with the name **kong**, `--create-namespace` will create one for us.

Check all the resources created by the kong helm chart in your kubernetes cluster passing the namespace *kong* as follow.
```bash
➜ kubectl get pods -n kong
# NAME                              READY   STATUS    RESTARTS      AGE
# kong-controller-998d5b9f7-cn5x6   0/1     Running   2 (25s ago)   102s
# kong-gateway-5f764bcd8b-hpgs5     0/1     Running   0             102s

➜ kubectl get deployment -n kong
# NAME              READY   UP-TO-DATE   AVAILABLE   AGE
# kong-controller   1/1     1            1           118s
# kong-gateway      1/1     1            1           118s

➜ kubectl get service -n kong
# NAME                                 TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                         AGE
# kong-controller-metrics              ClusterIP      10.99.86.41      <none>        10255/TCP,10254/TCP             2m25s
# kong-controller-validation-webhook   ClusterIP      10.104.30.215    <none>        443/TCP                         2m25s
# kong-gateway-admin                   ClusterIP      None             <none>        8444/TCP                        2m25s
# kong-gateway-manager                 NodePort       10.101.23.4      <none>        8002:32008/TCP,8445:32265/TCP   2m25s
# kong-gateway-proxy                   LoadBalancer   10.107.229.161   <pending>     80:31087/TCP,443:31741/TCP      2m25s
```

Now that we have kong installed in our kubernetes cluster, we will configure the kong routes that will point to the httpbin app we deployed earlier.

For that create a new file `kong-routes.yaml` and fill it with the following content.
```yaml
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
   name: kong-routes
   annotations:
     konghq.com/strip-path: "true"
     konghq.com/plugins: key-auth
spec:
   ingressClassName: kong
   rules:
   - http:
      paths:
      - path: /httpbin
        pathType: ImplementationSpecific
        backend:
          service:
            name: httpbin-app
            port:
              number: 80
```
Apply the routes in the kubernetes cluster using the following command.
```bash
kubectl apply -f kong-routes.yaml
# ingress.networking.k8s.io/kong-routes created
```

In this stage we have everything setup in our kubernetes cluster. We have deployed out *httpbin* app in the cluster, we have created the service in the cluster, we have also installed kong gateway in out cluster and also configured the routes.

Now we will check if our application is running. For that we will open a tunnel between the service and our local machine. Run the following command in your terminal. 
```bash
minikube service kong-gateway-proxy -n kong
```
Note that, `kong-gateway-proxy` is a service created by helm chart for kong earlier.

After running the command you should see some output like following in your terminal.
```bash
[kong kong-gateway-proxy  http://127.0.0.1:65185
http://127.0.0.1:65186]
```
Open the first address `http://127.0.0.1:65185` in your favorate browser and you will see something like following.
![Setup Key Auth Plugin in Kong API Gateway on Kubernetes (Minikube)](root-url.png "Setup Key Auth Plugin in Kong API Gateway on Kubernetes (Minikube)")

This is because we haven't configured anything on the root path in the kong routes. As we have configured our httpbin app to the `/httpbin` path, so we will hit the `http://127.0.0.1:65185/httpbin` in the browser And you should see something like the following.
![Setup Key Auth Plugin in Kong API Gateway on Kubernetes (Minikube)](httpbin-app.png "Setup Key Auth Plugin in Kong API Gateway on Kubernetes (Minikube)")

At this point we have successfully deployed out app on kubernetes cluster and it is working. Now we will setup the **key-auth** plugin in the kong gateway. To do that we have to deploy a **KongPlugin**, **Secret** and **KongConsumer**  in our cluster.

Create a new file `auth.yaml` and insert following content in it.
```yaml
---
apiVersion: configuration.konghq.com/v1
kind: KongPlugin
metadata:
  name: key-auth
  annotations:
    kubernetes.io/ingress.class: kong
plugin: key-auth
config:
  key_names:
    - apikey
  hide_credentials: true
---
apiVersion: v1
kind: Secret
metadata:
  name: api-key-secret
  labels:
    konghq.com/credential: key-auth
type: Opaque
stringData:
  kongCredType: key-auth
  key: secret
---
apiVersion: configuration.konghq.com/v1
kind: KongConsumer
metadata:
  name: consumer
  annotations:
    kubernetes.io/ingress.class: kong
username: username
custom_id: "1234"
credentials:
  - api-key-secret
```
Run the following command to deploy it into the kubernetes cluster.
```bash
kubectl apply -f auth.yaml
# kongplugin.configuration.konghq.com/key-auth created
# secret/api-key-secret created
# kongconsumer.configuration.konghq.com/consumer created
```
Above we have deployed the KongPlugin for the `key-auth` where we specified the key name as "apikey". We have to pass this key while makeing a request to our httpbin app. Then we have deployed the Secret that contains the secret value for the api key which is in our case **secret**. We have to pass this secret as the value for the api key in the header. And finally we have deployed the KongConsumer into the cluster.

Now try to access the httpbin app by hitting `http://127.0.0.1:65185/httpbin` from your browser.
![Setup Key Auth Plugin in Kong API Gateway on Kubernetes (Minikube)](error.png "Setup Key Auth Plugin in Kong API Gateway on Kubernetes (Minikube)")

As you can see we are getting a message saying that API key is not found in the request. We have to pass the API key in the header like this **"apikey: secret"**

We will use `curl` command line tool to make the call this time. You can see that we got the html document from the httpbin app.
```bash
curl -H "apikey: secret" http://127.0.0.1:65185/httpbin
# <!DOCTYPE html>
# <html lang="en">

# <head>
#     <meta charset="UTF-8">
#     <title>httpbin.org</title>
#     <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Source+Code+Pro:300,600|Titillium+Web:400,600,700"
#         rel="stylesheet">
#     <link rel="stylesheet" type="text/css" href="/flasgger_static/swagger-ui.css">
#     <link rel="icon" type="image/png" href="/static/favicon.ico" sizes="64x64 32x32 16x16" />
#     <style>
#         html {
#             box-sizing: border-box;
#             overflow: -moz-scrollbars-vertical;
#             overflow-y: scroll;
#         }
```

### Conclusion
In this article we have deployed an app in the kubernetes cluster. Then we have installed Kong API Gateway in it. And finally setup the *key-auth* plugin in the Kong for the authentication. We have also utilized the tools minikube, kubectl and helm to do that. Hope you have learned something new from this article.

---

The full code of this article can be found in [this repository](https://github.com/nahidsaikat/blog-post-code/tree/master/setup-key-auth-plugin-in-kong-api-gateway-on-kubernetes-minikube).
