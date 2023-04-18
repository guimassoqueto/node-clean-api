## Kubernetes files

To run the application in a kubernetes local cluster, follow the steps bellow:

### Requirements

* Ensure you have the [latest version of Minikube](https://minikube.sigs.k8s.io/docs/start/)
* Ensure you have the [latest version of Kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)  
* Ensure the variable `MONGO_URL` in [configmaps.yml](configmaps.yml) is set, pointing to a valid database url

### Commands 
0. `minikube start`

Wait the minikube local cluster is up and running.

Run in sequence:
1. `kubectl apply -f namespace.yml`
2. `kubectl apply -f configmaps.yml`
3. `kubectl apply -f deployment.yml`
4. `kubectl apply -f service.yml`

To avoid re-run `minikube start` every time you change any of .yml files, run the command  
`kubectl replace --force -f <yml-file>`, where `<yml-file>` is the name of the file you have changed, fro example `kubectl replace --force -f namespace.yml`  
Be cautious running this command.

Ensure you have [xclip](https://howtoinstall.co/en/xclip) installed

5. `minikube service -n node-namespace node-service --url | xclip -selection clipboard`

After this command, the local app url running in K8S will be at the clipboard, just paste it on Postman or any another program 
to test the application endpoints
