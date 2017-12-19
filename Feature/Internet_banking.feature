Feature: Open lloydsbank homepage for internet banking page

    Scenario: Logon to Internet bank option Personsal Banking
     
        Given I have land on the "home" page
        When I click on the "Logon" Button
        And I select the option for "personal" banking 
        Then I should go to the personal banking page 
        And I should see the site header "personal banking"

    Scenario: Logon to Internet bank option Business Banking
     
        Given I have land on the "home" page
        When I click on the "Logon" Button
        And I select the option for "business" banking 
        Then I should go to the business banking page 
        And I should see the site header "business banking"
