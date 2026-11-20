module.exports = {
    docs: [
        {
            type: 'doc',
            id: 'index',
            label: 'Home',
        },
        {
            type: 'category',
            label: 'Nodes',
            items: [
                'nodes/customer-actor',
                'nodes/admin-actor',
                'nodes/api-gateway',
                'nodes/order-service',
                'nodes/inventory-service',
                'nodes/payment-service',
                'nodes/oauth2-auth-server',
                'nodes/rabbitmq-message-broker',
                'nodes/order-database',
                'nodes/inventory-database',
                'nodes/ecommerce-platform-system'
            ],
        },
        {
            type: 'category',
            label: 'Relationships',
            items: [
                'relationships/customer-interacts-with-gateway',
                'relationships/admin-interacts-with-gateway',
                'relationships/gateway-to-order-service',
                'relationships/gateway-to-inventory-service',
                'relationships/order-to-payment-service',
                'relationships/order-service-to-db',
                'relationships/inventory-service-to-db',
                'relationships/platform-composed-of-services',
                'relationships/gateway-to-auth-server',
                'relationships/order-service-to-rabbitmq',
                'relationships/rabbitmq-to-payment-service'
            ],
        },
        {
            type: 'category',
            label: 'Flows',
            items: [
                'flows/order-processing-flow',
                'flows/inventory-check-flow'
            ],
        },
    ],
};

