Feature: Contact Us

Scenario: Viewing the contact us options

        Given I have land on the "home" page
        When I click on the "Contact" Button
        Then I should go to the "Contact Us"  page
        And I should see the site header "Contact Us"
        And I should see 6 option like 
          | I want to call lloyds              |
          | I’ve lost my card                  |
          | I’ve noticed suspicious activity   |
          | ask a question                     |
          | self service and make a compliant  |
