import { CampaignSummary, NavigationItem } from '../public-api';

describe('TAO contracts', () => {
  it('supports typed navigation and campaign summaries', () => {
    const item: NavigationItem = { label: 'Dashboard', route: '/', icon: 'grid' };
    const campaign: CampaignSummary = {
      id: 'campaign-1',
      name: 'Backend Engineer',
      role: 'Engineering',
      status: 'Active',
      candidates: 42,
      updatedAt: 'today',
    };

    expect(item.route).toBe('/');
    expect(campaign.status).toBe('Active');
  });
});
