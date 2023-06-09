import { getAccountDetailsById } from '@/app/api/user/(routes)/[userId]/(services)/account.service';

export type AccountDetails = Awaited<ReturnType<typeof getAccountDetailsById>>;
