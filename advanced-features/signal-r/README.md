# Introduction

Welcome back! Hope you have enjoyed building this year pixel canvas project so far! 😀

In this section, we will be taking a look at the basic implementation of signalR, an open-source library that adds a real-time functionality to your web app. 

Real-time web functinality enables server-side code to push content to connected-clients as it happens in real-time! 

## But why do we need a real-time functionality? 

As you are aware with the current implementation, our front end React application relies API calls polling every 10 seconds to fetch for any changes on the canvas from the database. On top of this, updating a square adds extra calls to the back end to save the change to the database. 

This means that if you have 100 player connected to your app making a request every 10 seconds, at least 6000+ calls will be make in just 10 minutes! 

Furthermore, as each player simultaneously changes the canvas, none of them will actually see the changes happen until their 10 seconds window elapses. 

So, let's explore how we can make our canvas truly real-time, and reduce number of API calls to just two!

## SignalR

SignalR is perfect for apps that requires high frequency updates from the server. Here are some candidates

- gaming
- social networks
- voting
- auction
- map
- chat
- alerts, many other apps use notifications.

In this section, we will be implementing ASP.NET Core SignalR to our back end web api, which acts as a hub sending updates to each connected client (browser) as changes happened. 

We will also implements a JS/TypeScript SignalR client side library to our front-end which will listen for any updates from our back end and re-render our UI in real-time! 

Read more: [Real-time ASP.NET with SignalR](https://dotnet.microsoft.com/apps/aspnet/signalr)


<p align="center">
    <img src="images/signalr-diagram.png" width="500" />
</p>

## Demo
Here you can see that updating a square on one canvas instantly updates other instances (right screen) of the canvas in real-time. 

<p align="center">
    <img src="images/signalr-demo.gif" width="500" />
</p>


[Try out the live demo here](https://signalr-frontend-prototype-msa2020.azurewebsites.net/)

# Setting up the SignalR back-end hub

We will be picking up from the previous completed pixel application. Check-out previous sections if you haven't done so.

In this section we will first setup the SignalR hub in our back end web api.  

## 1. Installing SignalR library

Head to Nuget package manager for your project and install `Microsoft.AspNetCore.SignalR.Core` package.

<p align="center">
    <img src="images/installing-the-nuget-packages.png" width="1000" />
</p>

## 2. Implementing SignalR hub class

1. Add a new folder `Hubs` and a new class `SignalRHub.cs`

<p align="center">
    <img src="images/signalrhub-class.png" width="500" />
</p>

2. 