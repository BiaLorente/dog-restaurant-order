Feature: Create an order

  Scenario: Successfully create an order
    Given I have valid customer ID "customer1" and combos
    When I create an order
    Then I should receive the order ID