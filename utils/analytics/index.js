// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
function pageView(url) {
  window.gtag &&
    window.gtag('config', process.env.NEXT_PUBLIC_GA, {
      page_path: url
    });
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
function event({ action, event_category, event_label, value }) {
  window.gtag &&
    window.gtag('event', action, {
      event_category,
      event_label,
      value
    });
}

export const GA = { pageView, event };

export const EVENTS = {
  SUBMIT_CONTACT_FORM: {
    action: 'submit_contact_form',
    event_category: 'contact',
    event_label: 'method'
  },
  VIEW_TAC_RESUME_STAT: {
    action: 'view_tac_resume_stat',
    event_category: 'engagement',
    event_label: 'content_type'
  },
  VIEW_PBD_RESUME_STAT: {
    action: 'view_pbd_resume_stat',
    event_category: 'engagement',
    event_label: 'content_type'
  },
  VIEW_PBL_RESUME_STAT: {
    action: 'view_pbl_resume_stat',
    event_category: 'engagement',
    event_label: 'content_type'
  },
  VIEW_RESUME_JOB_ASSET: {
    action: 'view_resume_job_asset',
    event_category: 'engagement',
    event_label: 'content_type'
  },
  VIEW_GITHUB_SOURCE: {
    action: 'view_github_source',
    event_category: 'engagement',
    event_label: 'content_type'
  },
  VIEW_AWARD: {
    action: 'view_award',
    event_category: 'engagement',
    event_label: 'content_type'
  },
  SUBMIT_AWARD_APPLICATION: {
    action: 'submit_award_application',
    event_category: 'contact',
    event_label: 'method'
  },
  VIEW_CARD: {
    action: 'view_card',
    event_category: 'engagement',
    event_label: 'content_type'
  }
};
