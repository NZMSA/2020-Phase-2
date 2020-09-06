Feature: Login
	This is our login feature. Here is where we descrive what the feature is.
@smoke
Scenario: Login to app
	Given I launch the website
	And I enter the my username and password
		| UserName | Password |
		| raymond-msanz-test | redacted |
	When I click on the login button
	Then the I should see my username
