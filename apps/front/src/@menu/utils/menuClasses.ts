// Common classes for menu components
export const menuClasses = {
  root: 'ts-menu-root',
  menuSectionRoot: 'ts-menusection-root mt-4 mb-0',
  menuItemRoot: 'ts-menuitem-root bg-white',
  subMenuRoot: 'ts-submenu-root font-semibold',
  button: 'ts-menu-button w-full flex items-center px-[0.75rem] py-[0.6rem] rounded-[10px] hover:bg-primary-main/5',
  prefix: 'ts-menu-prefix',
  suffix: 'ts-menu-suffix',
  label: 'ts-menu-label tracking-[0.05rem]',
  icon: 'ts-menu-icon',
  menuSectionWrapper: 'ts-menu-section-wrapper',
  menuSectionContent: 'ts-menu-section-content !py-2 after:content-[none] before:content-[none]',
  menuSectionLabel: 'ts-menu-section-label text-xs text-[var(--mui-palette-text-secondary)]',
  subMenuContent: 'ts-submenu-content',
  subMenuExpandIcon: 'ts-submenu-expand-icon',
  disabled: 'ts-disabled',
  active: 'bg-primary-main/10',
  open: 'ts-open'
}

// Classes for vertical navigation menu
export const verticalNavClasses = {
  root: 'ts-vertical-nav-root',
  container: 'ts-vertical-nav-container',
  bgColorContainer: 'ts-vertical-nav-bg-color-container',
  header: 'ts-vertical-nav-header',
  image: 'ts-vertical-nav-image',
  backdrop: 'ts-vertical-nav-backdrop',
  collapsed: 'ts-collapsed',
  toggled: 'ts-toggled',
  hovered: 'ts-hovered',
  scrollWithContent: 'ts-scroll-with-content',
  breakpointReached: 'ts-breakpoint-reached',
  collapsing: 'ts-collapsing',
  expanding: 'ts-expanding'
}

// Classes for horizontal navigation menu
export const horizontalNavClasses = {
  root: 'ts-horizontal-nav-root',
  scrollWithContent: 'ts-scroll-with-content',
  breakpointReached: 'ts-breakpoint-reached'
}
