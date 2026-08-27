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
import { blogHeaderAltLayout01 } from "./marketing/blog-header-alt-layout-01.ts";
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
import { blogHeaderSimple04 } from "./marketing/blog-header-simple-04.ts";
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
import { careersCard04 } from "./marketing/careers-card-04.ts";
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
import { contactIconCards01 } from "./marketing/contact-icon-cards-01.ts";
import { contactIconCards02 } from "./marketing/contact-icon-cards-02.ts";
import { contactIconCards03 } from "./marketing/contact-icon-cards-03.ts";
import { contactIconsAndFormBrand } from "./marketing/contact-icons-and-form-brand.ts";
import { contactIconsAndForm } from "./marketing/contact-icons-and-form.ts";
import { contactIconsAndImageBrand } from "./marketing/contact-icons-and-image-brand.ts";
import { contactIconsAndImage } from "./marketing/contact-icons-and-image.ts";
import { contactIconsAndMap01Brand } from "./marketing/contact-icons-and-map-01-brand.ts";
import { contactIconsAndMap01 } from "./marketing/contact-icons-and-map-01.ts";
import { contactIconsAndMap02Brand } from "./marketing/contact-icons-and-map-02-brand.ts";
import { contactIconsAndMap02 } from "./marketing/contact-icons-and-map-02.ts";
import { contactMap01 } from "./marketing/contact-map-01.ts";
import { contactMap02 } from "./marketing/contact-map-02.ts";
import { contactSimpleForm01 } from "./marketing/contact-simple-form-01.ts";
import { contactSimpleForm02 } from "./marketing/contact-simple-form-02.ts";
import { contactSimpleForm03 } from "./marketing/contact-simple-form-03.ts";
import { contactSimpleForm04 } from "./marketing/contact-simple-form-04.ts";
import { contactSimpleForm05 } from "./marketing/contact-simple-form-05.ts";
import { contactSimpleForm } from "./marketing/contact-simple-form.ts";
import { contactSimpleIcons01Brand } from "./marketing/contact-simple-icons-01-brand.ts";
import { contactSimpleIcons01 } from "./marketing/contact-simple-icons-01.ts";
import { contactSimpleIcons02Brand } from "./marketing/contact-simple-icons-02-brand.ts";
import { contactSimpleIcons02 } from "./marketing/contact-simple-icons-02.ts";
import { contactSimpleIcons03Brand } from "./marketing/contact-simple-icons-03-brand.ts";
import { contactSimpleIcons03 } from "./marketing/contact-simple-icons-03.ts";
import { contactSimpleIcons04Brand } from "./marketing/contact-simple-icons-04-brand.ts";
import { contactSimpleIcons04 } from "./marketing/contact-simple-icons-04.ts";
import { contactSimpleLinks01 } from "./marketing/contact-simple-links-01.ts";
import { contactSimpleLinks02 } from "./marketing/contact-simple-links-02.ts";
import { contactVectorMap03 } from "./marketing/contact-vector-map-03.ts";
import { contentAlternative01 } from "./marketing/content-alternative-01.ts";
import { contentAlternative02 } from "./marketing/content-alternative-02.ts";
import { contentAlternative03 } from "./marketing/content-alternative-03.ts";
import { contentLargeImage01 } from "./marketing/content-large-image-01.ts";
import { contentLargeImage02 } from "./marketing/content-large-image-02.ts";
import { contentLargeImage03 } from "./marketing/content-large-image-03.ts";
import { contentLargeImage04 } from "./marketing/content-large-image-04.ts";
import { contentSectionRichText01 } from "./marketing/content-section-rich-text-01.ts";
import { contentSectionRichText02 } from "./marketing/content-section-rich-text-02.ts";
import { contentSectionSimple01 } from "./marketing/content-section-simple-01.ts";
import { contentSectionSimple02 } from "./marketing/content-section-simple-02.ts";
import { contentSectionSimple03 } from "./marketing/content-section-simple-03.ts";
import { contentSectionSimple04 } from "./marketing/content-section-simple-04.ts";
import { contentSectionSimple05 } from "./marketing/content-section-simple-05.ts";
import { contentSectionSplitImage01 } from "./marketing/content-section-split-image-01.ts";
import { contentSectionSplitImage02 } from "./marketing/content-section-split-image-02.ts";
import { contentSectionSplitImage03 } from "./marketing/content-section-split-image-03.ts";
import { contentSimple } from "./marketing/content-simple.ts";
import { contentSplitImage01 } from "./marketing/content-split-image-01.ts";
import { contentSplitImage02 } from "./marketing/content-split-image-02.ts";
import { contentSplitImage03 } from "./marketing/content-split-image-03.ts";
import { contentSplitImage04 } from "./marketing/content-split-image-04.ts";
import { ctaAbstractImagesBrand } from "./marketing/cta-abstract-images-brand.ts";
import { ctaAbstractImages } from "./marketing/cta-abstract-images.ts";
import { ctaCardHorizontalBrand } from "./marketing/cta-card-horizontal-brand.ts";
import { ctaCardHorizontal } from "./marketing/cta-card-horizontal.ts";
import { ctaCardVerticalBrand } from "./marketing/cta-card-vertical-brand.ts";
import { ctaCardVertical } from "./marketing/cta-card-vertical.ts";
import { ctaIphoneMockup01 } from "./marketing/cta-iphone-mockup-01.ts";
import { ctaIphoneMockup02 } from "./marketing/cta-iphone-mockup-02.ts";
import { ctaIphoneMockup03 } from "./marketing/cta-iphone-mockup-03.ts";
import { ctaIphoneMockup04 } from "./marketing/cta-iphone-mockup-04.ts";
import { ctaScreenMockup01 } from "./marketing/cta-screen-mockup-01.ts";
import { ctaScreenMockup02 } from "./marketing/cta-screen-mockup-02.ts";
import { ctaScreenMockup03 } from "./marketing/cta-screen-mockup-03.ts";
import { ctaScreenMockup04 } from "./marketing/cta-screen-mockup-04.ts";
import { ctaSimpleCenteredBrand } from "./marketing/cta-simple-centered-brand.ts";
import { ctaSimpleCentered } from "./marketing/cta-simple-centered.ts";
import { ctaSimpleLeftBrand } from "./marketing/cta-simple-left-brand.ts";
import { ctaSimpleLeft } from "./marketing/cta-simple-left.ts";
import { ctaSimpleLogos01Brand } from "./marketing/cta-simple-logos-01-brand.ts";
import { ctaSimpleLogos01 } from "./marketing/cta-simple-logos-01.ts";
import { ctaSimpleLogos02Brand } from "./marketing/cta-simple-logos-02-brand.ts";
import { ctaSimpleLogos02 } from "./marketing/cta-simple-logos-02.ts";
import { ctaSplitImage01 } from "./marketing/cta-split-image-01.ts";
import { ctaSplitImage02 } from "./marketing/cta-split-image-02.ts";
import { ctaSplitImage03 } from "./marketing/cta-split-image-03.ts";
import { ctaSplitImage04 } from "./marketing/cta-split-image-04.ts";
import { ctaSplitImageQuote01 } from "./marketing/cta-split-image-quote-01.ts";
import { ctaSplitImageQuote02 } from "./marketing/cta-split-image-quote-02.ts";
import { ctaSplitImageQuote03 } from "./marketing/cta-split-image-quote-03.ts";
import { ctaSplitImageQuote04 } from "./marketing/cta-split-image-quote-04.ts";
import { dropdownMenuFeatureCard } from "./marketing/dropdown-menu-feature-card.ts";
import { dropdownMenuFeaturedPosts } from "./marketing/dropdown-menu-featured-posts.ts";
import { dropdownMenuSimpleTwoColumnsWithFooter } from "./marketing/dropdown-menu-simple-two-columns-with-footer.ts";
import { dropdownMenuSimpleTwoColumns } from "./marketing/dropdown-menu-simple-two-columns.ts";
import { dropdownMenuSimpleWithFooter } from "./marketing/dropdown-menu-simple-with-footer.ts";
import { dropdownMenuSimple } from "./marketing/dropdown-menu-simple.ts";
import { dropdownMenuWithTwoColsAndLinksAndFooter } from "./marketing/dropdown-menu-with-two-cols-and-links-and-footer.ts";
import { faqAccordion01Brand } from "./marketing/faq-accordion-01-brand.ts";
import { faqAccordion01 } from "./marketing/faq-accordion-01.ts";
import { faqAccordion02Brand } from "./marketing/faq-accordion-02-brand.ts";
import { faqAccordion02 } from "./marketing/faq-accordion-02.ts";
import { faqAccordion03Brand } from "./marketing/faq-accordion-03-brand.ts";
import { faqAccordion03 } from "./marketing/faq-accordion-03.ts";
import { faqAccordion04Brand } from "./marketing/faq-accordion-04-brand.ts";
import { faqAccordion04 } from "./marketing/faq-accordion-04.ts";
import { faqSimple01Brand } from "./marketing/faq-simple-01-brand.ts";
import { faqSimple01 } from "./marketing/faq-simple-01.ts";
import { faqSimple02Brand } from "./marketing/faq-simple-02-brand.ts";
import { faqSimple02 } from "./marketing/faq-simple-02.ts";
import { faqSimple03Brand } from "./marketing/faq-simple-03-brand.ts";
import { faqSimple03 } from "./marketing/faq-simple-03.ts";
import { faqSimple04Brand } from "./marketing/faq-simple-04-brand.ts";
import { faqSimple04 } from "./marketing/faq-simple-04.ts";
import { featuresAlternatingLayout01 } from "./marketing/features-alternating-layout-01.ts";
import { featuresAlternatingLayout02 } from "./marketing/features-alternating-layout-02.ts";
import { featuresAlternatingLayout03 } from "./marketing/features-alternating-layout-03.ts";
import { featuresAlternatingLayout04 } from "./marketing/features-alternating-layout-04.ts";
import { featuresCenterMockup01 } from "./marketing/features-center-mockup-01.ts";
import { featuresCenterMockup02 } from "./marketing/features-center-mockup-02.ts";
import { featuresIconCards01 } from "./marketing/features-icon-cards-01.ts";
import { featuresIconCards02 } from "./marketing/features-icon-cards-02.ts";
import { featuresIconsAndImage01 } from "./marketing/features-icons-and-image-01.ts";
import { featuresIconsAndImage02 } from "./marketing/features-icons-and-image-02.ts";
import { featuresIconsAndImage03 } from "./marketing/features-icons-and-image-03.ts";
import { featuresIconsAndImage04 } from "./marketing/features-icons-and-image-04.ts";
import { featuresIconsAndMockup01 } from "./marketing/features-icons-and-mockup-01.ts";
import { featuresIconsAndMockup02 } from "./marketing/features-icons-and-mockup-02.ts";
import { featuresIconsAndMockup03 } from "./marketing/features-icons-and-mockup-03.ts";
import { featuresIconsAndMockup04 } from "./marketing/features-icons-and-mockup-04.ts";
import { featuresIconsAndMockup05 } from "./marketing/features-icons-and-mockup-05.ts";
import { featuresIconsAndMockup06 } from "./marketing/features-icons-and-mockup-06.ts";
import { featuresIconsAndMockup07 } from "./marketing/features-icons-and-mockup-07.ts";
import { featuresIconsAndMockup08 } from "./marketing/features-icons-and-mockup-08.ts";
import { featuresIntegrationsIcons01 } from "./marketing/features-integrations-icons-01.ts";
import { featuresIntegrationsIcons02 } from "./marketing/features-integrations-icons-02.ts";
import { featuresIntegrationsIcons03 } from "./marketing/features-integrations-icons-03.ts";
import { featuresIntegrationsIcons04 } from "./marketing/features-integrations-icons-04.ts";
import { featuresLargeScreenMockup01 } from "./marketing/features-large-screen-mockup-01.ts";
import { featuresLargeScreenMockup02 } from "./marketing/features-large-screen-mockup-02.ts";
import { featuresSimpleIcons01Brand } from "./marketing/features-simple-icons-01-brand.ts";
import { featuresSimpleIcons01 } from "./marketing/features-simple-icons-01.ts";
import { featuresSimpleIcons02Brand } from "./marketing/features-simple-icons-02-brand.ts";
import { featuresSimpleIcons02 } from "./marketing/features-simple-icons-02.ts";
import { featuresSimpleIcons03Brand } from "./marketing/features-simple-icons-03-brand.ts";
import { featuresSimpleIcons03 } from "./marketing/features-simple-icons-03.ts";
import { featuresSimpleIcons04Brand } from "./marketing/features-simple-icons-04-brand.ts";
import { featuresSimpleIcons04 } from "./marketing/features-simple-icons-04.ts";
import { featuresTabsMockup01 } from "./marketing/features-tabs-mockup-01.ts";
import { featuresTabsMockup02 } from "./marketing/features-tabs-mockup-02.ts";
import { featuresTabsMockup03 } from "./marketing/features-tabs-mockup-03.ts";
import { featuresTabsMockup04 } from "./marketing/features-tabs-mockup-04.ts";
import { featuresTabsMockup05 } from "./marketing/features-tabs-mockup-05.ts";
import { featuresTabsMockup06 } from "./marketing/features-tabs-mockup-06.ts";
import { featuresTabsMockup07 } from "./marketing/features-tabs-mockup-07.ts";
import { featuresTabsMockup08 } from "./marketing/features-tabs-mockup-08.ts";
import { featuresTabsMockup09 } from "./marketing/features-tabs-mockup-09.ts";
import { featuresTabsMockup10 } from "./marketing/features-tabs-mockup-10.ts";
import { featuresTabsMockup11 } from "./marketing/features-tabs-mockup-11.ts";
import { featuresTabsMockup12 } from "./marketing/features-tabs-mockup-12.ts";
import { footerLarge01Brand } from "./marketing/footer-large-01-brand.ts";
import { footerLarge01 } from "./marketing/footer-large-01.ts";
import { footerLarge02Brand } from "./marketing/footer-large-02-brand.ts";
import { footerLarge02 } from "./marketing/footer-large-02.ts";
import { footerLarge03Brand } from "./marketing/footer-large-03-brand.ts";
import { footerLarge03 } from "./marketing/footer-large-03.ts";
import { footerLarge04Brand } from "./marketing/footer-large-04-brand.ts";
import { footerLarge04 } from "./marketing/footer-large-04.ts";
import { footerLarge05Brand } from "./marketing/footer-large-05-brand.ts";
import { footerLarge05 } from "./marketing/footer-large-05.ts";
import { footerLarge06Brand } from "./marketing/footer-large-06-brand.ts";
import { footerLarge06 } from "./marketing/footer-large-06.ts";
import { footerLarge07Brand } from "./marketing/footer-large-07-brand.ts";
import { footerLarge07 } from "./marketing/footer-large-07.ts";
import { footerLarge08Brand } from "./marketing/footer-large-08-brand.ts";
import { footerLarge08 } from "./marketing/footer-large-08.ts";
import { footerLarge09Brand } from "./marketing/footer-large-09-brand.ts";
import { footerLarge09 } from "./marketing/footer-large-09.ts";
import { footerLarge10Brand } from "./marketing/footer-large-10-brand.ts";
import { footerLarge10 } from "./marketing/footer-large-10.ts";
import { footerLarge11Brand } from "./marketing/footer-large-11-brand.ts";
import { footerLarge11 } from "./marketing/footer-large-11.ts";
import { footerLarge12Brand } from "./marketing/footer-large-12-brand.ts";
import { footerLarge12 } from "./marketing/footer-large-12.ts";
import { footerLarge13Brand } from "./marketing/footer-large-13-brand.ts";
import { footerLarge13 } from "./marketing/footer-large-13.ts";
import { footerLarge14Brand } from "./marketing/footer-large-14-brand.ts";
import { footerLarge14 } from "./marketing/footer-large-14.ts";
import { footerLarge15Brand } from "./marketing/footer-large-15-brand.ts";
import { footerLarge15 } from "./marketing/footer-large-15.ts";
import { footerLarge16Brand } from "./marketing/footer-large-16-brand.ts";
import { footerLarge16 } from "./marketing/footer-large-16.ts";
import { footerSmall01Brand } from "./marketing/footer-small-01-brand.ts";
import { footerSmall01 } from "./marketing/footer-small-01.ts";
import { footerSmall02Brand } from "./marketing/footer-small-02-brand.ts";
import { footerSmall02 } from "./marketing/footer-small-02.ts";
import { footerSmall03Brand } from "./marketing/footer-small-03-brand.ts";
import { footerSmall03 } from "./marketing/footer-small-03.ts";
import { footerSmall04Brand } from "./marketing/footer-small-04-brand.ts";
import { footerSmall04 } from "./marketing/footer-small-04.ts";
import { headerCenteredBrand } from "./marketing/header-centered-brand.ts";
import { headerCenteredButtonsBrand } from "./marketing/header-centered-buttons-brand.ts";
import { headerCenteredButtons } from "./marketing/header-centered-buttons.ts";
import { headerCenteredEmailBrand } from "./marketing/header-centered-email-brand.ts";
import { headerCenteredEmail } from "./marketing/header-centered-email.ts";
import { headerCenteredSearchBrand } from "./marketing/header-centered-search-brand.ts";
import { headerCenteredSearch } from "./marketing/header-centered-search.ts";
import { headerCenteredTabsBrand } from "./marketing/header-centered-tabs-brand.ts";
import { headerCenteredTabs } from "./marketing/header-centered-tabs.ts";
import { headerCentered } from "./marketing/header-centered.ts";
import { headerLeftBrand } from "./marketing/header-left-brand.ts";
import { headerLeftButtonsBrand } from "./marketing/header-left-buttons-brand.ts";
import { headerLeftButtons } from "./marketing/header-left-buttons.ts";
import { headerLeftEmailBrand } from "./marketing/header-left-email-brand.ts";
import { headerLeftEmail } from "./marketing/header-left-email.ts";
import { headerLeftSearchBrand } from "./marketing/header-left-search-brand.ts";
import { headerLeftSearch } from "./marketing/header-left-search.ts";
import { headerLeftTabsBrand } from "./marketing/header-left-tabs-brand.ts";
import { headerLeftTabs } from "./marketing/header-left-tabs.ts";
import { headerLeft } from "./marketing/header-left.ts";
import { headerSpaceBetweenBrand } from "./marketing/header-space-between-brand.ts";
import { headerSpaceBetweenButtonsBrand } from "./marketing/header-space-between-buttons-brand.ts";
import { headerSpaceBetweenButtons } from "./marketing/header-space-between-buttons.ts";
import { headerSpaceBetweenEmailBrand } from "./marketing/header-space-between-email-brand.ts";
import { headerSpaceBetweenEmail } from "./marketing/header-space-between-email.ts";
import { headerSpaceBetweenSearchBrand } from "./marketing/header-space-between-search-brand.ts";
import { headerSpaceBetweenSearch } from "./marketing/header-space-between-search.ts";
import { headerSpaceBetweenTabsBrand } from "./marketing/header-space-between-tabs-brand.ts";
import { headerSpaceBetweenTabs } from "./marketing/header-space-between-tabs.ts";
import { headerSpaceBetween } from "./marketing/header-space-between.ts";
import { header } from "./marketing/header.ts";
import { heroAbstractAngles01 } from "./marketing/hero-abstract-angles-01.ts";
import { heroAbstractAngles02 } from "./marketing/hero-abstract-angles-02.ts";
import { heroAbstractAngles03 } from "./marketing/hero-abstract-angles-03.ts";
import { heroAbstractAngles04 } from "./marketing/hero-abstract-angles-04.ts";
import { heroCardMockup01 } from "./marketing/hero-card-mockup-01.ts";
import { heroCardMockup02 } from "./marketing/hero-card-mockup-02.ts";
import { heroCardMockup03 } from "./marketing/hero-card-mockup-03.ts";
import { heroCardMockup04 } from "./marketing/hero-card-mockup-04.ts";
import { heroCardMockup05 } from "./marketing/hero-card-mockup-05.ts";
import { heroCardMockup06 } from "./marketing/hero-card-mockup-06.ts";
import { heroCardMockup07 } from "./marketing/hero-card-mockup-07.ts";
import { heroCardMockup08 } from "./marketing/hero-card-mockup-08.ts";
import { heroCardMockup09 } from "./marketing/hero-card-mockup-09.ts";
import { heroCardMockup10 } from "./marketing/hero-card-mockup-10.ts";
import { heroCardMockup11 } from "./marketing/hero-card-mockup-11.ts";
import { heroColorCard01 } from "./marketing/hero-color-card-01.ts";
import { heroColorCard02 } from "./marketing/hero-color-card-02.ts";
import { heroColorCard03 } from "./marketing/hero-color-card-03.ts";
import { heroColorCard04 } from "./marketing/hero-color-card-04.ts";
import { heroGeometricShapes01 } from "./marketing/hero-geometric-shapes-01.ts";
import { heroGeometricShapes03 } from "./marketing/hero-geometric-shapes-03.ts";
import { heroGeometricShapes04 } from "./marketing/hero-geometric-shapes-04.ts";
import { heroIphoneMockup01 } from "./marketing/hero-iphone-mockup-01.ts";
import { heroIphoneMockup02 } from "./marketing/hero-iphone-mockup-02.ts";
import { heroIphoneMockup03 } from "./marketing/hero-iphone-mockup-03.ts";
import { heroIphoneMockup04 } from "./marketing/hero-iphone-mockup-04.ts";
import { heroScreenMockup01 } from "./marketing/hero-screen-mockup-01.ts";
import { heroScreenMockup02 } from "./marketing/hero-screen-mockup-02.ts";
import { heroScreenMockup03 } from "./marketing/hero-screen-mockup-03.ts";
import { heroScreenMockup04 } from "./marketing/hero-screen-mockup-04.ts";
import { heroScreenMockup05 } from "./marketing/hero-screen-mockup-05.ts";
import { heroScreenMockup06 } from "./marketing/hero-screen-mockup-06.ts";
import { heroScreenMockup07 } from "./marketing/hero-screen-mockup-07.ts";
import { heroScreenMockup08 } from "./marketing/hero-screen-mockup-08.ts";
import { heroSimpleText01 } from "./marketing/hero-simple-text-01.ts";
import { heroSimpleText02 } from "./marketing/hero-simple-text-02.ts";
import { heroSplitForm01 } from "./marketing/hero-split-form-01.ts";
import { heroSplitForm02 } from "./marketing/hero-split-form-02.ts";
import { heroSplitImage01 } from "./marketing/hero-split-image-01.ts";
import { heroSplitImage02 } from "./marketing/hero-split-image-02.ts";
import { heroSplitImage03 } from "./marketing/hero-split-image-03.ts";
import { heroSplitImage04 } from "./marketing/hero-split-image-04.ts";
import { heroSplitImage05 } from "./marketing/hero-split-image-05.ts";
import { heroSplitImage06 } from "./marketing/hero-split-image-06.ts";
import { menu2ColWithLinks } from "./marketing/menu-2-col-with-links.ts";
import { menu2ColWithSidebar } from "./marketing/menu-2-col-with-sidebar.ts";
import { menu3ColWithSidebar } from "./marketing/menu-3-col-with-sidebar.ts";
import { menu4ColSlimWithFooter } from "./marketing/menu-4-col-slim-with-footer.ts";
import { menu4ColWithFooter } from "./marketing/menu-4-col-with-footer.ts";
import { menuBlogPostsWithFooter } from "./marketing/menu-blog-posts-with-footer.ts";
import { menuBlogPostsWithSidebar } from "./marketing/menu-blog-posts-with-sidebar.ts";
import { menuFloating2ColWithSidebar } from "./marketing/menu-floating-2-col-with-sidebar.ts";
import { metricsCardBrandDark } from "./marketing/metrics-card-brand-dark.ts";
import { metricsCardGrayLight } from "./marketing/metrics-card-gray-light.ts";
import { metricsImageWithCards01 } from "./marketing/metrics-image-with-cards-01.ts";
import { metricsImageWithCards02 } from "./marketing/metrics-image-with-cards-02.ts";
import { metricsMinimalCenteredTextBrand } from "./marketing/metrics-minimal-centered-text-brand.ts";
import { metricsMinimalCenteredText } from "./marketing/metrics-minimal-centered-text.ts";
import { metricsSimpleAccentLineBrand } from "./marketing/metrics-simple-accent-line-brand.ts";
import { metricsSimpleAccentLine } from "./marketing/metrics-simple-accent-line.ts";
import { metricsSimpleCenteredTextBrand } from "./marketing/metrics-simple-centered-text-brand.ts";
import { metricsSimpleCenteredText } from "./marketing/metrics-simple-centered-text.ts";
import { metricsSimpleWithActions01 } from "./marketing/metrics-simple-with-actions-01.ts";
import { metricsSimpleWithActions02 } from "./marketing/metrics-simple-with-actions-02.ts";
import { metricsSplitImage01Brand } from "./marketing/metrics-split-image-01-brand.ts";
import { metricsSplitImage01 } from "./marketing/metrics-split-image-01.ts";
import { metricsSplitImage02Brand } from "./marketing/metrics-split-image-02-brand.ts";
import { metricsSplitImage02 } from "./marketing/metrics-split-image-02.ts";
import { newsletterCardHorizontalBrand } from "./marketing/newsletter-card-horizontal-brand.ts";
import { newsletterCardHorizontal } from "./marketing/newsletter-card-horizontal.ts";
import { newsletterCardVerticalBrand } from "./marketing/newsletter-card-vertical-brand.ts";
import { newsletterCardVertical } from "./marketing/newsletter-card-vertical.ts";
import { newsletterIphoneMockup01 } from "./marketing/newsletter-iphone-mockup-01.ts";
import { newsletterIphoneMockup02 } from "./marketing/newsletter-iphone-mockup-02.ts";
import { newsletterIphoneMockup03 } from "./marketing/newsletter-iphone-mockup-03.ts";
import { newsletterIphoneMockup04 } from "./marketing/newsletter-iphone-mockup-04.ts";
import { newsletterScreenMockup01 } from "./marketing/newsletter-screen-mockup-01.ts";
import { newsletterScreenMockup02 } from "./marketing/newsletter-screen-mockup-02.ts";
import { newsletterScreenMockup03 } from "./marketing/newsletter-screen-mockup-03.ts";
import { newsletterScreenMockup04 } from "./marketing/newsletter-screen-mockup-04.ts";
import { newsletterSimpleCenteredBrand } from "./marketing/newsletter-simple-centered-brand.ts";
import { newsletterSimpleCentered } from "./marketing/newsletter-simple-centered.ts";
import { newsletterSimpleLeftBrand } from "./marketing/newsletter-simple-left-brand.ts";
import { newsletterSimpleLeft } from "./marketing/newsletter-simple-left.ts";
import { pricingAbstractAngles } from "./marketing/pricing-abstract-angles.ts";
import { pricingDualAction } from "./marketing/pricing-dual-action.ts";
import { pricingGrayBadge } from "./marketing/pricing-gray-badge.ts";
import { pricingLargeTable01 } from "./marketing/pricing-large-table-01.ts";
import { pricingLargeTable02 } from "./marketing/pricing-large-table-02.ts";
import { pricingPrimaryCardIcon } from "./marketing/pricing-primary-card-icon.ts";
import { pricingPrimaryCardSimple } from "./marketing/pricing-primary-card-simple.ts";
import { pricingPrimaryDarkBadge } from "./marketing/pricing-primary-dark-badge.ts";
import { pricingSectionFeaturedCards01 } from "./marketing/pricing-section-featured-cards-01.ts";
import { pricingSectionFeaturedCards02 } from "./marketing/pricing-section-featured-cards-02.ts";
import { pricingSectionFeaturedCards03 } from "./marketing/pricing-section-featured-cards-03.ts";
import { pricingSectionFeaturedCards04 } from "./marketing/pricing-section-featured-cards-04.ts";
import { pricingSectionSimpleCards01 } from "./marketing/pricing-section-simple-cards-01.ts";
import { pricingSectionSimpleCards02 } from "./marketing/pricing-section-simple-cards-02.ts";
import { pricingSectionSimpleCards03 } from "./marketing/pricing-section-simple-cards-03.ts";
import { pricingSectionSimpleCards04 } from "./marketing/pricing-section-simple-cards-04.ts";
import { pricingSimpleAccentLine } from "./marketing/pricing-simple-accent-line.ts";
import { pricingSimpleBanner } from "./marketing/pricing-simple-banner.ts";
import { pricingSimpleCallOut } from "./marketing/pricing-simple-call-out.ts";
import { pricingSimpleDualCheckItem } from "./marketing/pricing-simple-dual-check-item.ts";
import { pricingSimpleIconOffset } from "./marketing/pricing-simple-icon-offset.ts";
import { pricingSimpleIcon } from "./marketing/pricing-simple-icon.ts";
import { socialProofCardBrand } from "./marketing/social-proof-card-brand.ts";
import { socialProofCard } from "./marketing/social-proof-card.ts";
import { socialProofCardsBrand } from "./marketing/social-proof-cards-brand.ts";
import { socialProofCards } from "./marketing/social-proof-cards.ts";
import { socialProofFullWidthBrand } from "./marketing/social-proof-full-width-brand.ts";
import { socialProofFullWidthDualBrand } from "./marketing/social-proof-full-width-dual-brand.ts";
import { socialProofFullWidthDual } from "./marketing/social-proof-full-width-dual.ts";
import { socialProofFullWidthMaskedBrand } from "./marketing/social-proof-full-width-masked-brand.ts";
import { socialProofFullWidthMasked } from "./marketing/social-proof-full-width-masked.ts";
import { socialProofFullWidth } from "./marketing/social-proof-full-width.ts";
import { socialProofPressBrand } from "./marketing/social-proof-press-brand.ts";
import { socialProofPressMentions } from "./marketing/social-proof-press-mentions.ts";
import { teamSectionImageCard01 } from "./marketing/team-section-image-card-01.ts";
import { teamSectionImageCard02 } from "./marketing/team-section-image-card-02.ts";
import { teamSectionImageCard03 } from "./marketing/team-section-image-card-03.ts";
import { teamSectionImageCard04 } from "./marketing/team-section-image-card-04.ts";
import { teamSectionImageCollage01 } from "./marketing/team-section-image-collage-01.ts";
import { teamSectionImageCollage02 } from "./marketing/team-section-image-collage-02.ts";
import { teamSectionImageGlass01 } from "./marketing/team-section-image-glass-01.ts";
import { teamSectionImageGlass02 } from "./marketing/team-section-image-glass-02.ts";
import { teamSectionImageGlass03 } from "./marketing/team-section-image-glass-03.ts";
import { teamSectionImageGlass04 } from "./marketing/team-section-image-glass-04.ts";
import { teamSectionSimple01 } from "./marketing/team-section-simple-01.ts";
import { teamSectionSimple02 } from "./marketing/team-section-simple-02.ts";
import { teamSectionSimple03 } from "./marketing/team-section-simple-03.ts";
import { teamSectionSimple04 } from "./marketing/team-section-simple-04.ts";
import { testimonialAbstractImage } from "./marketing/testimonial-abstract-image.ts";
import { testimonialCardBrand } from "./marketing/testimonial-card-brand.ts";
import { testimonialCardSplitImageBrand } from "./marketing/testimonial-card-split-image-brand.ts";
import { testimonialCardSplitImage } from "./marketing/testimonial-card-split-image.ts";
import { testimonialCard } from "./marketing/testimonial-card.ts";
import { testimonialCaseStudyCards } from "./marketing/testimonial-case-study-cards.ts";
import { testimonialGlassmorphicCards01 } from "./marketing/testimonial-glassmorphic-cards-01.ts";
import { testimonialGlassmorphicCards02 } from "./marketing/testimonial-glassmorphic-cards-02.ts";
import { testimonialGlassmorphicCards03 } from "./marketing/testimonial-glassmorphic-cards-03.ts";
import { testimonialSimpleCentered01Brand } from "./marketing/testimonial-simple-centered-01-brand.ts";
import { testimonialSimpleCentered01 } from "./marketing/testimonial-simple-centered-01.ts";
import { testimonialSimpleCentered02Brand } from "./marketing/testimonial-simple-centered-02-brand.ts";
import { testimonialSimpleCentered02 } from "./marketing/testimonial-simple-centered-02.ts";
import { testimonialSimpleCentered03Brand } from "./marketing/testimonial-simple-centered-03-brand.ts";
import { testimonialSimpleCentered03 } from "./marketing/testimonial-simple-centered-03.ts";
import { testimonialSimpleLeftAlignedBrand } from "./marketing/testimonial-simple-left-aligned-brand.ts";
import { testimonialSimpleLeftAligned } from "./marketing/testimonial-simple-left-aligned.ts";
import { testimonialSocialCards01Brand } from "./marketing/testimonial-social-cards-01-brand.ts";
import { testimonialSocialCards01 } from "./marketing/testimonial-social-cards-01.ts";
import { testimonialSocialCards02Brand } from "./marketing/testimonial-social-cards-02-brand.ts";
import { testimonialSocialCards02 } from "./marketing/testimonial-social-cards-02.ts";
import { testimonialSocialCards03Brand } from "./marketing/testimonial-social-cards-03-brand.ts";
import { testimonialSocialCards03 } from "./marketing/testimonial-social-cards-03.ts";
import { testimonialSplitImage01 } from "./marketing/testimonial-split-image-01.ts";
import { testimonialSplitImage02 } from "./marketing/testimonial-split-image-02.ts";
import { testimonialSplitImage03 } from "./marketing/testimonial-split-image-03.ts";

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
  "blog-header-alt-layout-01": blogHeaderAltLayout01,
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
  "blog-header-simple-04": blogHeaderSimple04,
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
  "careers-card-04": careersCard04,
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
  "contact-icon-cards-01": contactIconCards01,
  "contact-icon-cards-02": contactIconCards02,
  "contact-icon-cards-03": contactIconCards03,
  "contact-icons-and-form": contactIconsAndForm,
  "contact-icons-and-form-brand": contactIconsAndFormBrand,
  "contact-icons-and-image": contactIconsAndImage,
  "contact-icons-and-image-brand": contactIconsAndImageBrand,
  "contact-icons-and-map-01": contactIconsAndMap01,
  "contact-icons-and-map-01-brand": contactIconsAndMap01Brand,
  "contact-icons-and-map-02": contactIconsAndMap02,
  "contact-icons-and-map-02-brand": contactIconsAndMap02Brand,
  "contact-map-01": contactMap01,
  "contact-map-02": contactMap02,
  "contact-simple-form": contactSimpleForm,
  "contact-simple-form-01": contactSimpleForm01,
  "contact-simple-form-02": contactSimpleForm02,
  "contact-simple-form-03": contactSimpleForm03,
  "contact-simple-form-04": contactSimpleForm04,
  "contact-simple-form-05": contactSimpleForm05,
  "contact-simple-icons-01": contactSimpleIcons01,
  "contact-simple-icons-01-brand": contactSimpleIcons01Brand,
  "contact-simple-icons-02": contactSimpleIcons02,
  "contact-simple-icons-02-brand": contactSimpleIcons02Brand,
  "contact-simple-icons-03": contactSimpleIcons03,
  "contact-simple-icons-03-brand": contactSimpleIcons03Brand,
  "contact-simple-icons-04": contactSimpleIcons04,
  "contact-simple-icons-04-brand": contactSimpleIcons04Brand,
  "contact-simple-links-01": contactSimpleLinks01,
  "contact-simple-links-02": contactSimpleLinks02,
  "contact-vector-map-03": contactVectorMap03,
  "content-alternative-01": contentAlternative01,
  "content-alternative-02": contentAlternative02,
  "content-alternative-03": contentAlternative03,
  "content-large-image-01": contentLargeImage01,
  "content-large-image-02": contentLargeImage02,
  "content-large-image-03": contentLargeImage03,
  "content-large-image-04": contentLargeImage04,
  "content-section-rich-text-01": contentSectionRichText01,
  "content-section-rich-text-02": contentSectionRichText02,
  "content-section-simple-01": contentSectionSimple01,
  "content-section-simple-02": contentSectionSimple02,
  "content-section-simple-03": contentSectionSimple03,
  "content-section-simple-04": contentSectionSimple04,
  "content-section-simple-05": contentSectionSimple05,
  "content-section-split-image-01": contentSectionSplitImage01,
  "content-section-split-image-02": contentSectionSplitImage02,
  "content-section-split-image-03": contentSectionSplitImage03,
  "content-simple": contentSimple,
  "content-split-image-01": contentSplitImage01,
  "content-split-image-02": contentSplitImage02,
  "content-split-image-03": contentSplitImage03,
  "content-split-image-04": contentSplitImage04,
  "cta-abstract-images": ctaAbstractImages,
  "cta-abstract-images-brand": ctaAbstractImagesBrand,
  "cta-card-horizontal": ctaCardHorizontal,
  "cta-card-horizontal-brand": ctaCardHorizontalBrand,
  "cta-card-vertical": ctaCardVertical,
  "cta-card-vertical-brand": ctaCardVerticalBrand,
  "cta-iphone-mockup-01": ctaIphoneMockup01,
  "cta-iphone-mockup-02": ctaIphoneMockup02,
  "cta-iphone-mockup-03": ctaIphoneMockup03,
  "cta-iphone-mockup-04": ctaIphoneMockup04,
  "cta-screen-mockup-01": ctaScreenMockup01,
  "cta-screen-mockup-02": ctaScreenMockup02,
  "cta-screen-mockup-03": ctaScreenMockup03,
  "cta-screen-mockup-04": ctaScreenMockup04,
  "cta-simple-centered": ctaSimpleCentered,
  "cta-simple-centered-brand": ctaSimpleCenteredBrand,
  "cta-simple-left": ctaSimpleLeft,
  "cta-simple-left-brand": ctaSimpleLeftBrand,
  "cta-simple-logos-01": ctaSimpleLogos01,
  "cta-simple-logos-01-brand": ctaSimpleLogos01Brand,
  "cta-simple-logos-02": ctaSimpleLogos02,
  "cta-simple-logos-02-brand": ctaSimpleLogos02Brand,
  "cta-split-image-01": ctaSplitImage01,
  "cta-split-image-02": ctaSplitImage02,
  "cta-split-image-03": ctaSplitImage03,
  "cta-split-image-04": ctaSplitImage04,
  "cta-split-image-quote-01": ctaSplitImageQuote01,
  "cta-split-image-quote-02": ctaSplitImageQuote02,
  "cta-split-image-quote-03": ctaSplitImageQuote03,
  "cta-split-image-quote-04": ctaSplitImageQuote04,
  "dropdown-menu-feature-card": dropdownMenuFeatureCard,
  "dropdown-menu-featured-posts": dropdownMenuFeaturedPosts,
  "dropdown-menu-simple": dropdownMenuSimple,
  "dropdown-menu-simple-two-columns": dropdownMenuSimpleTwoColumns,
  "dropdown-menu-simple-two-columns-with-footer": dropdownMenuSimpleTwoColumnsWithFooter,
  "dropdown-menu-simple-with-footer": dropdownMenuSimpleWithFooter,
  "dropdown-menu-with-two-cols-and-links-and-footer": dropdownMenuWithTwoColsAndLinksAndFooter,
  "faq-accordion-01": faqAccordion01,
  "faq-accordion-01-brand": faqAccordion01Brand,
  "faq-accordion-02": faqAccordion02,
  "faq-accordion-02-brand": faqAccordion02Brand,
  "faq-accordion-03": faqAccordion03,
  "faq-accordion-03-brand": faqAccordion03Brand,
  "faq-accordion-04": faqAccordion04,
  "faq-accordion-04-brand": faqAccordion04Brand,
  "faq-simple-01": faqSimple01,
  "faq-simple-01-brand": faqSimple01Brand,
  "faq-simple-02": faqSimple02,
  "faq-simple-02-brand": faqSimple02Brand,
  "faq-simple-03": faqSimple03,
  "faq-simple-03-brand": faqSimple03Brand,
  "faq-simple-04": faqSimple04,
  "faq-simple-04-brand": faqSimple04Brand,
  "features-alternating-layout-01": featuresAlternatingLayout01,
  "features-alternating-layout-02": featuresAlternatingLayout02,
  "features-alternating-layout-03": featuresAlternatingLayout03,
  "features-alternating-layout-04": featuresAlternatingLayout04,
  "features-center-mockup-01": featuresCenterMockup01,
  "features-center-mockup-02": featuresCenterMockup02,
  "features-icon-cards-01": featuresIconCards01,
  "features-icon-cards-02": featuresIconCards02,
  "features-icons-and-image-01": featuresIconsAndImage01,
  "features-icons-and-image-02": featuresIconsAndImage02,
  "features-icons-and-image-03": featuresIconsAndImage03,
  "features-icons-and-image-04": featuresIconsAndImage04,
  "features-icons-and-mockup-01": featuresIconsAndMockup01,
  "features-icons-and-mockup-02": featuresIconsAndMockup02,
  "features-icons-and-mockup-03": featuresIconsAndMockup03,
  "features-icons-and-mockup-04": featuresIconsAndMockup04,
  "features-icons-and-mockup-05": featuresIconsAndMockup05,
  "features-icons-and-mockup-06": featuresIconsAndMockup06,
  "features-icons-and-mockup-07": featuresIconsAndMockup07,
  "features-icons-and-mockup-08": featuresIconsAndMockup08,
  "features-integrations-icons-01": featuresIntegrationsIcons01,
  "features-integrations-icons-02": featuresIntegrationsIcons02,
  "features-integrations-icons-03": featuresIntegrationsIcons03,
  "features-integrations-icons-04": featuresIntegrationsIcons04,
  "features-large-screen-mockup-01": featuresLargeScreenMockup01,
  "features-large-screen-mockup-02": featuresLargeScreenMockup02,
  "features-simple-icons-01": featuresSimpleIcons01,
  "features-simple-icons-01-brand": featuresSimpleIcons01Brand,
  "features-simple-icons-02": featuresSimpleIcons02,
  "features-simple-icons-02-brand": featuresSimpleIcons02Brand,
  "features-simple-icons-03": featuresSimpleIcons03,
  "features-simple-icons-03-brand": featuresSimpleIcons03Brand,
  "features-simple-icons-04": featuresSimpleIcons04,
  "features-simple-icons-04-brand": featuresSimpleIcons04Brand,
  "features-tabs-mockup-01": featuresTabsMockup01,
  "features-tabs-mockup-02": featuresTabsMockup02,
  "features-tabs-mockup-03": featuresTabsMockup03,
  "features-tabs-mockup-04": featuresTabsMockup04,
  "features-tabs-mockup-05": featuresTabsMockup05,
  "features-tabs-mockup-06": featuresTabsMockup06,
  "features-tabs-mockup-07": featuresTabsMockup07,
  "features-tabs-mockup-08": featuresTabsMockup08,
  "features-tabs-mockup-09": featuresTabsMockup09,
  "features-tabs-mockup-10": featuresTabsMockup10,
  "features-tabs-mockup-11": featuresTabsMockup11,
  "features-tabs-mockup-12": featuresTabsMockup12,
  "footer-large-01": footerLarge01,
  "footer-large-01-brand": footerLarge01Brand,
  "footer-large-02": footerLarge02,
  "footer-large-02-brand": footerLarge02Brand,
  "footer-large-03": footerLarge03,
  "footer-large-03-brand": footerLarge03Brand,
  "footer-large-04": footerLarge04,
  "footer-large-04-brand": footerLarge04Brand,
  "footer-large-05": footerLarge05,
  "footer-large-05-brand": footerLarge05Brand,
  "footer-large-06": footerLarge06,
  "footer-large-06-brand": footerLarge06Brand,
  "footer-large-07": footerLarge07,
  "footer-large-07-brand": footerLarge07Brand,
  "footer-large-08": footerLarge08,
  "footer-large-08-brand": footerLarge08Brand,
  "footer-large-09": footerLarge09,
  "footer-large-09-brand": footerLarge09Brand,
  "footer-large-10": footerLarge10,
  "footer-large-10-brand": footerLarge10Brand,
  "footer-large-11": footerLarge11,
  "footer-large-11-brand": footerLarge11Brand,
  "footer-large-12": footerLarge12,
  "footer-large-12-brand": footerLarge12Brand,
  "footer-large-13": footerLarge13,
  "footer-large-13-brand": footerLarge13Brand,
  "footer-large-14": footerLarge14,
  "footer-large-14-brand": footerLarge14Brand,
  "footer-large-15": footerLarge15,
  "footer-large-15-brand": footerLarge15Brand,
  "footer-large-16": footerLarge16,
  "footer-large-16-brand": footerLarge16Brand,
  "footer-small-01": footerSmall01,
  "footer-small-01-brand": footerSmall01Brand,
  "footer-small-02": footerSmall02,
  "footer-small-02-brand": footerSmall02Brand,
  "footer-small-03": footerSmall03,
  "footer-small-03-brand": footerSmall03Brand,
  "footer-small-04": footerSmall04,
  "footer-small-04-brand": footerSmall04Brand,
  header,
  "header-centered": headerCentered,
  "header-centered-brand": headerCenteredBrand,
  "header-centered-buttons": headerCenteredButtons,
  "header-centered-buttons-brand": headerCenteredButtonsBrand,
  "header-centered-email": headerCenteredEmail,
  "header-centered-email-brand": headerCenteredEmailBrand,
  "header-centered-search": headerCenteredSearch,
  "header-centered-search-brand": headerCenteredSearchBrand,
  "header-centered-tabs": headerCenteredTabs,
  "header-centered-tabs-brand": headerCenteredTabsBrand,
  "header-left": headerLeft,
  "header-left-brand": headerLeftBrand,
  "header-left-buttons": headerLeftButtons,
  "header-left-buttons-brand": headerLeftButtonsBrand,
  "header-left-email": headerLeftEmail,
  "header-left-email-brand": headerLeftEmailBrand,
  "header-left-search": headerLeftSearch,
  "header-left-search-brand": headerLeftSearchBrand,
  "header-left-tabs": headerLeftTabs,
  "header-left-tabs-brand": headerLeftTabsBrand,
  "header-space-between": headerSpaceBetween,
  "header-space-between-brand": headerSpaceBetweenBrand,
  "header-space-between-buttons": headerSpaceBetweenButtons,
  "header-space-between-buttons-brand": headerSpaceBetweenButtonsBrand,
  "header-space-between-email": headerSpaceBetweenEmail,
  "header-space-between-email-brand": headerSpaceBetweenEmailBrand,
  "header-space-between-search": headerSpaceBetweenSearch,
  "header-space-between-search-brand": headerSpaceBetweenSearchBrand,
  "header-space-between-tabs": headerSpaceBetweenTabs,
  "header-space-between-tabs-brand": headerSpaceBetweenTabsBrand,
  "hero-abstract-angles-01": heroAbstractAngles01,
  "hero-abstract-angles-02": heroAbstractAngles02,
  "hero-abstract-angles-03": heroAbstractAngles03,
  "hero-abstract-angles-04": heroAbstractAngles04,
  "hero-card-mockup-01": heroCardMockup01,
  "hero-card-mockup-02": heroCardMockup02,
  "hero-card-mockup-03": heroCardMockup03,
  "hero-card-mockup-04": heroCardMockup04,
  "hero-card-mockup-05": heroCardMockup05,
  "hero-card-mockup-06": heroCardMockup06,
  "hero-card-mockup-07": heroCardMockup07,
  "hero-card-mockup-08": heroCardMockup08,
  "hero-card-mockup-09": heroCardMockup09,
  "hero-card-mockup-10": heroCardMockup10,
  "hero-card-mockup-11": heroCardMockup11,
  "hero-color-card-01": heroColorCard01,
  "hero-color-card-02": heroColorCard02,
  "hero-color-card-03": heroColorCard03,
  "hero-color-card-04": heroColorCard04,
  "hero-geometric-shapes-01": heroGeometricShapes01,
  "hero-geometric-shapes-03": heroGeometricShapes03,
  "hero-geometric-shapes-04": heroGeometricShapes04,
  "hero-iphone-mockup-01": heroIphoneMockup01,
  "hero-iphone-mockup-02": heroIphoneMockup02,
  "hero-iphone-mockup-03": heroIphoneMockup03,
  "hero-iphone-mockup-04": heroIphoneMockup04,
  "hero-screen-mockup-01": heroScreenMockup01,
  "hero-screen-mockup-02": heroScreenMockup02,
  "hero-screen-mockup-03": heroScreenMockup03,
  "hero-screen-mockup-04": heroScreenMockup04,
  "hero-screen-mockup-05": heroScreenMockup05,
  "hero-screen-mockup-06": heroScreenMockup06,
  "hero-screen-mockup-07": heroScreenMockup07,
  "hero-screen-mockup-08": heroScreenMockup08,
  "hero-simple-text-01": heroSimpleText01,
  "hero-simple-text-02": heroSimpleText02,
  "hero-split-form-01": heroSplitForm01,
  "hero-split-form-02": heroSplitForm02,
  "hero-split-image-01": heroSplitImage01,
  "hero-split-image-02": heroSplitImage02,
  "hero-split-image-03": heroSplitImage03,
  "hero-split-image-04": heroSplitImage04,
  "hero-split-image-05": heroSplitImage05,
  "hero-split-image-06": heroSplitImage06,
  "menu-2-col-with-links": menu2ColWithLinks,
  "menu-2-col-with-sidebar": menu2ColWithSidebar,
  "menu-3-col-with-sidebar": menu3ColWithSidebar,
  "menu-4-col-slim-with-footer": menu4ColSlimWithFooter,
  "menu-4-col-with-footer": menu4ColWithFooter,
  "menu-blog-posts-with-footer": menuBlogPostsWithFooter,
  "menu-blog-posts-with-sidebar": menuBlogPostsWithSidebar,
  "menu-floating-2-col-with-sidebar": menuFloating2ColWithSidebar,
  "metrics-card-brand-dark": metricsCardBrandDark,
  "metrics-card-gray-light": metricsCardGrayLight,
  "metrics-image-with-cards-01": metricsImageWithCards01,
  "metrics-image-with-cards-02": metricsImageWithCards02,
  "metrics-minimal-centered-text": metricsMinimalCenteredText,
  "metrics-minimal-centered-text-brand": metricsMinimalCenteredTextBrand,
  "metrics-simple-accent-line": metricsSimpleAccentLine,
  "metrics-simple-accent-line-brand": metricsSimpleAccentLineBrand,
  "metrics-simple-centered-text": metricsSimpleCenteredText,
  "metrics-simple-centered-text-brand": metricsSimpleCenteredTextBrand,
  "metrics-simple-with-actions-01": metricsSimpleWithActions01,
  "metrics-simple-with-actions-02": metricsSimpleWithActions02,
  "metrics-split-image-01": metricsSplitImage01,
  "metrics-split-image-01-brand": metricsSplitImage01Brand,
  "metrics-split-image-02": metricsSplitImage02,
  "metrics-split-image-02-brand": metricsSplitImage02Brand,
  "newsletter-card-horizontal": newsletterCardHorizontal,
  "newsletter-card-horizontal-brand": newsletterCardHorizontalBrand,
  "newsletter-card-vertical": newsletterCardVertical,
  "newsletter-card-vertical-brand": newsletterCardVerticalBrand,
  "newsletter-iphone-mockup-01": newsletterIphoneMockup01,
  "newsletter-iphone-mockup-02": newsletterIphoneMockup02,
  "newsletter-iphone-mockup-03": newsletterIphoneMockup03,
  "newsletter-iphone-mockup-04": newsletterIphoneMockup04,
  "newsletter-screen-mockup-01": newsletterScreenMockup01,
  "newsletter-screen-mockup-02": newsletterScreenMockup02,
  "newsletter-screen-mockup-03": newsletterScreenMockup03,
  "newsletter-screen-mockup-04": newsletterScreenMockup04,
  "newsletter-simple-centered": newsletterSimpleCentered,
  "newsletter-simple-centered-brand": newsletterSimpleCenteredBrand,
  "newsletter-simple-left": newsletterSimpleLeft,
  "newsletter-simple-left-brand": newsletterSimpleLeftBrand,
  "pricing-abstract-angles": pricingAbstractAngles,
  "pricing-dual-action": pricingDualAction,
  "pricing-gray-badge": pricingGrayBadge,
  "pricing-large-table-01": pricingLargeTable01,
  "pricing-large-table-02": pricingLargeTable02,
  "pricing-primary-card-icon": pricingPrimaryCardIcon,
  "pricing-primary-card-simple": pricingPrimaryCardSimple,
  "pricing-primary-dark-badge": pricingPrimaryDarkBadge,
  "pricing-section-featured-cards-01": pricingSectionFeaturedCards01,
  "pricing-section-featured-cards-02": pricingSectionFeaturedCards02,
  "pricing-section-featured-cards-03": pricingSectionFeaturedCards03,
  "pricing-section-featured-cards-04": pricingSectionFeaturedCards04,
  "pricing-section-simple-cards-01": pricingSectionSimpleCards01,
  "pricing-section-simple-cards-02": pricingSectionSimpleCards02,
  "pricing-section-simple-cards-03": pricingSectionSimpleCards03,
  "pricing-section-simple-cards-04": pricingSectionSimpleCards04,
  "pricing-simple-accent-line": pricingSimpleAccentLine,
  "pricing-simple-banner": pricingSimpleBanner,
  "pricing-simple-call-out": pricingSimpleCallOut,
  "pricing-simple-dual-check-item": pricingSimpleDualCheckItem,
  "pricing-simple-icon": pricingSimpleIcon,
  "pricing-simple-icon-offset": pricingSimpleIconOffset,
  "social-proof-card": socialProofCard,
  "social-proof-card-brand": socialProofCardBrand,
  "social-proof-cards": socialProofCards,
  "social-proof-cards-brand": socialProofCardsBrand,
  "social-proof-full-width": socialProofFullWidth,
  "social-proof-full-width-brand": socialProofFullWidthBrand,
  "social-proof-full-width-dual": socialProofFullWidthDual,
  "social-proof-full-width-dual-brand": socialProofFullWidthDualBrand,
  "social-proof-full-width-masked": socialProofFullWidthMasked,
  "social-proof-full-width-masked-brand": socialProofFullWidthMaskedBrand,
  "social-proof-press-brand": socialProofPressBrand,
  "social-proof-press-mentions": socialProofPressMentions,
  "team-section-image-card-01": teamSectionImageCard01,
  "team-section-image-card-02": teamSectionImageCard02,
  "team-section-image-card-03": teamSectionImageCard03,
  "team-section-image-card-04": teamSectionImageCard04,
  "team-section-image-collage-01": teamSectionImageCollage01,
  "team-section-image-collage-02": teamSectionImageCollage02,
  "team-section-image-glass-01": teamSectionImageGlass01,
  "team-section-image-glass-02": teamSectionImageGlass02,
  "team-section-image-glass-03": teamSectionImageGlass03,
  "team-section-image-glass-04": teamSectionImageGlass04,
  "team-section-simple-01": teamSectionSimple01,
  "team-section-simple-02": teamSectionSimple02,
  "team-section-simple-03": teamSectionSimple03,
  "team-section-simple-04": teamSectionSimple04,
  "testimonial-abstract-image": testimonialAbstractImage,
  "testimonial-card": testimonialCard,
  "testimonial-card-brand": testimonialCardBrand,
  "testimonial-card-split-image": testimonialCardSplitImage,
  "testimonial-card-split-image-brand": testimonialCardSplitImageBrand,
  "testimonial-case-study-cards": testimonialCaseStudyCards,
  "testimonial-glassmorphic-cards-01": testimonialGlassmorphicCards01,
  "testimonial-glassmorphic-cards-02": testimonialGlassmorphicCards02,
  "testimonial-glassmorphic-cards-03": testimonialGlassmorphicCards03,
  "testimonial-simple-centered-01": testimonialSimpleCentered01,
  "testimonial-simple-centered-01-brand": testimonialSimpleCentered01Brand,
  "testimonial-simple-centered-02": testimonialSimpleCentered02,
  "testimonial-simple-centered-02-brand": testimonialSimpleCentered02Brand,
  "testimonial-simple-centered-03": testimonialSimpleCentered03,
  "testimonial-simple-centered-03-brand": testimonialSimpleCentered03Brand,
  "testimonial-simple-left-aligned": testimonialSimpleLeftAligned,
  "testimonial-simple-left-aligned-brand": testimonialSimpleLeftAlignedBrand,
  "testimonial-social-cards-01": testimonialSocialCards01,
  "testimonial-social-cards-01-brand": testimonialSocialCards01Brand,
  "testimonial-social-cards-02": testimonialSocialCards02,
  "testimonial-social-cards-02-brand": testimonialSocialCards02Brand,
  "testimonial-social-cards-03": testimonialSocialCards03,
  "testimonial-social-cards-03-brand": testimonialSocialCards03Brand,
  "testimonial-split-image-01": testimonialSplitImage01,
  "testimonial-split-image-02": testimonialSplitImage02,
  "testimonial-split-image-03": testimonialSplitImage03,
} as const;

export const verifiedComponents = {
  ...verifiedApplicationComponents,
  ...verifiedBaseComponents,
  ...verifiedMarketingComponents,
} as const;
