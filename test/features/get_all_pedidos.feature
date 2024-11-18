Feature: Get all orders

  Scenario: Successfully get all orders
    Given there are orders in the system
    When I request all orders
    Then I should receive a list of orders
    And the orders should be filtered and sorted