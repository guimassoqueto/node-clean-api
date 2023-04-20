This file is just a compiled of the other .yml files, to build the deployment in a single command.

### How to run
Insert the Mongo remote URL in line 12 of *shortcut.yml* and run  
`kubectl replace --force -f shortcut.yml`  

Then:  
`minikube service -n node-namespace node-service --url | xclip -selection clipboard`  

After this command, the local app url running in K8S will be at the clipboard, just paste it on Postman or any another program to test the application endpoints
