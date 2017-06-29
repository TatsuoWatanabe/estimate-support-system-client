import { Labels } from './labels';

export const MsgCodes = {
  'RQD0001': `${Labels.password}を入力してください。`,
  'RQD0002': `${Labels.newPass}を入力してください。`,
  'RQD0003': `${Labels.newPassConfirm}を入力してください。`,
  'RQD0004': `${Labels.projectName}を入力してください。`,
  'RQD0005': `${Labels.username}を入力してください。`,
  'RQD0006': `${Labels.displayName}を入力してください。`,
  'UMP0001': `${Labels.newPassConfirm}が一致しません。`,
  'SBY0001': '半角英数記号で入力してください。',
  'SBY0002': '半角英数で入力してください。',
  'MXL0001': (max: number) => `${max}文字以内で入力してください。`,
  'MNL0001': (min: number) => `${min}文字以上で入力してください。`
};
