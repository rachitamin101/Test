Feature: Array Users 

    Background:
        Given I am a client


     Scenario: Multiple levels in array
        When I request a list of posts with:
            | `_embed`  | comments |
        Then the request is successful
        And one post has one comment with attributes:
            | attribute | type    | value |
            | Id        | integer | 1     |
        And at least ten posts contain a list of five comments
        
