import { db } from "../db";
import {
  buildFolderPath,
  buildTimePickResourceScope,
  canWriteTimePickLearningFocus,
  canWriteTimePickProfile,
  canDeleteTimePickResource,
  canDeleteTimePickSearchHistory,
  canWriteTimePickTryQueueLink,
  canWriteTimePickInspiration,
  canMoveTimePickResource,
  canUseTimePickResourceReferences,
  canWriteTimePickResource,
  canUpdateTimePickFolderParent,
  collectDescendantFolderIds,
  hasSiblingTimePickFolderNameConflict,
  mapTimePickFortuneDraw,
  mapTimePickFolder,
  mapTimePickInspiration,
  mapTimePickLearningFocus,
  mapTimePickProfile,
  mapTimePickResource,
  mapTimePickSearchHistory,
  mapTimePickSection,
  mapTimePickTryQueueLink,
  mapTimePickUserRole,
  normalizeTimePickInspirationInput,
  normalizeTimePickLearningFocusInput,
  normalizeTimePickProfileBirthDate,
  normalizeTimePickRole,
  normalizeTimePickSearchKeyword,
  normalizeTimePickResourceInput,
  normalizeTimePickTryQueueInput,
  normalizeTimePickTryQueueStatus,
  normalizeTimePickFolderName,
  normalizeTimePickFortuneDrawDate,
  resourceMatchesTimePickSearchKeyword,
  type TimePickDisplayMode,
  type TimePickSelectedType
} from "./timepick-api-rules";

export {
  buildTimePickResourceScope,
  canWriteTimePickLearningFocus,
  canWriteTimePickProfile,
  canDeleteTimePickResource,
  canDeleteTimePickSearchHistory,
  canWriteTimePickTryQueueLink,
  canWriteTimePickInspiration,
  canMoveTimePickResource,
  canUseTimePickResourceReferences,
  canWriteTimePickResource,
  canUpdateTimePickFolderParent,
  hasSiblingTimePickFolderNameConflict,
  mapTimePickFortuneDraw,
  mapTimePickFolder,
  mapTimePickInspiration,
  mapTimePickLearningFocus,
  mapTimePickProfile,
  mapTimePickResource,
  mapTimePickSearchHistory,
  mapTimePickTryQueueLink,
  mapTimePickUserRole,
  normalizeTimePickInspirationInput,
  normalizeTimePickLearningFocusInput,
  normalizeTimePickProfileBirthDate,
  normalizeTimePickRole,
  normalizeTimePickResourceInput,
  normalizeTimePickTryQueueInput,
  normalizeTimePickTryQueueStatus,
  normalizeTimePickFolderName,
  normalizeTimePickFortuneDrawDate,
  normalizeTimePickSearchKeyword,
  resourceMatchesTimePickSearchKeyword
};
export type { TimePickDisplayMode, TimePickSelectedType };

export async function getTimePickUserIdByEmail(email: string) {
  const user = await db.user.findUnique({
    select: {
      id: true
    },
    where: {
      email
    }
  });

  if (!user) {
    throw new Error("账号不存在，请重新登录。");
  }

  return user.id;
}

export async function listTimePickFolders(userId: string) {
  const folders = await db.timePickFolder.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    where: {
      userId
    }
  });

  return folders.map(mapTimePickFolder);
}

export async function listTimePickSections() {
  const sections = await db.timePickSection.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });

  return sections.map(mapTimePickSection);
}

export async function createTimePickFolder({
  name,
  parentId,
  userId
}: {
  name: string;
  parentId: string | null;
  userId: string;
}) {
  const normalizedName = normalizeTimePickFolderName(name);

  if (!normalizedName) {
    return { error: "文件夹名称不能为空。", folder: null, status: 400 as const };
  }

  const folders = await db.timePickFolder.findMany({
    select: {
      id: true,
      name: true,
      parentId: true,
      userId: true
    },
    where: {
      userId
    }
  });

  if (parentId && !folders.some((folder) => folder.id === parentId && folder.userId === userId)) {
    return { error: "父文件夹不存在。", folder: null, status: 404 as const };
  }

  if (
    hasSiblingTimePickFolderNameConflict({
      excludeFolderId: null,
      folders,
      name: normalizedName,
      parentId,
      userId
    })
  ) {
    return { error: "该位置已存在同名文件夹。", folder: null, status: 409 as const };
  }

  const folder = await db.timePickFolder.create({
    data: {
      name: normalizedName,
      parentId,
      userId
    }
  });

  return { error: null, folder: mapTimePickFolder(folder), status: 201 as const };
}

export async function createTimePickResource({
  input,
  userId
}: {
  input: Parameters<typeof normalizeTimePickResourceInput>[0];
  userId: string;
}) {
  const normalized = normalizeTimePickResourceInput(input);

  const referenceCheck = await validateTimePickResourceReferences({
    folderId: normalized.folderId,
    sectionId: normalized.sectionId,
    sourceInspirationId: normalized.sourceInspirationId,
    userId
  });

  if (!normalized.name) {
    return { error: "资源名称不能为空。", resource: null, status: 400 as const };
  }

  if (!normalized.sectionId) {
    return { error: "请选择资源板块。", resource: null, status: 400 as const };
  }

  if (!referenceCheck.ok) {
    return { error: referenceCheck.error, resource: null, status: referenceCheck.status };
  }

  const resource = await db.timePickResource.create({
    data: {
      content: normalized.content,
      fileSize: normalized.fileSize,
      folderId: normalized.folderId,
      name: normalized.name,
      notes: normalized.notes,
      sectionId: normalized.sectionId,
      sourceInspirationId: normalized.sourceInspirationId,
      tags: normalized.tags,
      thumbnailUrl: normalized.thumbnailUrl,
      url: normalized.url,
      userId
    },
    include: {
      section: true
    }
  });

  return { error: null, resource: mapTimePickResource(resource), status: 201 as const };
}

export async function updateTimePickResource({
  input,
  resourceId,
  userId
}: {
  input: Parameters<typeof normalizeTimePickResourceInput>[0];
  resourceId: string;
  userId: string;
}) {
  const normalized = normalizeTimePickResourceInput(input);

  if (!normalized.name) {
    return { error: "资源名称不能为空。", resource: null, status: 400 as const };
  }

  if (!normalized.sectionId) {
    return { error: "请选择资源板块。", resource: null, status: 400 as const };
  }

  const resource = await db.timePickResource.findUnique({
    select: {
      id: true,
      userId: true
    },
    where: {
      id: resourceId
    }
  });

  if (
    !resource ||
    !canWriteTimePickResource({
      requesterUserId: userId,
      resourceOwnerUserId: resource.userId
    })
  ) {
    return { error: "资源不存在或无权编辑。", resource: null, status: 404 as const };
  }

  const referenceCheck = await validateTimePickResourceReferences({
    folderId: normalized.folderId,
    sectionId: normalized.sectionId,
    sourceInspirationId: normalized.sourceInspirationId,
    userId
  });

  if (!referenceCheck.ok) {
    return { error: referenceCheck.error, resource: null, status: referenceCheck.status };
  }

  const updatedResource = await db.timePickResource.update({
    data: {
      content: normalized.content,
      fileSize: normalized.fileSize,
      folderId: normalized.folderId,
      name: normalized.name,
      notes: normalized.notes,
      sectionId: normalized.sectionId,
      sourceInspirationId: normalized.sourceInspirationId,
      tags: normalized.tags,
      thumbnailUrl: normalized.thumbnailUrl,
      url: normalized.url
    },
    include: {
      section: true
    },
    where: {
      id: resourceId
    }
  });

  return { error: null, resource: mapTimePickResource(updatedResource), status: 200 as const };
}

export async function updateTimePickFolder({
  folderId,
  name,
  parentId,
  userId
}: {
  folderId: string;
  name: string;
  parentId: string | null;
  userId: string;
}) {
  const normalizedName = normalizeTimePickFolderName(name);

  if (!normalizedName) {
    return { error: "文件夹名称不能为空。", folder: null, status: 400 as const };
  }

  const folders = await db.timePickFolder.findMany({
    select: {
      id: true,
      name: true,
      parentId: true,
      userId: true
    },
    where: {
      userId
    }
  });

  if (!folders.some((folder) => folder.id === folderId && folder.userId === userId)) {
    return { error: "文件夹不存在。", folder: null, status: 404 as const };
  }

  if (!canUpdateTimePickFolderParent({ folderId, folders, requesterUserId: userId, targetParentId: parentId })) {
    return { error: "不能将文件夹移动到该位置。", folder: null, status: 400 as const };
  }

  if (
    hasSiblingTimePickFolderNameConflict({
      excludeFolderId: folderId,
      folders,
      name: normalizedName,
      parentId,
      userId
    })
  ) {
    return { error: "该位置已存在同名文件夹。", folder: null, status: 409 as const };
  }

  const folder = await db.timePickFolder.update({
    data: {
      name: normalizedName,
      parentId
    },
    where: {
      id: folderId
    }
  });

  return { error: null, folder: mapTimePickFolder(folder), status: 200 as const };
}

export async function listTimePickResourceView({
  displayMode,
  folderId,
  selectedType,
  userId
}: {
  displayMode: TimePickDisplayMode;
  folderId?: string | null;
  selectedType: TimePickSelectedType;
  userId: string;
}) {
  const allFolders = await db.timePickFolder.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    where: {
      userId
    }
  });

  const subFolders =
    selectedType === "folder"
      ? allFolders.filter((folder) => folder.parentId === folderId)
      : selectedType === "all"
        ? allFolders.filter((folder) => folder.parentId === null)
        : [];

  const folderPath = selectedType === "folder" && folderId ? buildFolderPath(allFolders, folderId) : [];
  const descendantFolderIds = selectedType === "folder" && folderId ? collectDescendantFolderIds(allFolders, folderId) : [];
  const scope = buildTimePickResourceScope({
    descendantFolderIds,
    displayMode,
    folderId,
    selectedType
  });

  const resources = await db.timePickResource.findMany({
    include: {
      section: true
    },
    orderBy: {
      createdAt: "desc"
    },
    where: {
      userId,
      ...(scope.kind === "folders" ? { folderId: { in: scope.folderIds } } : {})
    }
  });

  return {
    folderPath: folderPath.map(mapTimePickFolder),
    resources: resources.map(mapTimePickResource),
    subFolders: subFolders.map(mapTimePickFolder)
  };
}

export async function searchTimePickResources({ keyword, userId }: { keyword: string; userId: string }) {
  const normalizedKeyword = normalizeTimePickSearchKeyword(keyword);

  if (!normalizedKeyword) {
    return { error: "搜索关键词不能为空。", resources: null, status: 400 as const };
  }

  const resources = await db.timePickResource.findMany({
    include: {
      section: true
    },
    orderBy: {
      createdAt: "desc"
    },
    where: {
      userId
    }
  });

  return {
    error: null,
    resources: resources
      .filter((resource) => resourceMatchesTimePickSearchKeyword(resource, normalizedKeyword))
      .map(mapTimePickResource),
    status: 200 as const
  };
}

export async function listTimePickSearchHistory(userId: string) {
  const history = await db.timePickSearchHistory.findMany({
    orderBy: {
      createdAt: "desc"
    },
    take: 10,
    where: {
      userId
    }
  });

  return history.map(mapTimePickSearchHistory);
}

export async function createTimePickSearchHistory({ keyword, userId }: { keyword: string; userId: string }) {
  const normalizedKeyword = normalizeTimePickSearchKeyword(keyword);

  if (!normalizedKeyword) {
    return { error: "搜索关键词不能为空。", history: null, status: 400 as const };
  }

  const [, history] = await db.$transaction([
    db.timePickSearchHistory.deleteMany({
      where: {
        keyword: normalizedKeyword,
        userId
      }
    }),
    db.timePickSearchHistory.create({
      data: {
        keyword: normalizedKeyword,
        userId
      }
    })
  ]);

  return { error: null, history: mapTimePickSearchHistory(history), status: 201 as const };
}

export async function getTimePickUserRole(userId: string) {
  const userRole = await db.timePickUserRole.findUnique({
    where: {
      userId
    }
  });

  return userRole ? mapTimePickUserRole(userRole) : null;
}

export async function getTimePickProfileForEmail(email: string) {
  const user = await db.user.findUnique({
    select: {
      email: true,
      id: true,
      name: true
    },
    where: {
      email
    }
  });

  if (!user) {
    throw new Error("账号不存在，请重新登录。");
  }

  const [profile, resourceCount] = await db.$transaction([
    db.timePickProfile.upsert({
      create: {
        nickname: buildDefaultTimePickNickname(user.email, user.name),
        userId: user.id,
        username: buildDefaultTimePickUsername(user.email)
      },
      update: {},
      where: {
        userId: user.id
      }
    }),
    db.timePickResource.count({
      where: {
        userId: user.id
      }
    })
  ]);

  return mapTimePickProfile(profile, resourceCount);
}

export async function updateTimePickProfileBirthDate({
  birthDate,
  email
}: {
  birthDate: string | null | undefined;
  email: string;
}) {
  const user = await db.user.findUnique({
    select: {
      email: true,
      id: true,
      name: true
    },
    where: {
      email
    }
  });

  if (!user) {
    throw new Error("账号不存在，请重新登录。");
  }

  const normalized = normalizeTimePickProfileBirthDate(birthDate);

  if (normalized.error) {
    return { error: normalized.error, profile: null, status: 400 as const };
  }

  const existingProfile = await db.timePickProfile.upsert({
    create: {
      birthDate: normalized.birthDate,
      nickname: buildDefaultTimePickNickname(user.email, user.name),
      userId: user.id,
      username: buildDefaultTimePickUsername(user.email)
    },
    update: {},
    where: {
      userId: user.id
    }
  });

  if (
    !canWriteTimePickProfile({
      profileOwnerUserId: existingProfile.userId,
      requesterUserId: user.id
    })
  ) {
    return { error: "资料不存在或无权编辑。", profile: null, status: 404 as const };
  }

  const [profile, resourceCount] = await db.$transaction([
    db.timePickProfile.update({
      data: {
        birthDate: normalized.birthDate
      },
      where: {
        userId: user.id
      }
    }),
    db.timePickResource.count({
      where: {
        userId: user.id
      }
    })
  ]);

  return { error: null, profile: mapTimePickProfile(profile, resourceCount), status: 200 as const };
}

export async function drawTimePickFortuneForEmail(email: string) {
  const user = await db.user.findUnique({
    select: {
      email: true,
      id: true,
      name: true
    },
    where: {
      email
    }
  });

  if (!user) {
    throw new Error("账号不存在，请重新登录。");
  }

  const profile = await db.timePickProfile.upsert({
    create: {
      nickname: buildDefaultTimePickNickname(user.email, user.name),
      userId: user.id,
      username: buildDefaultTimePickUsername(user.email)
    },
    update: {},
    where: {
      userId: user.id
    }
  });

  if (!profile.birthDate) {
    return { draw: null, error: "请先设置出生日期。", status: 409 as const };
  }

  const drawDate = normalizeTimePickFortuneDrawDate();
  const cachedDraw = await db.timePickFortuneDraw.findUnique({
    where: {
      userId_drawDate: {
        drawDate,
        userId: user.id
      }
    }
  });

  if (cachedDraw) {
    return { draw: mapTimePickFortuneDraw(cachedDraw, true), error: null, status: 200 as const };
  }

  const fortune = buildTimePickDailyFortune({
    birthDate: profile.birthDate,
    drawDate,
    nickname: profile.nickname || user.name || "拾光用户"
  });
  const draw = await db.timePickFortuneDraw.create({
    data: {
      birthDate: profile.birthDate,
      drawDate,
      fortuneContent: fortune.content,
      imageUrl: fortune.imageUrl,
      userId: user.id
    }
  });

  return { draw: mapTimePickFortuneDraw(draw, false), error: null, status: 201 as const };
}

export async function setTimePickUserRole({ role, userId }: { role: string | null | undefined; userId: string }) {
  const normalizedRole = normalizeTimePickRole(role);

  if (!normalizedRole) {
    return { error: "角色类型无效。", role: null, status: 400 as const };
  }

  const userRole = await db.timePickUserRole.upsert({
    create: {
      role: normalizedRole,
      userId
    },
    update: {
      role: normalizedRole
    },
    where: {
      userId
    }
  });

  return { error: null, role: mapTimePickUserRole(userRole), status: 200 as const };
}

export async function listTimePickLearningFocus(userId: string) {
  const foci = await db.timePickLearningFocus.findMany({
    orderBy: {
      createdAt: "desc"
    },
    where: {
      userId
    }
  });

  return foci.map(mapTimePickLearningFocus);
}

export async function listTimePickTryQueueLinks({
  status,
  userId
}: {
  status?: string | null;
  userId: string;
}) {
  const normalizedStatus = status && status !== "all" ? normalizeTimePickTryQueueStatus(status) : null;
  const links = await db.timePickTryQueueLink.findMany({
    orderBy: {
      createdAt: "desc"
    },
    where: {
      userId,
      ...(normalizedStatus ? { status: normalizedStatus } : {})
    }
  });

  return links.map(mapTimePickTryQueueLink);
}

export async function createTimePickTryQueueLink({
  input,
  userId
}: {
  input: Parameters<typeof normalizeTimePickTryQueueInput>[0];
  userId: string;
}) {
  const normalized = normalizeTimePickTryQueueInput(input);

  if (!normalized.url) {
    return { error: "任务链接不能为空。", status: 400 as const, todo: null };
  }

  if (!normalized.title) {
    return { error: "任务标题不能为空。", status: 400 as const, todo: null };
  }

  const todo = await db.timePickTryQueueLink.create({
    data: {
      description: normalized.description,
      isPriorityLocked: normalized.isPriorityLocked,
      notes: normalized.notes,
      priorityLevel: normalized.priorityLevel,
      priorityScore: normalized.priorityScore,
      rating: null,
      status: normalized.status,
      tags: normalized.tags,
      title: normalized.title,
      url: normalized.url,
      userId
    }
  });

  return { error: null, status: 201 as const, todo: mapTimePickTryQueueLink(todo) };
}

export async function updateTimePickTryQueueLink({
  input,
  todoId,
  userId
}: {
  input: Partial<Parameters<typeof normalizeTimePickTryQueueInput>[0]> & {
    complete_time?: string | null;
    start_time?: string | null;
  };
  todoId: string;
  userId: string;
}) {
  const todo = await db.timePickTryQueueLink.findUnique({
    where: {
      id: todoId
    }
  });

  if (
    !todo ||
    !canWriteTimePickTryQueueLink({
      requesterUserId: userId,
      tryQueueLinkOwnerUserId: todo.userId
    })
  ) {
    return { error: "任务不存在或无权编辑。", status: 404 as const, todo: null };
  }

  const normalized = normalizeTimePickTryQueueInput({
    description: input.description ?? todo.description,
    is_priority_locked: input.is_priority_locked ?? todo.isPriorityLocked,
    notes: input.notes ?? todo.notes,
    priority_level: input.priority_level ?? todo.priorityLevel,
    priority_score: input.priority_score ?? todo.priorityScore,
    rating: input.rating ?? todo.rating,
    status: input.status ?? todo.status,
    tags: input.tags ?? todo.tags,
    title: input.title ?? todo.title,
    url: input.url ?? todo.url
  });

  if (!normalized.url) {
    return { error: "任务链接不能为空。", status: 400 as const, todo: null };
  }

  if (!normalized.title) {
    return { error: "任务标题不能为空。", status: 400 as const, todo: null };
  }

  if (normalized.status === "completed" && normalized.rating === null) {
    return { error: "完成任务需要评分。", status: 400 as const, todo: null };
  }

  const updated = await db.timePickTryQueueLink.update({
    data: {
      completeTime: normalizeOptionalTimePickDate(input.complete_time) ?? (normalized.status === "completed" ? (todo.completeTime ?? new Date()) : null),
      description: normalized.description,
      isPriorityLocked: normalized.isPriorityLocked,
      notes: normalized.notes,
      priorityLevel: normalized.priorityLevel,
      priorityScore: normalized.priorityScore,
      rating: normalized.status === "completed" ? normalized.rating : null,
      startTime: normalizeOptionalTimePickDate(input.start_time) ?? (normalized.status === "trying" ? (todo.startTime ?? new Date()) : todo.startTime),
      status: normalized.status,
      tags: normalized.tags,
      title: normalized.title,
      url: normalized.url
    },
    where: {
      id: todoId
    }
  });

  return { error: null, status: 200 as const, todo: mapTimePickTryQueueLink(updated) };
}

export async function createTimePickLearningFocus({
  input,
  userId
}: {
  input: Parameters<typeof normalizeTimePickLearningFocusInput>[0];
  userId: string;
}) {
  const normalized = normalizeTimePickLearningFocusInput(input);

  if (!normalized.name) {
    return { error: "学习重点名称不能为空。", focus: null, status: 400 as const };
  }

  const focus = await db.timePickLearningFocus.create({
    data: {
      isPaused: normalized.isPaused,
      name: normalized.name,
      synonyms: normalized.synonyms,
      userId,
      weight: normalized.weight
    }
  });

  return { error: null, focus: mapTimePickLearningFocus(focus), status: 201 as const };
}

export async function updateTimePickLearningFocus({
  focusId,
  input,
  userId
}: {
  focusId: string;
  input: Partial<Parameters<typeof normalizeTimePickLearningFocusInput>[0]>;
  userId: string;
}) {
  const focus = await db.timePickLearningFocus.findUnique({
    where: {
      id: focusId
    }
  });

  if (
    !focus ||
    !canWriteTimePickLearningFocus({
      focusOwnerUserId: focus.userId,
      requesterUserId: userId
    })
  ) {
    return { error: "学习重点不存在或无权编辑。", focus: null, status: 404 as const };
  }

  const normalized = normalizeTimePickLearningFocusInput({
    is_paused: input.is_paused ?? focus.isPaused,
    name: input.name ?? focus.name,
    synonyms: input.synonyms ?? focus.synonyms,
    weight: input.weight ?? focus.weight
  });

  if (!normalized.name) {
    return { error: "学习重点名称不能为空。", focus: null, status: 400 as const };
  }

  const updated = await db.timePickLearningFocus.update({
    data: {
      isPaused: normalized.isPaused,
      name: normalized.name,
      synonyms: normalized.synonyms,
      weight: normalized.weight
    },
    where: {
      id: focusId
    }
  });

  return { error: null, focus: mapTimePickLearningFocus(updated), status: 200 as const };
}

export async function deleteTimePickLearningFocus({ focusId, userId }: { focusId: string; userId: string }) {
  const focus = await db.timePickLearningFocus.findUnique({
    select: {
      id: true,
      userId: true
    },
    where: {
      id: focusId
    }
  });

  if (
    !focus ||
    !canWriteTimePickLearningFocus({
      focusOwnerUserId: focus.userId,
      requesterUserId: userId
    })
  ) {
    return false;
  }

  await db.timePickLearningFocus.delete({
    where: {
      id: focusId
    }
  });

  return true;
}

export async function deleteTimePickTryQueueLink({ todoId, userId }: { todoId: string; userId: string }) {
  const todo = await db.timePickTryQueueLink.findUnique({
    select: {
      id: true,
      userId: true
    },
    where: {
      id: todoId
    }
  });

  if (
    !todo ||
    !canWriteTimePickTryQueueLink({
      requesterUserId: userId,
      tryQueueLinkOwnerUserId: todo.userId
    })
  ) {
    return false;
  }

  await db.timePickTryQueueLink.delete({
    where: {
      id: todoId
    }
  });

  return true;
}

export async function listTimePickInspirations({
  limit,
  status,
  userId
}: {
  limit?: number | null;
  status?: string | null;
  userId: string;
}) {
  const normalizedLimit = limit ? Math.max(1, Math.min(50, Math.trunc(limit))) : undefined;
  const inspirations = await db.timePickInspiration.findMany({
    orderBy: {
      createdAt: "desc"
    },
    take: normalizedLimit,
    where: {
      userId,
      ...(status ? { status } : {})
    }
  });

  return inspirations.map(mapTimePickInspiration);
}

export async function createTimePickInspiration({
  input,
  userId
}: {
  input: Parameters<typeof normalizeTimePickInspirationInput>[0];
  userId: string;
}) {
  const normalized = normalizeTimePickInspirationInput(input);

  if (!normalized.content) {
    return { error: "灵感内容不能为空。", inspiration: null, status: 400 as const };
  }

  const inspiration = await db.timePickInspiration.create({
    data: {
      content: normalized.content,
      location: normalized.location,
      status: normalized.status,
      userId
    }
  });

  return { error: null, inspiration: mapTimePickInspiration(inspiration), status: 201 as const };
}

export async function updateTimePickInspiration({
  input,
  inspirationId,
  userId
}: {
  input: Partial<Parameters<typeof normalizeTimePickInspirationInput>[0]>;
  inspirationId: string;
  userId: string;
}) {
  const inspiration = await db.timePickInspiration.findUnique({
    where: {
      id: inspirationId
    }
  });

  if (
    !inspiration ||
    !canWriteTimePickInspiration({
      inspirationOwnerUserId: inspiration.userId,
      requesterUserId: userId
    })
  ) {
    return { error: "灵感不存在或无权编辑。", inspiration: null, status: 404 as const };
  }

  const normalized = normalizeTimePickInspirationInput({
    content: input.content ?? inspiration.content,
    location: input.location ?? inspiration.location,
    status: input.status ?? inspiration.status
  });

  if (!normalized.content) {
    return { error: "灵感内容不能为空。", inspiration: null, status: 400 as const };
  }

  const updated = await db.timePickInspiration.update({
    data: {
      content: normalized.content,
      location: normalized.location,
      status: normalized.status
    },
    where: {
      id: inspirationId
    }
  });

  return { error: null, inspiration: mapTimePickInspiration(updated), status: 200 as const };
}

export async function moveTimePickResource({
  resourceId,
  targetFolderId,
  userId
}: {
  resourceId: string;
  targetFolderId: string | null;
  userId: string;
}) {
  const [resource, targetFolder] = await Promise.all([
    db.timePickResource.findUnique({
      select: {
        id: true,
        userId: true
      },
      where: {
        id: resourceId
      }
    }),
    targetFolderId
      ? db.timePickFolder.findUnique({
          select: {
            id: true,
            userId: true
          },
          where: {
            id: targetFolderId
          }
        })
      : Promise.resolve(null)
  ]);

  if (
    !resource ||
    (targetFolderId && !targetFolder) ||
    !canMoveTimePickResource({
      requesterUserId: userId,
      resourceOwnerUserId: resource?.userId ?? "",
      targetFolderOwnerUserId: targetFolder?.userId ?? null
    })
  ) {
    return null;
  }

  return db.timePickResource.update({
    data: {
      folderId: targetFolderId
    },
    where: {
      id: resourceId
    }
  });
}

export async function deleteTimePickResource({ resourceId, userId }: { resourceId: string; userId: string }) {
  const resource = await db.timePickResource.findUnique({
    select: {
      id: true,
      userId: true
    },
    where: {
      id: resourceId
    }
  });

  if (
    !resource ||
    !canDeleteTimePickResource({
      requesterUserId: userId,
      resourceOwnerUserId: resource.userId
    })
  ) {
    return false;
  }

  await db.timePickResource.delete({
    where: {
      id: resourceId
    }
  });

  return true;
}

export async function deleteTimePickSearchHistory({ historyId, userId }: { historyId: string; userId: string }) {
  const history = await db.timePickSearchHistory.findUnique({
    select: {
      id: true,
      userId: true
    },
    where: {
      id: historyId
    }
  });

  if (
    !history ||
    !canDeleteTimePickSearchHistory({
      requesterUserId: userId,
      searchHistoryOwnerUserId: history.userId
    })
  ) {
    return false;
  }

  await db.timePickSearchHistory.delete({
    where: {
      id: historyId
    }
  });

  return true;
}

export async function deleteTimePickInspiration({ inspirationId, userId }: { inspirationId: string; userId: string }) {
  const inspiration = await db.timePickInspiration.findUnique({
    select: {
      id: true,
      userId: true
    },
    where: {
      id: inspirationId
    }
  });

  if (
    !inspiration ||
    !canWriteTimePickInspiration({
      inspirationOwnerUserId: inspiration.userId,
      requesterUserId: userId
    })
  ) {
    return false;
  }

  await db.timePickInspiration.delete({
    where: {
      id: inspirationId
    }
  });

  return true;
}

export async function deleteTimePickFolder({ folderId, userId }: { folderId: string; userId: string }) {
  const folders = await db.timePickFolder.findMany({
    select: {
      id: true,
      parentId: true,
      userId: true
    },
    where: {
      userId
    }
  });
  const targetFolder = folders.find((folder) => folder.id === folderId);

  if (!targetFolder || targetFolder.userId !== userId) {
    return false;
  }

  const folderIds = [folderId, ...collectDescendantFolderIds(folders, folderId)];

  await db.$transaction([
    db.timePickResource.deleteMany({
      where: {
        folderId: {
          in: folderIds
        },
        userId
      }
    }),
    db.timePickFolder.deleteMany({
      where: {
        id: {
          in: folderIds
        },
        userId
      }
    })
  ]);

  return true;
}

async function validateTimePickResourceReferences({
  folderId,
  sectionId,
  sourceInspirationId,
  userId
}: {
  folderId: string | null;
  sectionId: string;
  sourceInspirationId: string | null;
  userId: string;
}) {
  const [sections, folders, sourceInspiration] = await Promise.all([
    db.timePickSection.findMany({
      select: {
        id: true
      }
    }),
    db.timePickFolder.findMany({
      select: {
        id: true,
        userId: true
      },
      where: {
        userId
      }
    }),
    sourceInspirationId
      ? db.timePickInspiration.findUnique({
          select: {
            id: true,
            userId: true
          },
          where: {
            id: sourceInspirationId
          }
        })
      : Promise.resolve(null)
  ]);

  if (
    !canUseTimePickResourceReferences({
      folderId,
      folders,
      sectionId,
      sections,
      userId
    })
  ) {
    return { error: "资源板块或文件夹不存在。", ok: false as const, status: 404 as const };
  }

  if (sourceInspirationId && sourceInspiration?.userId !== userId) {
    return { error: "灵感来源不存在。", ok: false as const, status: 404 as const };
  }

  return { ok: true as const };
}

function normalizeOptionalTimePickDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function buildDefaultTimePickUsername(email: string) {
  return email.trim().toLowerCase();
}

function buildDefaultTimePickNickname(email: string, name?: string | null) {
  return name?.trim() || email.split("@")[0] || email;
}

function buildTimePickDailyFortune({
  birthDate,
  drawDate,
  nickname
}: {
  birthDate: Date;
  drawDate: Date;
  nickname: string;
}) {
  const signs = ["白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座"];
  const seed = `${birthDate.toISOString().slice(0, 10)}-${drawDate.toISOString().slice(0, 10)}`;
  const index = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0) % signs.length;
  const constellation = signs[index];
  const date = drawDate.toISOString().slice(0, 10);
  const content = [
    `**星座**：${constellation}`,
    `**时间**：${date}`,
    "",
    "「事业」",
    "▶️ 趋势：适合把手上的事项重新排序，先处理能立刻推进的小步骤。",
    "▶️ 建议：避免一次承诺太多，把今天最重要的一件事做扎实。",
    "",
    "「学业」",
    "▶️ 趋势：理解力稳定，适合复盘旧材料并补齐薄弱环节。",
    "▶️ 建议：用短时间高频回顾代替长时间硬撑。",
    "",
    "「感情」",
    "▶️ 趋势：表达会比猜测更有效，适合主动确认对方真实想法。",
    "▶️ 建议：少用试探，多用清楚、温和的句子。",
    "",
    "「健康」",
    "▶️ 趋势：精力恢复取决于节奏管理，晚间需要留出缓冲。",
    "▶️ 建议：今天至少安排一次离屏休息。"
  ].join("\n");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="960" viewBox="0 0 960 960"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f5f3ff"/><stop offset="1" stop-color="#fce7f3"/></linearGradient></defs><rect width="960" height="960" rx="48" fill="url(#g)"/><circle cx="480" cy="300" r="110" fill="#7c3aed" opacity=".14"/><text x="480" y="230" text-anchor="middle" font-size="42" fill="#6d28d9" font-family="Arial, sans-serif">${escapeSvgText(nickname)}</text><text x="480" y="340" text-anchor="middle" font-size="74" font-weight="700" fill="#6d28d9" font-family="Arial, sans-serif">${constellation}</text><text x="480" y="440" text-anchor="middle" font-size="38" fill="#be185d" font-family="Arial, sans-serif">今日运势</text><text x="480" y="540" text-anchor="middle" font-size="34" fill="#374151" font-family="Arial, sans-serif">先做能推进的一小步</text><text x="480" y="610" text-anchor="middle" font-size="28" fill="#6b7280" font-family="Arial, sans-serif">${date}</text></svg>`;

  return {
    content,
    imageUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  };
}

function escapeSvgText(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
