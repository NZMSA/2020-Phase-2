# Advanced Feature: Testing
This year's testing section will be split into the following sections:
 - Unit Testing
 - Behavioural Driven Testing (Automated Acceptance testing)

You will only have to implement one of the above if you choose to add testing as one of your advanced features.
## Assignment Criteria
To pass this as advanced feature in your phase 2 project you must do one of the above.
Your test must have atleast 3 tests overall.

# About Unit Testing

Unit Testing is a form of Automated Testing, which is simply the practice of writing code that tests your application code. An individual test will pass some inputs to your code and make sure that the outputs are correct. If they aren't, the test fails. Otherwise, it passes. A Unit Test is the lowest form of test and tests an individual _unit_ of software - that is, individual methods/functions and classes.

There are quite a few other categories of software testing. The main other kind of automated test that you'll hear talked about is the integration test, which tests multiple parts of your software working together along with external dependencies such as databases (making sure your units work when you put them together). We won't be covering integration testing as it's more important for projects of bigger scope, but it's good to be aware of what it is.

## Why do we Unit Test?

Everyone, no matter how much or little they plan it, tests their code. Surely at some point in the past when you've been making a Web App or some kind of GUI, you've run it and made sure all the UI elements do what they're supposed to. Alternatively, maybe you've made a quick little command line script that lets you input values to be passed to a function, and then outputs the results. Those are both forms of testing!

The problem with testing your software manually like this is that as your application grows in complexity, it takes longer and longer to go through the steps, because it becomes more difficult to reach the desired functionality (e.g. more clicks of the UI). Automatically testing our code is much more efficient, and generally speaking the time it takes to run tests increases more linearly.

Unit Testing provides confidence that your code is working _before_ you deploy it - less bugs in production, yay! Tests can be run every time code is deployed, so if any breaking changes are made they will be detected. This means you can refactor or make additions more freely knowing that your functionality is not being compromised.

Why Unit Testing specifically? Why not just test our program as a whole and cover more code in a shorter amount of time? Well, the problem is that when you test multiple components as a black box, you have no way of telling what exact line(s) of code caused the bug.
## When to Unit Test

One of the biggest debates surrounding software testing is whether or not you should write your test _before_ or _after_ the actual code. Many people say you should write your tests for a class/module before you implement it. This is known as Test-Driven Development (TDD). Whether or not this is actually the case in practice is another story...

The main arguments for TDD are that it provides clarity and motivation for simplicity. By writing the tests for a unit before you implement it, you get to think about the requirements of your code so you get a better idea of how to write it because you understand what it should do. Additionally, you shouldn't theoretically add any unnecessary functionality because you're only writing the code so that it passes the tests - ergo, simplicity!

Sometimes requirements are liable to change and you can get a better understanding of the problem by going ahead and solving it. Hence, a lot of developers prefer to write tests after the code is written. The problem with this is that it can be hard to stay "on topic" and it's easy to write redundant code.

However, as new programmers / being new to a certain language or framework, it's quite infeasible to write our tests beforehand because we might not even understand how the code is going to work. This is precisely why we've waited until a later module of MSA phase 2 to show you how to do unit tests for an ASP.NET Core web API.

## Writing Unit Tests
I’ll be using a modified backend project from phase 1 to do some example unit testing. Anyone who did the backend for phase 1 will be familiar with most of the code but there will be extra classes and some refactor done to make the testing easier. Be aware on you own project you many need to refactor code in order to to make testing easier. I highly recommend looking at the repository pattern and implementing this coding pattern to make testing easier.

## Creating the Project

Have the StudentSIMS solution open in Visual Studio. Start by adding an NUnit project to it.

File -> New -> Project

Scroll down to NUnit Test Project (.Net Core), select it, then click "Next".

![Create Project 1](./images/Annotation%202020-09-01%20020514.png
)

Give the project a name in the format "[project being tested].Tests, Make sure to select "Add to solution" as shown in the image below, then click "Create".
![Create Project 2](./images/Annotation%202020-09-01%20020541.png
)

### Setting up the Test Project
Start by adding a reference from the newly created test project to the API project. Right-click on the unit test project in the solution explorer:

Then go Add -> Project Reference... -> Select StudentSIMS

![Create Project](./images/Annotation%202020-09-01%20020930.png
)

Now we are going to add a couple of packages that will let us use a mock database (More on this in a bit). Right-click on the project solution and select "Manage NuGet Packages for solution" Add to the solution:

- Moq
- NUnit
- Nunit Test Adapter

### Now we can start testing.
Delete the default UnitTest.cs file.

There are 2 Test that I will show as an example. One for classes that have database access and the other with HTTP request from controllers. The database version has a significant more setup in the arrange to recreate the return data from the database.

### Testing code that has database access

Right-click on the test project

Delect (Add -> New Item)

Create a new .cs and call it CountryIdentifiersUnitTests.cs and add the follow code to the class.

```C#
[Test]
        public void GetAllCountries_ReturnsAllRecords()
        {
            //This test is the basic layout if you want to simulate database queries using linq.
            //Arrange
            var countries = new List<CountryIdentifiers>
            {
                new CountryIdentifiers()
                {
                    CountryId = 1,
                    CountryCode = "NZ",
                    PhoneExtension = "64"
                },
                new CountryIdentifiers()
                {
                    CountryId = 2,
                    CountryCode = "AU",
                    PhoneExtension = "61"
                }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<CountryIdentifiers>>();
            mockSet.As<IQueryable<CountryIdentifiers>>().Setup(m => m.Provider).Returns(countries.Provider);
            mockSet.As<IQueryable<CountryIdentifiers>>().Setup(m => m.Expression).Returns(countries.Expression);
            mockSet.As<IQueryable<CountryIdentifiers>>().Setup(m => m.ElementType).Returns(countries.ElementType);
            mockSet.As<IQueryable<CountryIdentifiers>>().Setup(m => m.GetEnumerator()).Returns(countries.GetEnumerator());

            var mockContext = new Mock<StudentContext>();
            mockContext.Setup(c => c.CountryIdentifiers).Returns(mockSet.Object);
            //Act
            var service = new CountryIdentifiersRepository(mockContext.Object);
            var results = service.GetAllCountries().ToList();

            //Assert
            Assert.AreEqual(2, results.Count());
            Assert.AreEqual("NZ", results[0].CountryCode);
            Assert.AreEqual("AU", results[1].CountryCode);

        }
```
<details><summary>Arrange Snippet</summary>
Here we are creating some dummy data as a list then making it a queryable list so that we can use linq on it

```C#
var countries = new List<CountryIdentifiers>
            {
                new CountryIdentifiers()
                {
                    CountryId = 1,
                    CountryCode = "NZ",
                    PhoneExtension = "64"
                },
                new CountryIdentifiers()
                {
                    CountryId = 2,
                    CountryCode = "AU",
                    PhoneExtension = "61"
                }
            }.AsQueryable();
```
Here we are using moq package to fake our Dbset (table in our database) and setting it up so whenever any method calls the database we return our fake data that we have set (i.e. countries). We are doing this so that we can remove the dependency of using a database. InMemory can work for this situation however due it doesn't work too well for relational databases.

```C#
var mockSet = new Mock<DbSet<CountryIdentifiers>>();
            mockSet.As<IQueryable<CountryIdentifiers>>().Setup(m => m.Provider).Returns(countries.Provider);
            mockSet.As<IQueryable<CountryIdentifiers>>().Setup(m => m.Expression).Returns(countries.Expression);
            mockSet.As<IQueryable<CountryIdentifiers>>().Setup(m => m.ElementType).Returns(countries.ElementType);
            mockSet.As<IQueryable<CountryIdentifiers>>().Setup(m => m.GetEnumerator()).Returns(countries.GetEnumerator());
            
```
Now that we have set a Dbset we need to set it up  so that when the context gets called it returns the Dbset we are mocking.

```C#
            var mockContext = new Mock<StudentContext>();
            mockContext.Setup(c => c.CountryIdentifiers).Returns(mockSet.Object);
```

</details>

<details><summary>Act Snippet</summary>
Here wer are creating our an instance of our class where we pass/inject in our mocked context. This means that anytime our context gets called we return data that we have set in the Arrange snippet.

```C#
            var service = new CountryIdentifiersRepository(mockContext.Object);
            var results = service.GetAllCountries().ToList();
```

</details>

<details><summary>Assert Snippet</summary>
Here we are now checking the return results from our method that we tested. We are first checking if the it returned the correct amount. Then checking if the results are both the ones we have set. Normally you would have one assert per test but sometimes you can have multiple.

```C#
            Assert.AreEqual(2, results.Count());
            Assert.AreEqual("NZ", results[0].CountryCode);
            Assert.AreEqual("AU", results[1].CountryCode);
```

</details>

### Testing code that doesn't access the database.

Create a new file 

Right-click on the test project -> add -> New Item

Create a new .cs and call it StudentControllerTest.cs and add the follow code.

```C#
        [Test]
        public void GetStudentPhoneNumberWithExtension_ReturnsPhoneNumberWithCorrectExtension()
        {
            //Arrange
            Student student = new Student { 
                studentId = 1, 
                firstName = "firstname 1", 
                lastName = "lastname 1", 
                phoneNumber ="555555555" 
                };

            var mockRepo = new Mock<ICountryIdentifierRepository>();
            mockRepo.Setup(c => c.GetStudentById(It.IsAny<int>())).Returns(student);
            mockRepo.Setup(c => c.GetCountryExtension(It.IsAny<string>())).Returns("64");

            //Act
            var controller = new StudentsController(mockRepo.Object);
            var results = controller.GetStudentPhoneNumberWithExtension(student.studentId);

            //Assert
            Assert.IsNotNull(results);
            Assert.AreEqual("64555555555", results.Value.ToString());
        }
```
<details><summary>Arrange Snippet</summary>
Here we are creating our student with some mock data. We then create a mock version of ICountryIdentifierRepository.cs so that we can fake the return data from GetStudentById(), and GetCountryExtension(). The reason this is done is because we don't care what the functions other than the one we test are doing. We assume the other functions already have unit tests so there is no need to test it in this test case.

Note: I am using a interface version of the CountryIdentifierRepositry because it makes it easier to test. ICountryIdentifierRepositry is just basically a specification for what functions have to be implemented.

```C#
            //Arrange
            Student student = new Student { 
                studentId = 1, 
                firstName = "firstname 1", 
                lastName = "lastname 1", 
                phoneNumber ="555555555" 
                };

            var mockRepo = new Mock<ICountryIdentifierRepository>();
            mockRepo.Setup(c => c.GetStudentById(It.IsAny<int>())).Returns(student);
            mockRepo.Setup(c => c.GetCountryExtension(It.IsAny<string>())).Returns("64");
```
</details>

<details><summary>Act Snippet</summary>
Here we create the controller and pass in our mock repository into it. We also call the function we are testing and storing the result.

```C#
            var controller = new StudentsController(mockRepo.Object);
            var results = controller.GetStudentPhoneNumberWithExtension(student.studentId);
```
</details>
<details><summary>Assert Snippet</summary>
In the assert portion we check the results aren't null (meaning that there is a student with that Id) and that the valued return from the method is what we expected.

```C#
            Assert.IsNotNull(results);
            Assert.AreEqual("64555555555", results.Value.ToString());
```

</details>

<details><summary>Note about Student Controller</summary>
So you may have notice that I have to inject the mock repository into my controller. I have created a second contstructor explicitly for this repo. You may have to do this if you plan to unit test. I have also been following the repository pattern to allow me to test more easily. Repository pattern calls to seperate the Data access layer from your control logic and business logic. In this case my controller shouldn't have the context injected at all. It also means my current student controller methods will have to move to a different file (e.g. StudentRepository). Then the controller will simply take in the repository instead of the current context we have.

</details>

# About Automated Acceptance test
Automated acceptance testing is simply code that is written to test the functionality of the system without regard for the implementation. An example of this is user acceptance test where we get the core business users to test if the system works as expected.
For example, on the phase 2 full stack project we would have multiple scenarios we want to test 

- If I can click a cell and pick a colour, I expect the cell to change colour.
- If I pick a cell already with a colour, I expect that the cell will change the colour of my choice
- Etc

Acceptance testing is all about having different scenarios and inputs and making sure that we have the correct outputs when we interact with the system. While we can get a user to do this type of testing, it becomes an issue on very large systems. This is due to the need to verify all functionalities of the system still work after any changes and updates to the system (i.e. backend implement changes).


## When and why to Automated Acceptance test?

Acceptance testing is most common when the lifespan of a project is expected to continue for a long period of time. This means that the project will undergo many releases and many fixes over its lifetime. To ensure that the system’s core functions work as the system get updated, we have acceptance tests. These acceptances test go through most if not all the core functionality of the project. 
Say for example you are a bank and are updating how transactions get recorded in the backend, but you want to keep the frontend the same. Once the changes are made, we need to check if the system works in different scenarios: 
- Does the transaction show up?
- Can a transaction be made? 
- Can a transaction be received? 
- Does all the information get returned correctly?
- etc

If changes are frequent enough that it requires people to repeated test many different scenarios, then it might be a good idea to implement some automated acceptance tests.
If a project is only delivered once without the expectation of further support, then in might not make sense to add to the project. Another consideration is the cost of manually getting someone to execute the acceptance testing vs automating it. While on a smaller system it might not make sense to implement; on a larger system investing into automated acceptance test might more cost effective. 

## Writing BDD Tests
For the testing I will be testing the login feature for [http://en.reddit.com/](http://en.reddit.com/)

Before we start you will need to install some extensions for us to run the tests. 

### Setup
In Visual Studio 2019 -> Extension -> Manage Extensions

Search and install the following:
- Nunit 3 Test Adapter
- SpecFlow for Visual Studio 2019

You will need to restart Visual Studio for the extension to install.

### Creating the project

Open Visual Studio -> Create New Project -> Search for SpecFlow Project

![Create Specflow 1](./images/Annotation%202020-09-07%20014120.png)

Give your project a name.

Set the framework to .net core 3.1 and the test framework to Nunit

![Create Specflow 1](./images/Annotation%202020-09-07%20014525.png)

Delete the initial files the come with project:
- Caculator.feature 
- CalculatorStepDefinition.cs 

In the Features folder -> Add New Item - > Specflow Feature File and name it Login.Feature

![Create Specflow 1](./images/Annotation%202020-09-07%20014635.png)

Copy and Paste the following code into the file

```Gherkin
Feature: Login

@smoke
Scenario: Login to app
	Given I launch the website
	And I enter the my username and password
		| UserName | Password |
		| raymond-msanz-test | redacted |
	When I click on the login button
	Then the I should see my username

```
#### Feature Files
Feature files are the steps our theoretical user would be doing if they had to interact with our application. In our case we have called it login which indicates we want to test the system’s behaviour when we try to login
Extra: The language this is written in is called Gherkin. There are some neat things you can do with this file to make more complex test. For now, I will show something simple.

#### Keywords
Feature
- Keyword is to provide a high-level description of a software feature, and to group related scenarios.

Scencario 
- key word give the specification of steps we want to use in our test

Steps:
- Given is to descrive the initial conditions 
- When descrive and event or action taken
- Then our expected outcome
- And can be used to chain any of the above

Before we can start writing code we need to install some nuget packages.

- Selenium.WebDriver
- Selenium.WebDriver.ChromeDriver
- Specflow
- Specflow.Nunit
- Specflow.Tools.Msbuild.Generations
- SpecFlow.Assist.Dynamic

Right click on the feature file in the code editor and select generate step definition. 

![](./images/Annotation%202020-08-31%20024008.png)

Click generate and save to the steps folder as LoginSteps.cs

![](./images/Annotation%202020-09-07%20015238.png)

> At this point the feature file should pick up the steps from LoginStep.cs but do not worry if they do not get picked up sometimes Visual Studio takes some time to make the connection. As soon as you build and/or run the tests it should pick them up.

Add a new folder called Pages to the project and create a new class called FrontPage.cs. This class is where all our code is written to interact with initial reddit page.

Add the following code to FrontPage.cs.
```C#
    public class FrontPage
    {
        public IWebDriver WebDriver { get; }
        public FrontPage(IWebDriver webDriver)
        {
            WebDriver = webDriver;
        }
        public IWebElement txtUsername => WebDriver.FindElement(By.Name("user"));
        public IWebElement txtPassword => WebDriver.FindElement(By.Name("passwd"));
        public IWebElement btnLogin => WebDriver.FindElement(By.XPath("//*[@id=\"login_login-main\"]/div[4]/button"));
        public IWebElement lnkPreference => WebDriver.FindElement(By.XPath("//*[@id=\"header-bottom-right\"]/ul/li/a"));

        public void ClickLoginButton() => btnLogin.Submit();
        public void Login(string username, string password)
        {
            txtUsername.SendKeys(username);
            txtPassword.SendKeys(password);
        }
        public bool IsXpathExists() => lnkPreference.Displayed;
    }
```
<details><summary>Explaination for the code snippet</summary>
First we have a constructor where we pass our web driver into in our case this will be chrome. We are passing the web driver as a dependency so that we can have a browser to interact with.

```C#
public IWebDriver WebDriver { get; }
public FrontPage(IWebDriver webDriver)
{
    WebDriver = webDriver;
}
```
The pieces of code below are looking at the website's elements and trying to find them by Name and by their XPath. XPath is the relative path of where the element lies in the DOM.

You can find the Name by right clicking inspect on the element you wish to get. If no Name is provided for it you can get the XPath from right clicking and selecting Copy -> XPath

![](./images/Annotation%202020-08-31%20030517.png)

```C#
public IWebElement txtUsername => WebDriver.FindElement(By.Name("user"));
public IWebElement txtPassword => WebDriver.FindElement(By.Name("passwd"));
public IWebElement btnLogin => WebDriver.FindElement(By.XPath("//*[@id=\"login_login-main\"]/div[4]/button"));
public IWebElement lnkPreference => WebDriver.FindElement(By.XPath("//*[@id=\"header-bottom-right\"]/ul/li/a"));
```

ClickLoginButton() is using selenium's Submit function to allow us to interact with buttons on the site.

Login() is also using selenium's sendkey to populate the login and password fields.

IsXpathExists() is checking if there is a element that is shown at the Xpath we specified for lnkPerference. If this element only exist if the user has logged in which means it easy to check if the user has logged in from this check.


```C#
public void ClickLoginButton() => btnLogin.Submit();
public void Login(string username, string password)
{
    txtUsername.SendKeys(username);
    txtPassword.SendKeys(password);
}
public bool IsXpathExists() => lnkPreference.Displayed;
```

</details>

```C#
FrontPage frontPage = null;

[Given(@"I launch the website")]
public void GivenILaunchTheWebsite()
{
    IWebDriver webDriver = new ChromeDriver();
    webDriver.Navigate().GoToUrl("https://en.reddit.com/");
    frontPage = new FrontPage(webDriver);
}

[Given(@"I enter the my username and password")]
public void GivenIEnterTheMyUsernameAndPassword(Table table)
{
    dynamic data = table.CreateDynamicInstance();
    frontPage.Login((string)data.UserName, (string)data.Password);
}

[When(@"I click on the login button")]
public void GivenIClickOnTheLoginButton()
{
    frontPage.ClickLoginButton();
}

[Then(@"the I should see my username")]
public void ThenTheIShouldSeeMyUsername()
{
    Assert.That(frontPage.IsXpathExists, Is.True);
}

```
<details><summary>Explaination for the code snippet</summary>

In our given statement we set up the web driver/chrome window and set it to the site we want

We pass this onto the frontPage object so that we can use the selenium function we wrote in the previous steps

We pass the data from our feature file which was formatted as a table. We use CreateDynamic to format this is something we can parse.

Then we act on the the login feature using CLickLoginButton
And then we check that the resulting output is true.
</details>

We are now ready to run our tests. Right click the solution and click run test.
![](./images/Annotation%202020-09-07%20020826.png)

A chrome window will open up and you will see our automated test go through the steps we specified in our feature file and the code we wrote to execute those steps

![](./images/Annotation%202020-09-07%20020948.png)

# Useful Links
- [Testing with a mocking framework](https://docs.microsoft.com/en-us/ef/ef6/fundamentals/testing/mocking)
- [Unit Testing: MOQ Framework](https://www.youtube.com/watch?v=dZ2Psa_Bn2Q)
- [Unit test controller logic in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/testing?view=aspnetcore-3.1)
- [Unit test basics](https://docs.microsoft.com/en-us/visualstudio/test/unit-test-basics?view=vs-2019)
- [Repository Pattern with C# and Entity Framework, Done Right | Mosh](https://www.youtube.com/watch?v=rtXpYpZdOzM)
- [Unit Testing C# Code - Tutorial for Beginners](https://www.youtube.com/watch?v=HYrXogLj7vg)
- [Getting started with BDD using Specflow .NET Core 3.1 (C#)](https://www.youtube.com/watch?v=O5oHiBD5Lvk)
