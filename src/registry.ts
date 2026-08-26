/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noSpread -- The enforcement registry combines authenticated component identifiers without introducing a product barrel. */
import { avatar } from "./base/avatar.ts";
import { appStoreButtons } from "./base/app-store-buttons.ts";
import { badge, badgeGroup } from "./base/badges.ts";
import { button } from "./base/button.ts";
import { buttonGroup } from "./base/button-group.ts";
import { buttonUtility } from "./base/button-utility.ts";
import { dropdownButtonSimple, dropdownIconSimple } from "./base/dropdown-button-simple.ts";
import { dropdownButtonLink } from "./base/dropdown-button-link.ts";
import { dropdownButtonAdvanced, dropdownIconAdvanced } from "./base/dropdown-advanced.ts";
import { dropdownSearchSimple } from "./base/dropdown-search-simple.ts";
import { dropdownSearchAdvanced } from "./base/dropdown-search-advanced.ts";
import { dropdownAccountBreadcrumb } from "./base/dropdown-account-breadcrumb.ts";
import { dropdownAccountButton } from "./base/dropdown-account-button.ts";
import { dropdownAccountCardXS } from "./base/dropdown-account-card-xs.ts";
import { dropdownAccountCardSM } from "./base/dropdown-account-card-sm.ts";
import { dropdownAccountCardMD } from "./base/dropdown-account-card-md.ts";
import { dropdownAvatar } from "./base/dropdown-avatar.ts";
import { dropdownIntegration } from "./base/dropdown-integration.ts";
import { dropdownContextMenuSimple } from "./base/dropdown-context-menu-simple.ts";
import { dropdownContextMenuAdvanced } from "./base/dropdown-context-menu-advanced.ts";
import { dropdown } from "./base/dropdown.ts";
import { checkbox, radioButtons, slider, toggle } from "./base/controls.ts";
import { combobox } from "./base/combobox.ts";
import { fileUploadTrigger } from "./base/file-upload-trigger.ts";
import { form } from "./base/form.ts";
import { hookForm } from "./base/hook-form.ts";
import { input, textarea } from "./base/fields.ts";
import { progressCircle, progressIndicator, simpleCircle } from "./base/progress.ts";
import { playButtonIcon } from "./base/play-button-icon.ts";
import { pinInput } from "./base/pin-input.ts";
import { radioGroups } from "./base/radio-groups.ts";
import { select } from "./base/select.ts";
import { selectShared } from "./base/select-shared.ts";
import { socialButton } from "./base/social-button.ts";
import { tags } from "./base/tags.ts";
import { tagSelect } from "./base/tag-select.ts";
import { tooltip } from "./base/tooltip.ts";
import { textEditor } from "./base/text-editor.ts";
import { videoPlayer } from "./base/video-player.ts";
import { contentDivider } from "./application/content-divider.ts";
import { loadingIndicator } from "./application/loading-indicator.ts";
import { paginationDot, paginationLine } from "./application/pagination-indicators.ts";
import { tabs } from "./application/tabs.ts";
import { sectionFooter, sectionHeaders, sectionLabel } from "./application/sections.ts";
import { breadcrumbs } from "./application/breadcrumbs.ts";
import { alert } from "./application/alerts.ts";
import { rangePreset } from "./application/range-preset.ts";
import { progressSteps } from "./application/progress-steps.ts";
import { activityFeed } from "./application/activity-feed.ts";
import { notificationSettingsCheckboxMenu } from "./application/notification-settings-checkbox-menu.ts";
import { notificationSettingsButtonMenu } from "./application/notification-settings-button-menu.ts";
import { notificationsMenu } from "./application/notifications-menu.ts";
import { notification } from "./application/notifications.ts";
import { filterBar } from "./application/filter-bar.ts";
import { filterDropdownMenu } from "./application/filter-dropdown-menu.ts";
import { fileUploadMenu } from "./application/file-upload-menu.ts";
import { filtersAdvancedMenu } from "./application/filters-advanced-menu.ts";
import { filtersMenu } from "./application/filters-menu.ts";
import { labelsMenu } from "./application/labels-menu.ts";
import { messagesMenu } from "./application/messages-menu.ts";
import { aiAssistantIntroMenu } from "./application/ai-assistant-intro-menu.ts";
import { aiAssistantMessageMenu } from "./application/ai-assistant-message-menu.ts";
import { calendarEventMenu } from "./application/calendar-event-menu.ts";
import { createEventMenu } from "./application/create-event-menu.ts";
import { integrationMenu } from "./application/integration-menu.ts";
import { profileMenu } from "./application/profile-menu.ts";
import { chartsBase } from "./application/charts-base.ts";
import { modal } from "./application/modal.ts";
import { accessRequestModal } from "./application/access-request-modal.ts";
import { aiAssistantModal } from "./application/ai-assistant-modal.ts";
import { appearanceSettingsModal } from "./application/appearance-settings-modal.ts";
import { bannerAppearanceModal } from "./application/banner-appearance-modal.ts";
import { calendarEventModal } from "./application/calendar-event-modal.ts";
import { centeredPhotoCarouselModal } from "./application/centered-photo-carousel-modal.ts";
import { centeredPhotoModal } from "./application/centered-photo-modal.ts";
import { centeredVideoCarouselModal } from "./application/centered-video-carousel-modal.ts";
import { checkboxesModal } from "./application/checkboxes-modal.ts";
import { createEventModal } from "./application/create-event-modal.ts";
import { datePickerModal } from "./application/date-picker-modal.ts";
import { destructiveHorizontalModal } from "./application/destructive-horizontal-modal.ts";
import { destructiveStackedLeftAlignedModal } from "./application/destructive-stacked-left-aligned-modal.ts";
import { dropdownModal } from "./application/dropdown-modal.ts";
import { emailInviteModal } from "./application/email-invite-modal.ts";
import { fileUploadModal } from "./application/file-upload-modal.ts";
import { form01Modal } from "./application/form-01-modal.ts";
import { form02Modal } from "./application/form-02-modal.ts";
import { horizontalModal } from "./application/horizontal-modal.ts";
import { imageCropModal } from "./application/image-crop-modal.ts";
import { inputFieldModal } from "./application/input-field-modal.ts";
import { integrationModal } from "./application/integration-modal.ts";
import { labelsModal } from "./application/labels-modal.ts";
import { linkFieldModal } from "./application/link-field-modal.ts";
import { loginModal } from "./application/login-modal.ts";
import { newMessageEmptyStateModal } from "./application/new-message-empty-state-modal.ts";
import { newMessageFilledModal } from "./application/new-message-filled-modal.ts";
import { newProjectModal } from "./application/new-project-modal.ts";
import { orderSummaryMenu } from "./application/order-summary-menu.ts";
import { placeholderMenu } from "./application/placeholder-menu.ts";
import { planMenu } from "./application/plan-menu.ts";
import { projectDetailsMenu } from "./application/project-details-menu.ts";
import { passwordPromptModal } from "./application/password-prompt-modal.ts";
import { paymentDetailsMenu } from "./application/payment-details-menu.ts";
import { paymentDetailsModal } from "./application/payment-details-modal.ts";
import { paymentDetailsWithImageModal } from "./application/payment-details-with-image-modal.ts";
import { paymentMethodMenu } from "./application/payment-method-menu.ts";
import { paymentMethodModal } from "./application/payment-method-modal.ts";
import { plan01Modal } from "./application/plan-01-modal.ts";
import { plan02Modal } from "./application/plan-02-modal.ts";
import { profileSettingsModal } from "./application/profile-settings-modal.ts";
import { shareProjectMenu } from "./application/share-project-menu.ts";
import { shareProjectModal } from "./application/share-project-modal.ts";
import { teamMembersMenu } from "./application/team-members-menu.ts";
import { userSettingsMenu } from "./application/user-settings-menu.ts";
import { signup01Modal } from "./application/signup-01-modal.ts";
import { signup02Modal } from "./application/signup-02-modal.ts";
import { stackedLeftAlignedModal } from "./application/stacked-left-aligned-modal.ts";
import { stackedWithTeamModal } from "./application/stacked-with-team-modal.ts";
import { stackedWithTeamAndInvitesModal } from "./application/stacked-with-team-and-invites-modal.ts";
import { stackedWithTeamAndLinkModal } from "./application/stacked-with-team-and-link-modal.ts";
import { textEditorModal } from "./application/text-editor-modal.ts";
import { togglesModal } from "./application/toggles-modal.ts";
import { twofaCodeModal } from "./application/twofa-code-modal.ts";
import { userSelectionModal } from "./application/user-selection-modal.ts";
import { userSettingsModal } from "./application/user-settings-modal.ts";
import { userInviteModal } from "./application/user-invite-modal.ts";
import { warningHorizontalModal } from "./application/warning-horizontal-modal.ts";
import { warningStackedLeftAlignedModal } from "./application/warning-stacked-left-aligned-modal.ts";
import { verificationCodeModal } from "./application/verification-code-modal.ts";
import { slideoutMenu } from "./application/slideout-menu.ts";
import { codeSnippet } from "./application/code-snippet.ts";
import { emptyState } from "./application/empty-state.ts";
import { metrics } from "./application/metrics.ts";
import { pagination } from "./application/pagination.ts";
import { fileUpload } from "./application/file-upload-base.ts";
import { colorPicker } from "./application/color-picker.ts";
import { imagePicker } from "./application/image-picker.ts";
import { gradientPicker } from "./application/gradient-picker.ts";
import { carouselBase } from "./application/carousel-base.ts";
import { commandMenu } from "./application/command-menu.ts";
import { commandMenuEmptyState } from "./application/command-menu-empty-state.ts";
import { calendar } from "./application/calendar.ts";
import { messageChatMenu } from "./application/message-chat-menu.ts";
import { messaging } from "./application/messaging.ts";
import { table } from "./application/table.ts";
import { treeView } from "./application/tree-view.ts";
import {
  commandMenuActions,
  commandMenuActionsStacked,
} from "./application/command-menu-actions.ts";
import { commandMenuUsers, commandMenuUsersStacked } from "./application/command-menu-users.ts";
import {
  commandMenuUsersMenu,
  commandMenuUsersMenuStacked,
} from "./application/command-menu-users-menu.ts";
import {
  commandMenuIntegrationsMenu,
  commandMenuIntegrationsMenuStacked,
} from "./application/command-menu-integrations-menu.ts";
import { datePickerCalendar } from "./application/date-picker-calendar.ts";
import { datePicker } from "./application/date-picker.ts";
import { dateRangePicker } from "./application/date-range-picker.ts";
import { rangeCalendar } from "./application/range-calendar.ts";
import { headerNavigation } from "./application/header-navigation.ts";
import { sidebarSimple } from "./application/sidebar-simple.ts";
import { sidebarSectionDividers } from "./application/sidebar-section-dividers.ts";
import { sidebarSectionsSubheadings } from "./application/sidebar-sections-subheadings.ts";
import { sidebarSlim } from "./application/sidebar-slim.ts";
import { sidebarDualTier } from "./application/sidebar-dual-tier.ts";
import { sidebarNavigationBase } from "./application/sidebar-navigation-foundations.ts";
import { bannerCountdownBrandFullWidth } from "./marketing/banner-countdown-brand-full-width.ts";
import { bannerCountdownBrand } from "./marketing/banner-countdown-brand.ts";
import { bannerCountdownDefaultFullWidth } from "./marketing/banner-countdown-default-full-width.ts";
import { bannerCountdownDefault } from "./marketing/banner-countdown-default.ts";
import { bannerDualActionBrandFullWidth } from "./marketing/banner-dual-action-brand-full-width.ts";
import { bannerDualActionBrand } from "./marketing/banner-dual-action-brand.ts";
import { bannerDualActionDefaultFullWidth } from "./marketing/banner-dual-action-default-full-width.ts";
import { bannerDualActionDefault } from "./marketing/banner-dual-action-default.ts";
import { bannerSingleActionBrandFullWidth } from "./marketing/banner-single-action-brand-full-width.ts";
import { bannerSingleActionBrand } from "./marketing/banner-single-action-brand.ts";
import { bannerSingleActionDefaultFullWidth } from "./marketing/banner-single-action-default-full-width.ts";
import { bannerSingleActionDefault } from "./marketing/banner-single-action-default.ts";
import { bannerSlimBrandFullWidth } from "./marketing/banner-slim-brand-full-width.ts";
import { bannerSlimBrand } from "./marketing/banner-slim-brand.ts";
import { bannerSlimDefaultFullWidth } from "./marketing/banner-slim-default-full-width.ts";
import { bannerSlimDefault } from "./marketing/banner-slim-default.ts";
import { bannerTextFieldBrandFullWidth } from "./marketing/banner-text-field-brand-full-width.ts";
import { bannerTextFieldBrand } from "./marketing/banner-text-field-brand.ts";
import { bannerTextFieldDefaultFullWidth } from "./marketing/banner-text-field-default-full-width.ts";
import { bannerTextFieldDefault } from "./marketing/banner-text-field-default.ts";
import { blogCards } from "./marketing/blog-cards.ts";
import { blogHeaderAltLayout01Articles } from "./marketing/blog-header-alt-layout-01.ts";
import { blogHeaderAltLayout02 } from "./marketing/blog-header-alt-layout-02.ts";
import { blogHeaderAltLayout03 } from "./marketing/blog-header-alt-layout-03.ts";
import { blogHeaderAltLayout04 } from "./marketing/blog-header-alt-layout-04.ts";
import { blogHeaderFeaturedPost01 } from "./marketing/blog-header-featured-post-01.ts";
import { blogHeaderFeaturedPost02 } from "./marketing/blog-header-featured-post-02.ts";
import { blogHeaderFeaturedPost03 } from "./marketing/blog-header-featured-post-03.ts";
import { blogHeaderFeaturedPost04 } from "./marketing/blog-header-featured-post-04.ts";
import { blogHeaderSidebar01 } from "./marketing/blog-header-sidebar-01.ts";
import { blogHeaderSidebar02 } from "./marketing/blog-header-sidebar-02.ts";
import { blogHeaderSimple01 } from "./marketing/blog-header-simple-01.ts";
import { blogHeaderSimple02 } from "./marketing/blog-header-simple-02.ts";
import { blogHeaderSimple03 } from "./marketing/blog-header-simple-03.ts";
import { blogHeaderSimple04Articles } from "./marketing/blog-header-simple-04.ts";
import { blogHeaderSimple05 } from "./marketing/blog-header-simple-05.ts";
import { blogHeaderSimple06 } from "./marketing/blog-header-simple-06.ts";
import { blogSectionCarouselLayout01 } from "./marketing/blog-section-carousel-layout-01.ts";
import { blogSectionCarouselLayout02 } from "./marketing/blog-section-carousel-layout-02.ts";
import { blogSectionSimpleCenterAligned01 } from "./marketing/blog-section-simple-center-aligned-01.ts";
import { blogSectionSimpleCenterAligned02 } from "./marketing/blog-section-simple-center-aligned-02.ts";
import { blogSectionSimpleLeftAligned01 } from "./marketing/blog-section-simple-left-aligned-01.ts";
import { blogSectionSimpleLeftAligned02 } from "./marketing/blog-section-simple-left-aligned-02.ts";
import { blogSectionSplitLayout01 } from "./marketing/blog-section-split-layout-01.ts";
import { blogSectionSplitLayout02 } from "./marketing/blog-section-split-layout-02.ts";
import { careersCard01 } from "./marketing/careers-card-01.ts";
import { careersCard02 } from "./marketing/careers-card-02.ts";
import { careersCard03 } from "./marketing/careers-card-03.ts";
import { careersCard04LocationValues } from "./marketing/careers-card-04.ts";
import { careersSimple01Brand } from "./marketing/careers-simple-01-brand.ts";
import { careersSimple01 } from "./marketing/careers-simple-01.ts";
import { careersSimple02Brand } from "./marketing/careers-simple-02-brand.ts";
import { careersSimple02 } from "./marketing/careers-simple-02.ts";
import { careersSimple03Brand } from "./marketing/careers-simple-03-brand.ts";
import { careersSimple03 } from "./marketing/careers-simple-03.ts";
import { careersSimple04Brand } from "./marketing/careers-simple-04-brand.ts";
import { careersSimple04 } from "./marketing/careers-simple-04.ts";
import { contactCenteredMap } from "./marketing/contact-centered-map.ts";
import { contactFeaturesTabsMap01 } from "./marketing/contact-features-tabs-map-01.ts";
import { contactFeaturesTabsMap02 } from "./marketing/contact-features-tabs-map-02.ts";
import { contactFormAndImage01 } from "./marketing/contact-form-and-image-01.ts";
import { contactFormAndImage02 } from "./marketing/contact-form-and-image-02.ts";
import { contactFormAndMap } from "./marketing/contact-form-and-map.ts";
import { contactIconCards01Cards } from "./marketing/contact-icon-cards-01.ts";
import { contactIconCards02 } from "./marketing/contact-icon-cards-02.ts";
import { contactIconCards03 } from "./marketing/contact-icon-cards-03.ts";
import { contactIconsAndFormBrand } from "./marketing/contact-icons-and-form-brand.ts";
import { contactIconsAndForm } from "./marketing/contact-icons-and-form.ts";
import { contactIconsAndImageBrandLocations } from "./marketing/contact-icons-and-image-brand.ts";
import { contactIconsAndImageImage } from "./marketing/contact-icons-and-image.ts";
import { contactIconsAndMap01BrandItems } from "./marketing/contact-icons-and-map-01-brand.ts";
import { contactIconsAndMap01 } from "./marketing/contact-icons-and-map-01.ts";
import { contactIconsAndMap02BrandMap } from "./marketing/contact-icons-and-map-02-brand.ts";
import { contactIconsAndMap02 } from "./marketing/contact-icons-and-map-02.ts";
import { contactMap01Locations } from "./marketing/contact-map-01.ts";
import { contactMap02 } from "./marketing/contact-map-02.ts";
import { contactSimpleForm01 } from "./marketing/contact-simple-form-01.ts";
import { contactSimpleForm02Image } from "./marketing/contact-simple-form-02.ts";
import { contactSimpleForm03 } from "./marketing/contact-simple-form-03.ts";
import { contactSimpleForm04Contacts } from "./marketing/contact-simple-form-04.ts";
import { contactSimpleForm05 } from "./marketing/contact-simple-form-05.ts";
import { contactSimpleForm } from "./marketing/contact-simple-form.ts";
import { contactSimpleIcons01BrandItems } from "./marketing/contact-simple-icons-01-brand.ts";
import { contactSimpleIcons01 } from "./marketing/contact-simple-icons-01.ts";
import { contactSimpleIcons02BrandItems } from "./marketing/contact-simple-icons-02-brand.ts";
import { contactSimpleIcons02 } from "./marketing/contact-simple-icons-02.ts";
import { contactSimpleIcons03BrandItems } from "./marketing/contact-simple-icons-03-brand.ts";
import { contactSimpleIcons03 } from "./marketing/contact-simple-icons-03.ts";
import { contactSimpleIcons04Brand } from "./marketing/contact-simple-icons-04-brand.ts";
import { contactSimpleLinks01 } from "./marketing/contact-simple-links-01.ts";

export const verifiedBaseComponents = {
  "app-store-buttons": appStoreButtons,
  avatar,
  "badge-groups": badgeGroup,
  badges: badge,
  button,
  "button-group": buttonGroup,
  "button-utility": buttonUtility,
  checkbox,
  combobox,
  dropdown,
  "dropdown-account-breadcrumb": dropdownAccountBreadcrumb,
  "dropdown-account-button": dropdownAccountButton,
  "dropdown-account-card-md": dropdownAccountCardMD,
  "dropdown-account-card-sm": dropdownAccountCardSM,
  "dropdown-account-card-xs": dropdownAccountCardXS,
  "dropdown-avatar": dropdownAvatar,
  "dropdown-button-advanced": dropdownButtonAdvanced,
  "dropdown-button-link": dropdownButtonLink,
  "dropdown-button-simple": dropdownButtonSimple,
  "dropdown-context-menu-advanced": dropdownContextMenuAdvanced,
  "dropdown-context-menu-simple": dropdownContextMenuSimple,
  "dropdown-icon-advanced": dropdownIconAdvanced,
  "dropdown-icon-simple": dropdownIconSimple,
  "dropdown-integration": dropdownIntegration,
  "dropdown-search-advanced": dropdownSearchAdvanced,
  "dropdown-search-simple": dropdownSearchSimple,
  "file-upload-trigger": fileUploadTrigger,
  form,
  "hook-form": hookForm,
  input,
  "pin-input": pinInput,
  "play-button-icon": playButtonIcon,
  "progress-circles": progressCircle,
  "progress-indicators": progressIndicator,
  "radio-buttons": radioButtons,
  "radio-groups": radioGroups,
  select,
  "select-shared": selectShared,
  "simple-circle": simpleCircle,
  slider,
  "social-button": socialButton,
  "tag-select": tagSelect,
  tags,
  "text-editor": textEditor,
  textarea,
  toggle,
  tooltip,
  "video-player": videoPlayer,
} as const;

export const verifiedApplicationComponents = {
  "access-request-modal": accessRequestModal,
  "activity-feed": activityFeed,
  "ai-assistant-intro-menu": aiAssistantIntroMenu,
  "ai-assistant-message-menu": aiAssistantMessageMenu,
  "ai-assistant-modal": aiAssistantModal,
  alerts: alert,
  "appearance-settings-modal": appearanceSettingsModal,
  "banner-appearance-modal": bannerAppearanceModal,
  breadcrumbs,
  calendar,
  "calendar-event-menu": calendarEventMenu,
  "calendar-event-modal": calendarEventModal,
  "carousel-base": carouselBase,
  "centered-photo-carousel-modal": centeredPhotoCarouselModal,
  "centered-photo-modal": centeredPhotoModal,
  "centered-video-carousel-modal": centeredVideoCarouselModal,
  "charts-base": chartsBase,
  "checkboxes-modal": checkboxesModal,
  "code-snippet": codeSnippet,
  "color-picker": colorPicker,
  "command-menu": commandMenu,
  "command-menu-actions": commandMenuActions,
  "command-menu-actions-stacked": commandMenuActionsStacked,
  "command-menu-empty-state": commandMenuEmptyState,
  "command-menu-integrations-menu": commandMenuIntegrationsMenu,
  "command-menu-integrations-menu-stacked": commandMenuIntegrationsMenuStacked,
  "command-menu-users": commandMenuUsers,
  "command-menu-users-menu": commandMenuUsersMenu,
  "command-menu-users-menu-stacked": commandMenuUsersMenuStacked,
  "command-menu-users-stacked": commandMenuUsersStacked,
  "content-divider": contentDivider,
  "create-event-menu": createEventMenu,
  "create-event-modal": createEventModal,
  "date-picker": datePicker,
  "date-picker-calendar": datePickerCalendar,
  "date-picker-modal": datePickerModal,
  "date-range-picker": dateRangePicker,
  "destructive-horizontal-modal": destructiveHorizontalModal,
  "destructive-stacked-left-aligned-modal": destructiveStackedLeftAlignedModal,
  "dropdown-modal": dropdownModal,
  "email-invite-modal": emailInviteModal,
  "empty-state": emptyState,
  "file-upload-base": fileUpload,
  "file-upload-menu": fileUploadMenu,
  "file-upload-modal": fileUploadModal,
  "filter-bar": filterBar,
  "filter-dropdown-menu": filterDropdownMenu,
  "filters-advanced-menu": filtersAdvancedMenu,
  "filters-menu": filtersMenu,
  "form-01-modal": form01Modal,
  "form-02-modal": form02Modal,
  "gradient-picker": gradientPicker,
  "header-navigation": headerNavigation,
  "horizontal-modal": horizontalModal,
  "image-crop-modal": imageCropModal,
  "image-picker": imagePicker,
  "input-field-modal": inputFieldModal,
  "integration-menu": integrationMenu,
  "integration-modal": integrationModal,
  "labels-menu": labelsMenu,
  "labels-modal": labelsModal,
  "link-field-modal": linkFieldModal,
  "loading-indicator": loadingIndicator,
  "login-modal": loginModal,
  "message-chat-menu": messageChatMenu,
  "messages-menu": messagesMenu,
  messaging,
  metrics,
  modal,
  "new-message-empty-state-modal": newMessageEmptyStateModal,
  "new-message-filled-modal": newMessageFilledModal,
  "new-project-modal": newProjectModal,
  "notification-settings-button-menu": notificationSettingsButtonMenu,
  "notification-settings-checkbox-menu": notificationSettingsCheckboxMenu,
  notifications: notification,
  "notifications-menu": notificationsMenu,
  "order-summary-menu": orderSummaryMenu,
  pagination,
  "pagination-dot": paginationDot,
  "pagination-line": paginationLine,
  "password-prompt-modal": passwordPromptModal,
  "payment-details-menu": paymentDetailsMenu,
  "payment-details-modal": paymentDetailsModal,
  "payment-details-with-image-modal": paymentDetailsWithImageModal,
  "payment-method-menu": paymentMethodMenu,
  "payment-method-modal": paymentMethodModal,
  "placeholder-menu": placeholderMenu,
  "plan-01-modal": plan01Modal,
  "plan-02-modal": plan02Modal,
  "plan-menu": planMenu,
  "profile-settings-modal": profileSettingsModal,
  "progress-steps": progressSteps,
  "project-details-menu": projectDetailsMenu,
  "range-calendar": rangeCalendar,
  "range-preset": rangePreset,
  "section-footer": sectionFooter,
  "section-headers": sectionHeaders,
  "section-label": sectionLabel,
  "share-project-menu": shareProjectMenu,
  "share-project-modal": shareProjectModal,
  "sidebar-dual-tier": sidebarDualTier,
  "sidebar-navigation-base": sidebarNavigationBase,
  "sidebar-section-dividers": sidebarSectionDividers,
  "sidebar-sections-subheadings": sidebarSectionsSubheadings,
  "sidebar-simple": sidebarSimple,
  "sidebar-slim": sidebarSlim,
  "signup-01-modal": signup01Modal,
  "signup-02-modal": signup02Modal,
  "slideout-menu": slideoutMenu,
  "stacked-left-aligned-modal": stackedLeftAlignedModal,
  "stacked-with-team-and-invites-modal": stackedWithTeamAndInvitesModal,
  "stacked-with-team-and-link-modal": stackedWithTeamAndLinkModal,
  "stacked-with-team-modal": stackedWithTeamModal,
  table,
  tabs,
  "team-members-menu": teamMembersMenu,
  "text-editor-modal": textEditorModal,
  "toggles-modal": togglesModal,
  "tree-view": treeView,
  "twofa-code-modal": twofaCodeModal,
  "user-invite-modal": userInviteModal,
  "user-profile-menu": profileMenu,
  "user-selection-modal": userSelectionModal,
  "user-settings-menu": userSettingsMenu,
  "user-settings-modal": userSettingsModal,
  "verification-code-modal": verificationCodeModal,
  "warning-horizontal-modal": warningHorizontalModal,
  "warning-stacked-left-aligned-modal": warningStackedLeftAlignedModal,
} as const;

export const verifiedMarketingComponents = {
  "banner-countdown-brand": bannerCountdownBrand,
  "banner-countdown-brand-full-width": bannerCountdownBrandFullWidth,
  "banner-countdown-default": bannerCountdownDefault,
  "banner-countdown-default-full-width": bannerCountdownDefaultFullWidth,
  "banner-dual-action-brand": bannerDualActionBrand,
  "banner-dual-action-brand-full-width": bannerDualActionBrandFullWidth,
  "banner-dual-action-default": bannerDualActionDefault,
  "banner-dual-action-default-full-width": bannerDualActionDefaultFullWidth,
  "banner-single-action-brand": bannerSingleActionBrand,
  "banner-single-action-brand-full-width": bannerSingleActionBrandFullWidth,
  "banner-single-action-default": bannerSingleActionDefault,
  "banner-single-action-default-full-width": bannerSingleActionDefaultFullWidth,
  "banner-slim-brand": bannerSlimBrand,
  "banner-slim-brand-full-width": bannerSlimBrandFullWidth,
  "banner-slim-default": bannerSlimDefault,
  "banner-slim-default-full-width": bannerSlimDefaultFullWidth,
  "banner-text-field-brand": bannerTextFieldBrand,
  "banner-text-field-brand-full-width": bannerTextFieldBrandFullWidth,
  "banner-text-field-default": bannerTextFieldDefault,
  "banner-text-field-default-full-width": bannerTextFieldDefaultFullWidth,
  "blog-cards": blogCards,
  "blog-header-alt-layout-01": blogHeaderAltLayout01Articles,
  "blog-header-alt-layout-02": blogHeaderAltLayout02,
  "blog-header-alt-layout-03": blogHeaderAltLayout03,
  "blog-header-alt-layout-04": blogHeaderAltLayout04,
  "blog-header-featured-post-01": blogHeaderFeaturedPost01,
  "blog-header-featured-post-02": blogHeaderFeaturedPost02,
  "blog-header-featured-post-03": blogHeaderFeaturedPost03,
  "blog-header-featured-post-04": blogHeaderFeaturedPost04,
  "blog-header-sidebar-01": blogHeaderSidebar01,
  "blog-header-sidebar-02": blogHeaderSidebar02,
  "blog-header-simple-01": blogHeaderSimple01,
  "blog-header-simple-02": blogHeaderSimple02,
  "blog-header-simple-03": blogHeaderSimple03,
  "blog-header-simple-04": blogHeaderSimple04Articles,
  "blog-header-simple-05": blogHeaderSimple05,
  "blog-header-simple-06": blogHeaderSimple06,
  "blog-section-carousel-layout-01": blogSectionCarouselLayout01,
  "blog-section-carousel-layout-02": blogSectionCarouselLayout02,
  "blog-section-simple-center-aligned-01": blogSectionSimpleCenterAligned01,
  "blog-section-simple-center-aligned-02": blogSectionSimpleCenterAligned02,
  "blog-section-simple-left-aligned-01": blogSectionSimpleLeftAligned01,
  "blog-section-simple-left-aligned-02": blogSectionSimpleLeftAligned02,
  "blog-section-split-layout-01": blogSectionSplitLayout01,
  "blog-section-split-layout-02": blogSectionSplitLayout02,
  "careers-card-01": careersCard01,
  "careers-card-02": careersCard02,
  "careers-card-03": careersCard03,
  "careers-card-04": careersCard04LocationValues,
  "careers-simple-01": careersSimple01,
  "careers-simple-01-brand": careersSimple01Brand,
  "careers-simple-02": careersSimple02,
  "careers-simple-02-brand": careersSimple02Brand,
  "careers-simple-03": careersSimple03,
  "careers-simple-03-brand": careersSimple03Brand,
  "careers-simple-04": careersSimple04,
  "careers-simple-04-brand": careersSimple04Brand,
  "contact-centered-map": contactCenteredMap,
  "contact-features-tabs-map-01": contactFeaturesTabsMap01,
  "contact-features-tabs-map-02": contactFeaturesTabsMap02,
  "contact-form-and-image-01": contactFormAndImage01,
  "contact-form-and-image-02": contactFormAndImage02,
  "contact-form-and-map": contactFormAndMap,
  "contact-icon-cards-01": contactIconCards01Cards,
  "contact-icon-cards-02": contactIconCards02,
  "contact-icon-cards-03": contactIconCards03,
  "contact-icons-and-form": contactIconsAndForm,
  "contact-icons-and-form-brand": contactIconsAndFormBrand,
  "contact-icons-and-image": contactIconsAndImageImage,
  "contact-icons-and-image-brand": contactIconsAndImageBrandLocations,
  "contact-icons-and-map-01": contactIconsAndMap01,
  "contact-icons-and-map-01-brand": contactIconsAndMap01BrandItems,
  "contact-icons-and-map-02": contactIconsAndMap02,
  "contact-icons-and-map-02-brand": contactIconsAndMap02BrandMap,
  "contact-map-01": contactMap01Locations,
  "contact-map-02": contactMap02,
  "contact-simple-form": contactSimpleForm,
  "contact-simple-form-01": contactSimpleForm01,
  "contact-simple-form-02": contactSimpleForm02Image,
  "contact-simple-form-03": contactSimpleForm03,
  "contact-simple-form-04": contactSimpleForm04Contacts,
  "contact-simple-form-05": contactSimpleForm05,
  "contact-simple-icons-01": contactSimpleIcons01,
  "contact-simple-icons-01-brand": contactSimpleIcons01BrandItems,
  "contact-simple-icons-02": contactSimpleIcons02,
  "contact-simple-icons-02-brand": contactSimpleIcons02BrandItems,
  "contact-simple-icons-03": contactSimpleIcons03,
  "contact-simple-icons-03-brand": contactSimpleIcons03BrandItems,
  "contact-simple-icons-04-brand": contactSimpleIcons04Brand,
  "contact-simple-links-01": contactSimpleLinks01,
} as const;

export const verifiedComponents = {
  ...verifiedApplicationComponents,
  ...verifiedBaseComponents,
  ...verifiedMarketingComponents,
} as const;
