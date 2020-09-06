using MSA_Phase2_E2E.Pages;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace MSA_Phase2_E2E.Steps
{
    [Binding]
    public class LoginSteps
    {
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
    }
}
