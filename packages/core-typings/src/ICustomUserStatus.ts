import type { IRocketChatRecord } from './IRocketChatRecord';
import type { UserStatus } from './UserStatus';

export interface ICustomUserStatus extends IRocketChatRecord {
	name: string;
	statusType: UserStatus;
}
