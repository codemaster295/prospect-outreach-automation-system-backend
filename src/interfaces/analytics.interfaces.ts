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
    CLICK_TRACKING = 'click_tracking',
}
