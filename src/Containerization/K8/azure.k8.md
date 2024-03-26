# Azure AKS

## Introduction

## Cluster

### Connect with AKS cluster on local

```sh
# 1.  login
az login  ## will display the user details on successful login

# 2. Add cluster to your local machine config
## i. Template
az aks get-credentials --resource-group <Resource-Group-Name> --name <Cluster-Name>

## ii. Replace Resource Group & Cluster Name
az aks get-credentials --resource-group DEMO_RSYSTEM_TESTING --name aks-demo-01

# 3. Fetch the details of cluster
## i. Check the current cluster / which is your default cluster, for that visit k8.md
## ii. List Kubernetes Worker Nodes
kubectl get nodes 
kubectl get nodes -o wide

# 4. Explore that
## i. List Namespaces
kubectl get namespaces
kubectl get ns

## ii. List Pods from all namespaces
kubectl get pods --all-namespaces

## iii. List all k8s objects from Cluster Control plane
kubectl get all --all-namespaces
```

## Create a static public IP for ingress controller

```sh
# Get the resource group name of the AKS cluster 
az aks show --resource-group omkr-demo-23-03-2024 --name aks-demo-23-03-2024-cluster --query nodeResourceGroup -o tsv

# TEMPLATE - Create a public IP address with the static allocation
az network public-ip create --resource-group <REPLACE-OUTPUT-RG-FROM-PREVIOUS-COMMAND> --name myAKSPublicIPForIngress --sku Standard --allocation-method static --query publicIp.ipAddress -o tsv

# REPLACE - Create Public IP: Replace Resource Group value
az network public-ip create --resource-group MC_omkr-demo-23-03-2024_aks-demo-23-03-2024-cluster_eastus --name myAKSPublicIPForIngress --sku Standard --allocation-method static --query publicIp.ipAddress -o tsv
```
