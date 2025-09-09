export interface Message {
  business_id: number;
  message_text: string;
  message_date: string; // ISO
  platform: "facebook";
  bot_sender: boolean;
  sent_by_customer: boolean;
  is_deleted: boolean;
  read_by_customer: boolean;
  read_by_business: boolean;
  customer: number;
  business_social_id: number;
}
