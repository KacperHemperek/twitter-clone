import { getAccountDetailsById } from '@/app/api/user/(routes)/[userId]/(services)/account.service';

export type accountDetails = Awaited<ReturnType<typeof getAccountDetailsById>>;
