import { DB } from '@/database/index';
import { updateCampaignById } from '../campaign/campaigns.service';
const Mailbox = DB.Mailbox
const Campaign = DB.Campaigns


export const disconnectMailboxService = async (mailboxId: string, ownerId: string) => {
    const mailbox = await Mailbox.findOne({
      where: {
        id: mailboxId,
        owner: ownerId,
      },
    })
  
    if (!mailbox) {
      throw new Error('MAILBOX_NOT_FOUND')
    }
  
    // await Campaign.update(
    //   { mailbox: null as any },
    //   { where: { mailbox: mailboxId } }
    // )
    await Mailbox.destroy({
        where: {
          id: mailboxId,
        },
      });
  }

  export const campaignUpdate = async ( 
    id: string,
    data: {
      mailbox?: string | null;
    },
  ) => {
    const updateData = {
      ...data,
      ...(data.mailbox === null ? { mailbox: null as any } : {}),
    };
  
    return await Campaign.update(updateData, { where: { id } });
  
  }