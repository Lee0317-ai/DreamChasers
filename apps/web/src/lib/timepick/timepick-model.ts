export const defaultTimePickSections = [
  {
    name: "网页",
    sortOrder: 1,
    type: "webpage"
  },
  {
    name: "文档",
    sortOrder: 2,
    type: "document"
  },
  {
    name: "图片",
    sortOrder: 3,
    type: "image"
  },
  {
    name: "视频",
    sortOrder: 4,
    type: "video"
  }
] as const;

export function canAccessTimePickOwnerRecord({
  ownerUserId,
  requesterUserId
}: {
  ownerUserId: string;
  requesterUserId: string;
}) {
  return ownerUserId === requesterUserId;
}
