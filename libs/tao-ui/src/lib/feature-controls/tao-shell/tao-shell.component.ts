import { Component, computed, inject, input } from '@angular/core';

import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { filter, map, startWith } from 'rxjs';

import { toSignal } from '@angular/core/rxjs-interop';

import { NavigationItem } from '@tao/contracts';

import { TaoButtonComponent } from '../../native-controls/tao-button/tao-button.component';

@Component({
  selector: 'tao-shell',
  imports: [RouterLink, RouterLinkActive, TaoButtonComponent],
  templateUrl: './tao-shell.component.html',
  styleUrl: './tao-shell.component.scss',
})
export class TaoShellComponent {
  private readonly router = inject(Router);

  // ---------------------------------------------------------------------------
  // Inputs
  // ---------------------------------------------------------------------------

  readonly product = input('Acquire');

  readonly context = input('Workspace / Overview');

  readonly items = input<NavigationItem[]>([]);

  // ---------------------------------------------------------------------------
  // Router state
  // ---------------------------------------------------------------------------

  /**
   * Current URL as a signal.
   *
   * Using Router events means the shell automatically reacts
   * whenever navigation happens.
   */
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    {
      initialValue: this.router.url,
    },
  );

  // ---------------------------------------------------------------------------
  // Active parent
  // ---------------------------------------------------------------------------

  /**
   * Finds the top-level navigation item that owns the current URL.
   *
   * Examples:
   *
   * /campaigns
   * /campaigns/123
   * /campaigns/123/processing
   *
   * all resolve to:
   *
   * Campaigns
   */
  protected readonly activeParent = computed(() => {
    const url = this.currentUrl();

    return this.items().find((item) => this.isParentRoute(item.route, url)) ?? null;
  });

  // ---------------------------------------------------------------------------
  // Context
  // ---------------------------------------------------------------------------

  /**
   * Returns true when we are inside a contextual route.
   *
   * Example:
   *
   * /campaigns
   *        false
   *
   * /campaigns/create
   *        false
   *
   * /campaigns/123
   *        true
   *
   * /campaigns/123/processing
   *        true
   */
  protected readonly isContextualNavigation = computed(() => {
    const parent = this.activeParent();

    if (!parent?.children?.length) {
      return false;
    }

    if (!parent.contextRoute) {
      return false;
    }

    return this.matchesContextRoute(parent.contextRoute, this.currentUrl());
  });

  // ---------------------------------------------------------------------------
  // Main navigation
  // ---------------------------------------------------------------------------

  /**
   * Items displayed as primary navigation.
   *
   * Normal state:
   *
   * Dashboard
   * Campaigns
   * Job Profiles
   * Hiring Strategy
   * ...
   *
   * Contextual state:
   *
   * Dashboard
   * Campaigns
   */
  protected readonly visibleItems = computed(() => this.items());

  // ---------------------------------------------------------------------------
  // Child navigation
  // ---------------------------------------------------------------------------

  /**
   * Contextual child navigation.
   *
   * Example:
   *
   * /campaigns/123
   *
   * returns:
   *
   * Overview
   * Processing
   * Job Profile
   * Hiring Strategy
   * ...
   */
  protected readonly childItems = computed(() => {
    if (!this.isContextualNavigation()) {
      return [];
    }

    return this.activeParent()?.children ?? [];
  });

  // ---------------------------------------------------------------------------
  // Child URL generation
  // ---------------------------------------------------------------------------

  /**
   * Generates the real URL for a contextual child.
   *
   * Example:
   *
   * Current:
   *   /campaigns/123
   *
   * Child:
   *   processing
   *
   * Result:
   *   /campaigns/123/processing
   */
  protected childRoute(child: NavigationItem): string {
    const parent = this.activeParent();

    if (!parent?.contextRoute) {
      return child.route;
    }

    const contextValues = this.extractContextValues(parent.contextRoute, this.currentUrl());

    let route = parent.route;

    /**
     * Add dynamic route values.
     *
     * /campaigns/:campaignId
     *
     * becomes:
     *
     * /campaigns/123
     */
    for (const value of contextValues) {
      route += `/${value}`;
    }

    /**
     * Add child path.
     *
     * Empty route means Overview.
     */
    if (child.route) {
      route += `/${child.route}`;
    }

    return route;
  }

  // ---------------------------------------------------------------------------
  // Route helpers
  // ---------------------------------------------------------------------------

  /**
   * Determines whether a top-level route owns the URL.
   *
   * "/" only matches "/".
   *
   * "/campaigns" matches:
   *
   * /campaigns
   * /campaigns/123
   * /campaigns/123/processing
   */
  private isParentRoute(route: string, url: string): boolean {
    if (route === '/') {
      return url === '/';
    }

    return url === route || url.startsWith(`${route}/`);
  }

  /**
   * Matches a route template against the current URL.
   *
   * Template:
   *
   * /campaigns/:campaignId
   *
   * URLs:
   *
   * /campaigns/123
   * /campaigns/123/processing
   *
   * both match.
   *
   * But:
   *
   * /campaigns/create
   *
   * also technically matches the template.
   *
   * To prevent that, the route configuration should use
   * a dynamic ID pattern if necessary, or a route-specific
   * matcher can be introduced later.
   */
  private matchesContextRoute(contextRoute: string, url: string): boolean {
    const templateSegments = this.getSegments(contextRoute);

    const urlSegments = this.getSegments(url);

    if (urlSegments.length < templateSegments.length) {
      return false;
    }

    return templateSegments.every(
      (segment, index) => segment.startsWith(':') || segment === urlSegments[index],
    );
  }

  /**
   * Extracts dynamic values from a contextual route.
   *
   * Example:
   *
   * Template:
   * /campaigns/:campaignId
   *
   * URL:
   * /campaigns/123/processing
   *
   * Returns:
   * ['123']
   */
  private extractContextValues(contextRoute: string, url: string): string[] {
    const templateSegments = this.getSegments(contextRoute);

    const urlSegments = this.getSegments(url);

    return templateSegments
      .map((segment, index) => (segment.startsWith(':') ? urlSegments[index] : null))
      .filter((value): value is string => value !== null && value !== undefined);
  }

  /**
   * Converts a URL into segments.
   */
  private getSegments(url: string): string[] {
    return url.split('?')[0].split('#')[0].split('/').filter(Boolean);
  }
}
