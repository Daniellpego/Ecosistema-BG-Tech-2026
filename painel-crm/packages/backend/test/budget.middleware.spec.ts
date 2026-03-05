import { isBudgetExceeded, reserveBudget, addTenantSpend } from '../../../ops/redis/budget.client';
describe('Budget Middleware', () => {
  const tenantId = 'tenant_test';
  it('should not exceed budget initially', async () => {
    const exceeded = await isBudgetExceeded(tenantId);
    expect(exceeded).toBe(false);
  });
  it('should reserve budget and then exceed', async () => {
    await reserveBudget(tenantId, 100000);
    const exceeded = await isBudgetExceeded(tenantId);
    expect(exceeded).toBe(true);
  });
  it('should add spend', async () => {
    await addTenantSpend(tenantId, 1000);
    const exceeded = await isBudgetExceeded(tenantId);
    expect(exceeded).toBe(true);
  });
});
