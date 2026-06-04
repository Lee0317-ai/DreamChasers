type TimePickFolderRecord = {
  createdAt: Date;
  id: string;
  name: string;
  parentId: string | null;
  sortOrder: number;
  updatedAt: Date;
  userId: string;
};

type TimePickSectionRecord = {
  createdAt: Date;
  id: string;
  name: string;
  sortOrder: number;
  type: string;
};

type TimePickResourceRecord = {
  content: string | null;
  createdAt: Date;
  fileSize: bigint;
  fileType: string | null;
  folderId: string | null;
  id: string;
  name: string;
  notes: string | null;
  parentId: string | null;
  section: TimePickSectionRecord;
  sectionId: string;
  sourceInspirationId: string | null;
  tags: string[];
  thumbnailUrl: string | null;
  updatedAt: Date;
  url: string | null;
  userId: string;
};

type TimePickInspirationRecord = {
  content: string;
  convertedToResourceId: string | null;
  createdAt: Date;
  id: string;
  location: string | null;
  status: string;
  updatedAt: Date;
  userId: string;
};

type TimePickLearningFocusRecord = {
  createdAt: Date;
  id: string;
  isPaused: boolean;
  name: string;
  synonyms: string[];
  updatedAt: Date;
  userId: string;
  weight: number;
};

type TimePickProfileRecord = {
  birthDate: Date | null;
  createdAt: Date;
  id: string;
  nickname: string | null;
  storageLimit: bigint;
  storageUsed: bigint;
  updatedAt: Date;
  userId: string;
  username: string;
};

type TimePickFortuneDrawRecord = {
  birthDate: Date;
  createdAt: Date;
  drawDate: Date;
  fortuneContent: string;
  id: string;
  imageUrl: string;
  userId: string;
};

type TimePickTryQueueLinkRecord = {
  archivedAt: Date | null;
  completeTime: Date | null;
  convertedToResourceId: string | null;
  createdAt: Date;
  description: string | null;
  id: string;
  isPriorityLocked: boolean;
  notes: string | null;
  priorityLevel: string | null;
  priorityScore: number | null;
  queuePosition: number | null;
  rating: number | null;
  startTime: Date | null;
  status: string;
  tags: string[];
  title: string | null;
  updatedAt: Date;
  url: string;
  userId: string;
};

type TimePickSearchHistoryRecord = {
  createdAt: Date;
  id: string;
  keyword: string;
  userId: string;
};

type TimePickUserRoleRecord = {
  createdAt: Date;
  id: string;
  role: string;
  userId: string;
};

export type TimePickSelectedType = "all" | "folder" | "tags";
export type TimePickDisplayMode = "folder-and-resource" | "resource-only";

export function mapTimePickFolder(folder: TimePickFolderRecord) {
  return {
    created_at: folder.createdAt.toISOString(),
    id: folder.id,
    name: folder.name,
    parent_id: folder.parentId,
    sort_order: folder.sortOrder,
    updated_at: folder.updatedAt.toISOString(),
    user_id: folder.userId
  };
}

export function mapTimePickSection(section: TimePickSectionRecord) {
  return {
    created_at: section.createdAt.toISOString(),
    id: section.id,
    name: section.name,
    sort_order: section.sortOrder,
    type: section.type
  };
}

export function mapTimePickResource(resource: TimePickResourceRecord) {
  return {
    content: resource.content,
    created_at: resource.createdAt.toISOString(),
    file_size: Number(resource.fileSize),
    file_type: resource.fileType,
    folder_id: resource.folderId,
    id: resource.id,
    module_id: null,
    name: resource.name,
    notes: resource.notes,
    parent_id: resource.parentId,
    section_id: resource.sectionId,
    sections: mapTimePickSection(resource.section),
    source_inspiration_id: resource.sourceInspirationId,
    tags: resource.tags,
    thumbnail_url: resource.thumbnailUrl,
    updated_at: resource.updatedAt.toISOString(),
    url: resource.url,
    user_id: resource.userId
  };
}

export function mapTimePickInspiration(inspiration: TimePickInspirationRecord) {
  return {
    content: inspiration.content,
    converted_to_resource_id: inspiration.convertedToResourceId,
    created_at: inspiration.createdAt.toISOString(),
    id: inspiration.id,
    location: inspiration.location,
    status: inspiration.status,
    updated_at: inspiration.updatedAt.toISOString(),
    user_id: inspiration.userId
  };
}

export function mapTimePickLearningFocus(focus: TimePickLearningFocusRecord) {
  return {
    created_at: focus.createdAt.toISOString(),
    id: focus.id,
    is_paused: focus.isPaused,
    name: focus.name,
    synonyms: focus.synonyms,
    updated_at: focus.updatedAt.toISOString(),
    user_id: focus.userId,
    weight: focus.weight
  };
}

export function mapTimePickProfile(profile: TimePickProfileRecord, resourceCount: number) {
  return {
    birth_date: profile.birthDate ? profile.birthDate.toISOString().slice(0, 10) : null,
    created_at: profile.createdAt.toISOString(),
    id: profile.id,
    nickname: profile.nickname,
    resource_count: resourceCount,
    storage_limit: Number(profile.storageLimit),
    storage_used: Number(profile.storageUsed),
    updated_at: profile.updatedAt.toISOString(),
    user_id: profile.userId,
    username: profile.username
  };
}

export function mapTimePickFortuneDraw(draw: TimePickFortuneDrawRecord, cached: boolean) {
  return {
    birth_date: draw.birthDate.toISOString().slice(0, 10),
    cached,
    created_at: draw.createdAt.toISOString(),
    draw_date: draw.drawDate.toISOString(),
    fortune_content: draw.fortuneContent,
    id: draw.id,
    image_url: draw.imageUrl,
    user_id: draw.userId
  };
}

export function mapTimePickTryQueueLink(link: TimePickTryQueueLinkRecord) {
  return {
    archived_at: link.archivedAt?.toISOString() ?? null,
    complete_time: link.completeTime?.toISOString() ?? null,
    converted_to_resource_id: link.convertedToResourceId,
    created_at: link.createdAt.toISOString(),
    description: link.description,
    id: link.id,
    is_priority_locked: link.isPriorityLocked,
    notes: link.notes,
    priority_level: link.priorityLevel,
    priority_score: link.priorityScore,
    queue_position: link.queuePosition,
    rating: link.rating,
    start_time: link.startTime?.toISOString() ?? null,
    status: link.status,
    tags: link.tags,
    title: link.title,
    updated_at: link.updatedAt.toISOString(),
    url: link.url,
    user_id: link.userId
  };
}

export function mapTimePickSearchHistory(history: TimePickSearchHistoryRecord) {
  return {
    created_at: history.createdAt.toISOString(),
    id: history.id,
    keyword: history.keyword,
    user_id: history.userId
  };
}

export function mapTimePickUserRole(userRole: TimePickUserRoleRecord) {
  return {
    created_at: userRole.createdAt.toISOString(),
    id: userRole.id,
    role: userRole.role,
    user_id: userRole.userId
  };
}

export function normalizeTimePickResourceInput(input: {
  content?: string | null;
  file_size?: number | null;
  folder_id?: string | null;
  name?: string | null;
  notes?: string | null;
  section_id?: string | null;
  source_inspiration_id?: string | null;
  tags?: string[] | null;
  thumbnail_url?: string | null;
  url?: string | null;
}) {
  return {
    content: normalizeOptionalTimePickText(input.content),
    fileSize: BigInt(Math.max(0, Math.trunc(input.file_size ?? 0))),
    folderId: normalizeOptionalTimePickId(input.folder_id),
    name: (input.name ?? "").trim(),
    notes: normalizeOptionalTimePickText(input.notes),
    sectionId: (input.section_id ?? "").trim(),
    sourceInspirationId: normalizeOptionalTimePickId(input.source_inspiration_id),
    tags: normalizeTimePickTags(input.tags),
    thumbnailUrl: normalizeOptionalTimePickText(input.thumbnail_url),
    url: normalizeOptionalTimePickText(input.url)
  };
}

export function normalizeTimePickInspirationInput(input: {
  content?: string | null;
  location?: string | null;
  status?: string | null;
}) {
  const status = input.status === "converted" || input.status === "archived" ? input.status : "active";

  return {
    content: (input.content ?? "").trim(),
    location: normalizeOptionalTimePickText(input.location),
    status
  };
}

export function normalizeTimePickLearningFocusInput(input: {
  is_paused?: boolean | null;
  name?: string | null;
  synonyms?: string[] | null;
  weight?: number | null;
}) {
  return {
    isPaused: input.is_paused === true,
    name: (input.name ?? "").trim(),
    synonyms: normalizeTimePickTags(input.synonyms),
    weight: input.weight === 0.5 || input.weight === 2 ? input.weight : 1
  };
}

export function normalizeTimePickTryQueueInput(input: {
  description?: string | null;
  is_priority_locked?: boolean | null;
  notes?: string | null;
  priority_level?: string | null;
  priority_score?: number | null;
  rating?: number | null;
  status?: string | null;
  tags?: string[] | null;
  title?: string | null;
  url?: string | null;
}) {
  return {
    description: normalizeOptionalTimePickText(input.description),
    isPriorityLocked: input.is_priority_locked === true,
    notes: normalizeOptionalTimePickText(input.notes),
    priorityLevel: normalizeTimePickPriorityLevel(input.priority_level),
    priorityScore: normalizeBoundedNumber(input.priority_score, 0, 100),
    rating: normalizeBoundedInteger(input.rating, 1, 5),
    status: normalizeTimePickTryQueueStatus(input.status),
    tags: normalizeTimePickTags(input.tags),
    title: (input.title ?? "").trim(),
    url: (input.url ?? "").trim()
  };
}

export function normalizeTimePickSearchKeyword(keyword: string | null | undefined) {
  return (keyword ?? "").trim().replace(/\s+/g, " ");
}

export function normalizeTimePickProfileBirthDate(value: string | null | undefined) {
  const normalized = (value ?? "").trim();

  if (!normalized) {
    return { birthDate: null, error: "请选择出生日期。" };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return { birthDate: null, error: "出生日期格式无效。" };
  }

  const birthDate = new Date(`${normalized}T00:00:00.000Z`);

  if (Number.isNaN(birthDate.getTime()) || birthDate.toISOString().slice(0, 10) !== normalized) {
    return { birthDate: null, error: "出生日期格式无效。" };
  }

  const today = new Date().toISOString().slice(0, 10);

  if (normalized > today) {
    return { birthDate: null, error: "出生日期不能晚于今天。" };
  }

  return { birthDate, error: null };
}

export function normalizeTimePickFortuneDrawDate(value = new Date()) {
  return new Date(`${value.toISOString().slice(0, 10)}T00:00:00.000Z`);
}

export function normalizeTimePickTryQueueStatus(status: string | null | undefined) {
  const normalized = (status ?? "").trim();
  return normalized === "trying" ||
    normalized === "completed" ||
    normalized === "deferred" ||
    normalized === "abandoned" ||
    normalized === "unstarted"
    ? normalized
    : "unstarted";
}

export function normalizeTimePickRole(role: string | null | undefined) {
  const normalized = (role ?? "").trim();
  return normalized === "collector" || normalized === "searcher" ? normalized : null;
}

export function resourceMatchesTimePickSearchKeyword(
  resource: {
    content?: string | null;
    name?: string | null;
    notes?: string | null;
    tags?: string[] | null;
    url?: string | null;
  },
  keyword: string
) {
  const normalizedKeyword = normalizeTimePickSearchKeyword(keyword).toLowerCase();

  if (!normalizedKeyword) {
    return false;
  }

  const searchableTexts = [resource.name, resource.notes, resource.url, resource.content, ...(resource.tags ?? [])];
  return searchableTexts.some((text) => (text ?? "").toLowerCase().includes(normalizedKeyword));
}

export function canWriteTimePickResource({
  requesterUserId,
  resourceOwnerUserId
}: {
  requesterUserId: string;
  resourceOwnerUserId: string;
}) {
  return requesterUserId === resourceOwnerUserId;
}

export function canWriteTimePickInspiration({
  inspirationOwnerUserId,
  requesterUserId
}: {
  inspirationOwnerUserId: string;
  requesterUserId: string;
}) {
  return inspirationOwnerUserId === requesterUserId;
}

export function canWriteTimePickLearningFocus({
  focusOwnerUserId,
  requesterUserId
}: {
  focusOwnerUserId: string;
  requesterUserId: string;
}) {
  return focusOwnerUserId === requesterUserId;
}

export function canWriteTimePickProfile({
  profileOwnerUserId,
  requesterUserId
}: {
  profileOwnerUserId: string;
  requesterUserId: string;
}) {
  return profileOwnerUserId === requesterUserId;
}

export function canWriteTimePickTryQueueLink({
  requesterUserId,
  tryQueueLinkOwnerUserId
}: {
  requesterUserId: string;
  tryQueueLinkOwnerUserId: string;
}) {
  return requesterUserId === tryQueueLinkOwnerUserId;
}

export function canDeleteTimePickSearchHistory({
  requesterUserId,
  searchHistoryOwnerUserId
}: {
  requesterUserId: string;
  searchHistoryOwnerUserId: string;
}) {
  return requesterUserId === searchHistoryOwnerUserId;
}

export function canUseTimePickResourceReferences({
  folderId,
  folders,
  sectionId,
  sections,
  userId
}: {
  folderId: string | null;
  folders: Array<{ id: string; userId: string }>;
  sectionId: string;
  sections: Array<{ id: string }>;
  userId: string;
}) {
  const hasSection = sections.some((section) => section.id === sectionId);
  const hasFolder = folderId === null || folders.some((folder) => folder.id === folderId && folder.userId === userId);

  return hasSection && hasFolder;
}

function normalizeOptionalTimePickText(value: string | null | undefined) {
  const normalized = (value ?? "").trim();
  return normalized || null;
}

function normalizeOptionalTimePickId(value: string | null | undefined) {
  const normalized = (value ?? "").trim();
  return normalized && normalized !== "none" ? normalized : null;
}

function normalizeTimePickTags(tags: string[] | null | undefined) {
  return Array.from(
    new Set(
      (tags ?? [])
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  );
}

function normalizeTimePickPriorityLevel(priorityLevel: string | null | undefined) {
  const normalized = (priorityLevel ?? "").trim();
  return normalized === "high" || normalized === "low" ? normalized : "medium";
}

function normalizeBoundedNumber(value: number | null | undefined, min: number, max: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return Math.min(max, Math.max(min, value));
}

function normalizeBoundedInteger(value: number | null | undefined, min: number, max: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return Math.min(max, Math.max(min, Math.trunc(value)));
}

export function buildTimePickResourceScope({
  descendantFolderIds = [],
  displayMode = "folder-and-resource",
  folderId,
  selectedType
}: {
  descendantFolderIds?: string[];
  displayMode?: TimePickDisplayMode;
  folderId?: string | null;
  selectedType: TimePickSelectedType;
}) {
  if (selectedType !== "folder" || !folderId) {
    return { kind: "all" as const };
  }

  return {
    folderIds: displayMode === "resource-only" ? [folderId, ...descendantFolderIds] : [folderId],
    kind: "folders" as const
  };
}

export function canMoveTimePickResource({
  requesterUserId,
  resourceOwnerUserId,
  targetFolderOwnerUserId
}: {
  requesterUserId: string;
  resourceOwnerUserId: string;
  targetFolderOwnerUserId: string | null;
}) {
  return resourceOwnerUserId === requesterUserId && (targetFolderOwnerUserId === null || targetFolderOwnerUserId === requesterUserId);
}

export function canDeleteTimePickResource({
  requesterUserId,
  resourceOwnerUserId
}: {
  requesterUserId: string;
  resourceOwnerUserId: string;
}) {
  return requesterUserId === resourceOwnerUserId;
}

export function normalizeTimePickFolderName(name: string) {
  return name.trim();
}

export function hasSiblingTimePickFolderNameConflict({
  excludeFolderId,
  folders,
  name,
  parentId,
  userId
}: {
  excludeFolderId: string | null;
  folders: Array<{ id: string; name: string; parentId: string | null; userId: string }>;
  name: string;
  parentId: string | null;
  userId: string;
}) {
  const normalizedName = normalizeTimePickFolderName(name);

  return folders.some(
    (folder) =>
      folder.userId === userId &&
      folder.id !== excludeFolderId &&
      folder.parentId === parentId &&
      normalizeTimePickFolderName(folder.name) === normalizedName
  );
}

export function canUpdateTimePickFolderParent({
  folderId,
  folders,
  requesterUserId,
  targetParentId
}: {
  folderId: string;
  folders: Array<{ id: string; parentId: string | null; userId: string }>;
  requesterUserId: string;
  targetParentId: string | null;
}) {
  const folder = folders.find((candidate) => candidate.id === folderId);

  if (!folder || folder.userId !== requesterUserId) {
    return false;
  }

  if (!targetParentId) {
    return true;
  }

  const targetParent = folders.find((candidate) => candidate.id === targetParentId);

  if (!targetParent || targetParent.userId !== requesterUserId || targetParent.id === folderId) {
    return false;
  }

  return !collectDescendantFolderIds(folders, folderId).includes(targetParentId);
}

export function buildFolderPath<T extends { id: string; parentId: string | null }>(folders: T[], folderId: string) {
  const byId = new Map(folders.map((folder) => [folder.id, folder]));
  const path: T[] = [];
  let currentId: string | null = folderId;

  while (currentId) {
    const folder = byId.get(currentId);
    if (!folder) {
      break;
    }
    path.unshift(folder);
    currentId = folder.parentId;
  }

  return path;
}

export function collectDescendantFolderIds<T extends { id: string; parentId: string | null }>(folders: T[], folderId: string) {
  const descendants: string[] = [];
  const pending = [folderId];

  while (pending.length > 0) {
    const currentId = pending.pop();
    const children = folders.filter((folder) => folder.parentId === currentId);

    for (const child of children) {
      descendants.push(child.id);
      pending.push(child.id);
    }
  }

  return descendants;
}
