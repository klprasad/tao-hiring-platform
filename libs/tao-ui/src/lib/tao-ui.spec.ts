import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoCardComponent } from './tao-card/tao-card.component';
import { TaoPageHeaderComponent } from './tao-page-header/tao-page-header.component';
import { TaoShellComponent } from './tao-shell/tao-shell.component';

describe('TAO UI components', () => {
  it('renders a card title from an input', async () => {
    await TestBed.configureTestingModule({ imports: [TaoCardComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TaoCardComponent);
    fixture.componentRef.setInput('title', 'Open campaigns');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Open campaigns');
  });

  it('renders a page header from external template content', async () => {
    await TestBed.configureTestingModule({ imports: [TaoPageHeaderComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TaoPageHeaderComponent);
    fixture.componentRef.setInput('title', 'Overview');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Overview');
  });

  it('renders navigation items in the shell', async () => {
    await TestBed.configureTestingModule({ imports: [TaoShellComponent], providers: [provideRouter([])] }).compileComponents();
    const fixture: ComponentFixture<TaoShellComponent> = TestBed.createComponent(TaoShellComponent);
    fixture.componentRef.setInput('items', [{ label: 'Dashboard', route: '/', icon: 'grid' }]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('nav').textContent).toContain('Dashboard');
  });
});
