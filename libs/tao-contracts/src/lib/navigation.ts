export interface NavigationItem {
  label: string;
  route: string;
  icon: string;

  /**
   * Child navigation displayed when the current URL
   * matches the contextual route.
   *
   * Example:
   * /campaigns/:campaignId
   */
  contextRoute?: string;

  /**
   * Contextual navigation items.
   */
  children?: NavigationItem[];
}

export interface UserSummary {
  id: string;
  displayName: string;
  role: string;
}
