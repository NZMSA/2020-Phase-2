using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Text;

namespace MSA_Phase2_E2E.Pages
{
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
}
