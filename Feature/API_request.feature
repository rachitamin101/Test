Feature: API Request

    Background:
        Given I am a client


 Scenario: Request a single item with child objects
        When I request the comment "1" with:
            | `_expand` | post |
        Then the response has the following attributes:
            | attribute    | type   | value |
            | name         | string | id labore ex et quam laborum |
            | email        | string | Eliseo@gardner.biz |
            | body         | string | laudantium enim quasi est quidem magnam voluptate ipsam eos\\ntempora quo necessitatibus\\ndolor quam autem quasi\\nreiciendis et nam sapiente accusantium |
            | post : title | string | sunt aut facere repellat provident occaecati excepturi optio reprehenderit |
            | post : body  | string | quia et suscipit\\nsuscipit recusandae consequuntur expedita et cum\\nreprehenderit molestiae ut ut quas totam\\nnostrum rerum est autem sunt rem eveniet architecto |

    Scenario: Request an item within a list of items
        When I request a list of comments with:
            | `_expand` | post |
            | Post ID   | 1    |
        Then the response is a list of more than 1 comment
        And one comment has the following attributes:
            | attribute    | type   | value |
            | name         | string | id labore ex et quam laborum |
            | email        | string | Eliseo@gardner.biz |
            | body         | string | laudantium enim quasi est quidem magnam voluptate ipsam eos\\ntempora quo necessitatibus\\ndolor quam autem quasi\\nreiciendis et nam sapiente accusantium |
            | post : title | string | sunt aut facere repellat provident occaecati excepturi optio reprehenderit |
            | post : body  | string | quia et suscipit\\nsuscipit recusandae consequuntur expedita et cum\\nreprehenderit molestiae ut ut quas totam\\nnostrum rerum est autem sunt rem eveniet architecto |

    Scenario: Match an item with a list of items
        When I request the post "1" with:
            | `_embed`  | comments |
        Then the response has the following attributes:
            | attribute         | type   | value |
            | title             | string | sunt aut facere repellat provident occaecati excepturi optio reprehenderit |
            | body              | string | quia et suscipit\\nsuscipit recusandae consequuntur expedita et cum\\nreprehenderit molestiae ut ut quas totam\\nnostrum rerum est autem sunt rem eveniet architecto |
        And the response has 1 comment with attributes:
            | attribute | type   | value |
            | name      | string | id labore ex et quam laborum |
            | email     | string | Eliseo@gardner.biz |
            | body      | string | laudantium enim quasi est quidem magnam voluptate ipsam eos\\ntempora quo necessitatibus\\ndolor quam autem quasi\\nreiciendis et nam sapiente accusantium |
        And the response has five comments with attributes:
            | attribute | type    | value |
            | Post Id   | integer | 1     |
        And the response has at least five comments
