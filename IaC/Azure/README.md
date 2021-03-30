# Scripts and templates for deploy variamos applications in Azure

## IaC\Azure\001-createContainerVariamosWeb.azcli

Az CLI script for [Variamos-Web](http://variamos-web.eastus.azurecontainer.io) deployment.

## IaC\Azure\002-createContainerVariamos.azcli

Az CLI script for [Variamos](http://variamos.eastus.azurecontainer.io) deployment.

# References

[Quickstart: Deploy a container instance in Azure using the Azure CLI](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart)
[Container groups in Azure Container Instances](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-container-groups)

# Create local image and then publish to Docker Registry

From root folder run this commands 

1. Create the local image

    `docker build --rm -t jsoto25/variamos-web:latest .`

1. Run local container

    `docker run -it -p 8080:80 --rm --name variamos-front jsoto25/variamos-web:latest`

1. Publish to Docker Registry

    `docker push jsoto25/variamos-web:latest`
