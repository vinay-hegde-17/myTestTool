const { test: base, expect } = require('./auth.fixture');
const ItDeclarationClient = require('../api/clients/itDeclaration.client');

const test = base.extend({
    itDeclarationClient: async ({ request, qaToken }, use) => {
        await use(new ItDeclarationClient(request, qaToken));
    }
});

module.exports = { test, expect };