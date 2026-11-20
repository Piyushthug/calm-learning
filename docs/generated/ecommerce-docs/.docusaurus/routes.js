import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', '98b'),
    exact: true
  },
  {
    path: '/search',
    component: ComponentCreator('/search', '044'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', 'fa5'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', 'bc2'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', 'e59'),
            routes: [
              {
                path: '/flows/inventory-check-flow',
                component: ComponentCreator('/flows/inventory-check-flow', '057'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/flows/order-processing-flow',
                component: ComponentCreator('/flows/order-processing-flow', '2e8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/nodes/admin-actor',
                component: ComponentCreator('/nodes/admin-actor', 'e92'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/nodes/api-gateway',
                component: ComponentCreator('/nodes/api-gateway', '7ec'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/nodes/customer-actor',
                component: ComponentCreator('/nodes/customer-actor', '20c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/nodes/ecommerce-platform-system',
                component: ComponentCreator('/nodes/ecommerce-platform-system', '6bc'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/nodes/inventory-database',
                component: ComponentCreator('/nodes/inventory-database', '71f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/nodes/inventory-service',
                component: ComponentCreator('/nodes/inventory-service', '00e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/nodes/oauth2-auth-server',
                component: ComponentCreator('/nodes/oauth2-auth-server', 'c91'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/nodes/order-database',
                component: ComponentCreator('/nodes/order-database', '07b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/nodes/order-service',
                component: ComponentCreator('/nodes/order-service', '580'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/nodes/payment-service',
                component: ComponentCreator('/nodes/payment-service', '2ad'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/nodes/rabbitmq-message-broker',
                component: ComponentCreator('/nodes/rabbitmq-message-broker', '590'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/admin-interacts-with-gateway',
                component: ComponentCreator('/relationships/admin-interacts-with-gateway', 'fab'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/customer-interacts-with-gateway',
                component: ComponentCreator('/relationships/customer-interacts-with-gateway', '473'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/gateway-to-auth-server',
                component: ComponentCreator('/relationships/gateway-to-auth-server', '06c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/gateway-to-inventory-service',
                component: ComponentCreator('/relationships/gateway-to-inventory-service', '733'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/gateway-to-order-service',
                component: ComponentCreator('/relationships/gateway-to-order-service', '141'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/inventory-service-to-db',
                component: ComponentCreator('/relationships/inventory-service-to-db', 'd88'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/order-service-to-db',
                component: ComponentCreator('/relationships/order-service-to-db', 'b61'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/order-service-to-rabbitmq',
                component: ComponentCreator('/relationships/order-service-to-rabbitmq', 'd02'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/order-to-payment-service',
                component: ComponentCreator('/relationships/order-to-payment-service', '903'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/platform-composed-of-services',
                component: ComponentCreator('/relationships/platform-composed-of-services', '51c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/rabbitmq-to-payment-service',
                component: ComponentCreator('/relationships/rabbitmq-to-payment-service', 'b46'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/',
                component: ComponentCreator('/', 'bea'),
                exact: true,
                sidebar: "docs"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
