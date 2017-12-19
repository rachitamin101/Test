Feature: Search Engine 

 Scenario: Test that a User can search for Halifax and navigate to the their website from the results list

	Given I go on the website "https://google.com" the async way
	 When I enter "Halifax" into the "Search box" field
      And I click the "search" button
     Then I should go to the results page
	  And I click the "=Halifax" URL
	 Then I land on "Halifax" home page
