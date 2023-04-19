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
1. `kubectl replace --force -f namespace.yml`
* Choose secret or configmap folder, set the env vars in configmap.yml, or set secret.yml
2. `kubectl replace --force -f secret/secret.yml && kubectl replace --force -f secret/deployment.yml` or `kubectl replace --force -f configmap/configmap.yml && kubectl replace --force -f configmap/deployment.yml`
3. `kubectl replace --force -f service.yml`

Ensure you have [xclip](https://howtoinstall.co/en/xclip) installed

5. `minikube service -n node-namespace node-service --url | xclip -selection clipboard`

After this command, the local app url running in K8S will be at the clipboard, just paste it on Postman or any another program 
to test the application endpoints
