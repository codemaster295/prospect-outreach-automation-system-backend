export interface Analytics {
    id?: string;
    contactId: string;
    sentEmailId: string;
    campaignId: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    key: AnalyticsKey;
    value: number;
}
export enum AnalyticsKey {
    OPEN_TRACKING = 'open_tracking',
    BOUNCE_TRACKING = 'bounce_tracking',
    COMPLAINT_TRACKING = 'complaint_tracking',
    SPAM_TRACKING = 'spam_tracking',
    FORGIVEN_TRACKING = 'forgiven_tracking',
    DELIVERED_TRACKING = 'delivered_tracking',
    FAILED_TRACKING = 'failed_tracking',
    READ_TRACKING = 'read_tracking',
    UNREAD_TRACKING = 'unread_tracking',
    CLICKED_TRACKING = 'clicked_tracking',
    UNCLICKED_TRACKING = 'unclicked_tracking',
    SUBSCRIBED_TRACKING = 'subscribed_tracking',
    UNSUBSCRIBED_TRACKING = 'unsubscribed_tracking',
    SENT_TRACKING = 'sent_tracking',
}
