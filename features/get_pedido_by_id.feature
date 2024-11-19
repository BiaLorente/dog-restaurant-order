Feature: Get order by ID

  Scenario: Successfully get an order by ID
    Given there is an order with ID "1"
    When I request the order by ID "1"
    Then I should receive the order details

  Scenario: Fail to get an order by ID
    Given there is no order with ID "3"
    When I request the order by ID "3"
    Then I should receive an error message "Pedido with ID 3 not found."