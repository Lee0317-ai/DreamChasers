import { describe, expect, it } from "vitest";
import {
  buildTimePickResourceScope,
  canDeleteTimePickResource,
  canDeleteTimePickSearchHistory,
  canWriteTimePickLearningFocus,
  canWriteTimePickProfile,
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
  mapTimePickTryQueueLink,
  mapTimePickUserRole,
  mapTimePickSearchHistory,
  normalizeTimePickInspirationInput,
  normalizeTimePickLearningFocusInput,
  normalizeTimePickProfileBirthDate,
  normalizeTimePickResourceInput,
  normalizeTimePickTryQueueInput,
  normalizeTimePickTryQueueStatus,
  normalizeTimePickFolderName,
  normalizeTimePickFortuneDrawDate,
  normalizeTimePickRole,
  normalizeTimePickSearchKeyword,
  resourceMatchesTimePickSearchKeyword
} from "../timepick-api-rules";

describe("timepick api rules", () => {
  it("maps folders to legacy TimePick field names", () => {
    expect(
      mapTimePickFolder({
        createdAt: new Date("2026-06-03T10:00:00.000Z"),
        id: "folder_1",
        name: "Inbox",
        parentId: null,
        sortOrder: 2,
        updatedAt: new Date("2026-06-03T10:01:00.000Z"),
        userId: "user_1"
      })
    ).toEqual({
      created_at: "2026-06-03T10:00:00.000Z",
      id: "folder_1",
      name: "Inbox",
      parent_id: null,
      sort_order: 2,
      updated_at: "2026-06-03T10:01:00.000Z",
      user_id: "user_1"
    });
  });

  it("maps resources with section metadata and bigint file size", () => {
    expect(
      mapTimePickResource({
        content: null,
        createdAt: new Date("2026-06-03T10:00:00.000Z"),
        fileSize: 42n,
        fileType: "pdf",
        folderId: "folder_1",
        id: "resource_1",
        name: "Spec",
        notes: "Read later",
        parentId: null,
        section: {
          createdAt: new Date("2026-06-03T09:00:00.000Z"),
          id: "section_1",
          name: "文档",
          sortOrder: 2,
          type: "document"
        },
        sectionId: "section_1",
        sourceInspirationId: null,
        tags: ["product"],
        thumbnailUrl: null,
        updatedAt: new Date("2026-06-03T10:01:00.000Z"),
        url: "https://example.com/spec.pdf",
        userId: "user_1"
      })
    ).toMatchObject({
      file_size: 42,
      file_type: "pdf",
      folder_id: "folder_1",
      id: "resource_1",
      name: "Spec",
      sections: {
        name: "文档",
        sort_order: 2,
        type: "document"
      },
      tags: ["product"],
      user_id: "user_1"
    });
  });

  it("maps inspirations to legacy TimePick field names", () => {
    expect(
      mapTimePickInspiration({
        content: "记录一个想法",
        convertedToResourceId: null,
        createdAt: new Date("2026-06-04T10:00:00.000Z"),
        id: "inspiration_1",
        location: "书桌",
        status: "active",
        updatedAt: new Date("2026-06-04T10:01:00.000Z"),
        userId: "user_1"
      })
    ).toEqual({
      content: "记录一个想法",
      converted_to_resource_id: null,
      created_at: "2026-06-04T10:00:00.000Z",
      id: "inspiration_1",
      location: "书桌",
      status: "active",
      updated_at: "2026-06-04T10:01:00.000Z",
      user_id: "user_1"
    });
  });

  it("maps learning focus records to legacy TimePick field names", () => {
    expect(
      mapTimePickLearningFocus({
        createdAt: new Date("2026-06-04T10:00:00.000Z"),
        id: "focus_1",
        isPaused: false,
        name: "React",
        synonyms: ["hooks"],
        updatedAt: new Date("2026-06-04T10:01:00.000Z"),
        userId: "user_1",
        weight: 1
      })
    ).toEqual({
      created_at: "2026-06-04T10:00:00.000Z",
      id: "focus_1",
      is_paused: false,
      name: "React",
      synonyms: ["hooks"],
      updated_at: "2026-06-04T10:01:00.000Z",
      user_id: "user_1",
      weight: 1
    });
  });

  it("maps profile records to legacy TimePick field names with resource count", () => {
    expect(
      mapTimePickProfile(
        {
          birthDate: new Date("1990-01-02T00:00:00.000Z"),
          createdAt: new Date("2026-06-04T10:00:00.000Z"),
          id: "profile_1",
          nickname: "Lee",
          storageLimit: 1073741824n,
          storageUsed: 1048576n,
          updatedAt: new Date("2026-06-04T10:01:00.000Z"),
          userId: "user_1",
          username: "lee"
        },
        12
      )
    ).toEqual({
      birth_date: "1990-01-02",
      created_at: "2026-06-04T10:00:00.000Z",
      id: "profile_1",
      nickname: "Lee",
      resource_count: 12,
      storage_limit: 1073741824,
      storage_used: 1048576,
      updated_at: "2026-06-04T10:01:00.000Z",
      user_id: "user_1",
      username: "lee"
    });
  });

  it("maps fortune draw records with cached state to legacy TimePick field names", () => {
    expect(
      mapTimePickFortuneDraw(
        {
          birthDate: new Date("1990-01-02T00:00:00.000Z"),
          createdAt: new Date("2026-06-04T10:00:00.000Z"),
          drawDate: new Date("2026-06-04T00:00:00.000Z"),
          fortuneContent: "**星座**：摩羯座\n「事业」稳步推进",
          id: "fortune_1",
          imageUrl: "data:image/svg+xml,%3Csvg%3E%3C/svg%3E",
          userId: "user_1"
        },
        true
      )
    ).toEqual({
      birth_date: "1990-01-02",
      cached: true,
      created_at: "2026-06-04T10:00:00.000Z",
      draw_date: "2026-06-04T00:00:00.000Z",
      fortune_content: "**星座**：摩羯座\n「事业」稳步推进",
      id: "fortune_1",
      image_url: "data:image/svg+xml,%3Csvg%3E%3C/svg%3E",
      user_id: "user_1"
    });
  });

  it("maps try queue links to legacy TimePick field names", () => {
    expect(
      mapTimePickTryQueueLink({
        archivedAt: null,
        completeTime: new Date("2026-06-04T11:00:00.000Z"),
        convertedToResourceId: "resource_1",
        createdAt: new Date("2026-06-04T10:00:00.000Z"),
        description: "Read before implementation",
        id: "todo_1",
        isPriorityLocked: true,
        notes: "Good reference",
        priorityLevel: "high",
        priorityScore: 80,
        queuePosition: 1,
        rating: 5,
        startTime: new Date("2026-06-04T10:30:00.000Z"),
        status: "completed",
        tags: ["api"],
        title: "API 迁移",
        updatedAt: new Date("2026-06-04T11:01:00.000Z"),
        url: "https://example.com/api",
        userId: "user_1"
      })
    ).toEqual({
      archived_at: null,
      complete_time: "2026-06-04T11:00:00.000Z",
      converted_to_resource_id: "resource_1",
      created_at: "2026-06-04T10:00:00.000Z",
      description: "Read before implementation",
      id: "todo_1",
      is_priority_locked: true,
      notes: "Good reference",
      priority_level: "high",
      priority_score: 80,
      queue_position: 1,
      rating: 5,
      start_time: "2026-06-04T10:30:00.000Z",
      status: "completed",
      tags: ["api"],
      title: "API 迁移",
      updated_at: "2026-06-04T11:01:00.000Z",
      url: "https://example.com/api",
      user_id: "user_1"
    });
  });

  it("builds resource scopes for all, folder direct, folder recursive, and tags views", () => {
    expect(buildTimePickResourceScope({ selectedType: "all" })).toEqual({ kind: "all" });
    expect(buildTimePickResourceScope({ folderId: "folder_1", selectedType: "folder" })).toEqual({
      folderIds: ["folder_1"],
      kind: "folders"
    });
    expect(
      buildTimePickResourceScope({
        descendantFolderIds: ["folder_2", "folder_3"],
        displayMode: "resource-only",
        folderId: "folder_1",
        selectedType: "folder"
      })
    ).toEqual({
      folderIds: ["folder_1", "folder_2", "folder_3"],
      kind: "folders"
    });
    expect(buildTimePickResourceScope({ selectedType: "tags" })).toEqual({ kind: "all" });
  });

  it("allows moving a resource only when the resource and target folder belong to the requester", () => {
    expect(
      canMoveTimePickResource({
        requesterUserId: "user_1",
        resourceOwnerUserId: "user_1",
        targetFolderOwnerUserId: "user_1"
      })
    ).toBe(true);
    expect(
      canMoveTimePickResource({
        requesterUserId: "user_1",
        resourceOwnerUserId: "user_2",
        targetFolderOwnerUserId: "user_1"
      })
    ).toBe(false);
    expect(
      canMoveTimePickResource({
        requesterUserId: "user_1",
        resourceOwnerUserId: "user_1",
        targetFolderOwnerUserId: "user_2"
      })
    ).toBe(false);
    expect(
      canMoveTimePickResource({
        requesterUserId: "user_1",
        resourceOwnerUserId: "user_1",
        targetFolderOwnerUserId: null
      })
    ).toBe(true);
  });

  it("allows deleting a resource only when the resource belongs to the requester", () => {
    expect(
      canDeleteTimePickResource({
        requesterUserId: "user_1",
        resourceOwnerUserId: "user_1"
      })
    ).toBe(true);
    expect(
      canDeleteTimePickResource({
        requesterUserId: "user_1",
        resourceOwnerUserId: "user_2"
      })
    ).toBe(false);
  });

  it("normalizes search keywords before storing and querying", () => {
    expect(normalizeTimePickSearchKeyword("  产品   复盘  ")).toBe("产品 复盘");
    expect(normalizeTimePickSearchKeyword("   ")).toBe("");
  });

  it("maps search history to legacy TimePick field names", () => {
    expect(
      mapTimePickSearchHistory({
        createdAt: new Date("2026-06-04T10:00:00.000Z"),
        id: "history_1",
        keyword: "产品复盘",
        userId: "user_1"
      })
    ).toEqual({
      created_at: "2026-06-04T10:00:00.000Z",
      id: "history_1",
      keyword: "产品复盘",
      user_id: "user_1"
    });
  });

  it("maps user roles to legacy TimePick field names", () => {
    expect(
      mapTimePickUserRole({
        createdAt: new Date("2026-06-04T10:00:00.000Z"),
        id: "role_1",
        role: "collector",
        userId: "user_1"
      })
    ).toEqual({
      created_at: "2026-06-04T10:00:00.000Z",
      id: "role_1",
      role: "collector",
      user_id: "user_1"
    });
  });

  it("normalizes valid roles and rejects invalid role values", () => {
    expect(normalizeTimePickRole(" collector ")).toBe("collector");
    expect(normalizeTimePickRole("searcher")).toBe("searcher");
    expect(normalizeTimePickRole("admin")).toBe(null);
    expect(normalizeTimePickRole("")).toBe(null);
  });

  it("matches resources by name, notes, url, content, or tags", () => {
    const resource = {
      content: "这是一份平台迁移记录",
      name: "TimePick 搜索页",
      notes: "后续联调",
      tags: ["api", "搜索"],
      url: "https://example.com/search"
    };

    expect(resourceMatchesTimePickSearchKeyword(resource, "timepick")).toBe(true);
    expect(resourceMatchesTimePickSearchKeyword(resource, "联调")).toBe(true);
    expect(resourceMatchesTimePickSearchKeyword(resource, "example.com")).toBe(true);
    expect(resourceMatchesTimePickSearchKeyword(resource, "平台迁移")).toBe(true);
    expect(resourceMatchesTimePickSearchKeyword(resource, "API")).toBe(true);
    expect(resourceMatchesTimePickSearchKeyword(resource, "不存在")).toBe(false);
  });

  it("allows deleting search history only when the record belongs to the requester", () => {
    expect(
      canDeleteTimePickSearchHistory({
        requesterUserId: "user_1",
        searchHistoryOwnerUserId: "user_1"
      })
    ).toBe(true);
    expect(
      canDeleteTimePickSearchHistory({
        requesterUserId: "user_1",
        searchHistoryOwnerUserId: "user_2"
      })
    ).toBe(false);
  });

  it("normalizes resource mutation input before saving", () => {
    expect(
      normalizeTimePickResourceInput({
        content: "",
        file_size: 512,
        folder_id: "none",
        name: "  Research Notes  ",
        notes: "  remember this  ",
        section_id: "section_1",
        source_inspiration_id: "",
        tags: [" ai ", "", "ai", "planning"],
        thumbnail_url: "",
        url: "  https://example.com  "
      })
    ).toEqual({
      content: null,
      fileSize: 512n,
      folderId: null,
      name: "Research Notes",
      notes: "remember this",
      sectionId: "section_1",
      sourceInspirationId: null,
      tags: ["ai", "planning"],
      thumbnailUrl: null,
      url: "https://example.com"
    });
  });

  it("normalizes inspiration mutation input before saving", () => {
    expect(
      normalizeTimePickInspirationInput({
        content: "  一个新想法  ",
        location: "  咖啡店  ",
        status: "converted"
      })
    ).toEqual({
      content: "一个新想法",
      location: "咖啡店",
      status: "converted"
    });
    expect(
      normalizeTimePickInspirationInput({
        content: "  ",
        location: "",
        status: "unexpected"
      })
    ).toEqual({
      content: "",
      location: null,
      status: "active"
    });
  });

  it("normalizes learning focus input before saving", () => {
    expect(
      normalizeTimePickLearningFocusInput({
        is_paused: true,
        name: "  React  ",
        synonyms: [" hooks ", "hooks", "", "组件"],
        weight: 2
      })
    ).toEqual({
      isPaused: true,
      name: "React",
      synonyms: ["hooks", "组件"],
      weight: 2
    });
    expect(
      normalizeTimePickLearningFocusInput({
        name: "  ",
        weight: 99
      })
    ).toEqual({
      isPaused: false,
      name: "",
      synonyms: [],
      weight: 1
    });
  });

  it("normalizes profile birth dates and rejects invalid or future dates", () => {
    expect(normalizeTimePickProfileBirthDate(" 1990-01-02 ")).toEqual({
      birthDate: new Date("1990-01-02T00:00:00.000Z"),
      error: null
    });
    expect(normalizeTimePickProfileBirthDate("")).toEqual({
      birthDate: null,
      error: "请选择出生日期。"
    });
    expect(normalizeTimePickProfileBirthDate("not-a-date")).toEqual({
      birthDate: null,
      error: "出生日期格式无效。"
    });
    expect(normalizeTimePickProfileBirthDate("2999-01-01")).toEqual({
      birthDate: null,
      error: "出生日期不能晚于今天。"
    });
  });

  it("normalizes fortune draw dates to a local day boundary", () => {
    expect(normalizeTimePickFortuneDrawDate(new Date("2026-06-04T15:30:00.000Z"))).toEqual(
      new Date("2026-06-04T00:00:00.000Z")
    );
  });

  it("normalizes try queue input before saving", () => {
    expect(
      normalizeTimePickTryQueueInput({
        description: "  description  ",
        is_priority_locked: true,
        notes: "",
        priority_level: "high",
        priority_score: 120,
        rating: 6,
        status: "unexpected",
        tags: [" api ", "api", ""],
        title: "  API 迁移  ",
        url: "  https://example.com/api  "
      })
    ).toEqual({
      description: "description",
      isPriorityLocked: true,
      notes: null,
      priorityLevel: "high",
      priorityScore: 100,
      rating: 5,
      status: "unstarted",
      tags: ["api"],
      title: "API 迁移",
      url: "https://example.com/api"
    });
  });

  it("normalizes valid try queue statuses and rejects invalid values", () => {
    expect(normalizeTimePickTryQueueStatus(" trying ")).toBe("trying");
    expect(normalizeTimePickTryQueueStatus("completed")).toBe("completed");
    expect(normalizeTimePickTryQueueStatus("unexpected")).toBe("unstarted");
    expect(normalizeTimePickTryQueueStatus(null)).toBe("unstarted");
  });

  it("allows writing a resource only when the resource belongs to the requester", () => {
    expect(
      canWriteTimePickResource({
        requesterUserId: "user_1",
        resourceOwnerUserId: "user_1"
      })
    ).toBe(true);
    expect(
      canWriteTimePickResource({
        requesterUserId: "user_1",
        resourceOwnerUserId: "user_2"
      })
    ).toBe(false);
  });

  it("allows writing an inspiration only when it belongs to the requester", () => {
    expect(
      canWriteTimePickInspiration({
        inspirationOwnerUserId: "user_1",
        requesterUserId: "user_1"
      })
    ).toBe(true);
    expect(
      canWriteTimePickInspiration({
        inspirationOwnerUserId: "user_2",
        requesterUserId: "user_1"
      })
    ).toBe(false);
  });

  it("allows writing a learning focus only when it belongs to the requester", () => {
    expect(
      canWriteTimePickLearningFocus({
        focusOwnerUserId: "user_1",
        requesterUserId: "user_1"
      })
    ).toBe(true);
    expect(
      canWriteTimePickLearningFocus({
        focusOwnerUserId: "user_2",
        requesterUserId: "user_1"
      })
    ).toBe(false);
  });

  it("allows writing a profile only when it belongs to the requester", () => {
    expect(
      canWriteTimePickProfile({
        profileOwnerUserId: "user_1",
        requesterUserId: "user_1"
      })
    ).toBe(true);
    expect(
      canWriteTimePickProfile({
        profileOwnerUserId: "user_2",
        requesterUserId: "user_1"
      })
    ).toBe(false);
  });

  it("allows writing a try queue link only when it belongs to the requester", () => {
    expect(
      canWriteTimePickTryQueueLink({
        requesterUserId: "user_1",
        tryQueueLinkOwnerUserId: "user_1"
      })
    ).toBe(true);
    expect(
      canWriteTimePickTryQueueLink({
        requesterUserId: "user_1",
        tryQueueLinkOwnerUserId: "user_2"
      })
    ).toBe(false);
  });

  it("allows resource section and folder references only inside the requester scope", () => {
    const sections = [{ id: "section_1" }, { id: "section_2" }];
    const folders = [
      { id: "folder_1", userId: "user_1" },
      { id: "folder_2", userId: "user_2" }
    ];

    expect(
      canUseTimePickResourceReferences({
        folderId: "folder_1",
        folders,
        sectionId: "section_1",
        sections,
        userId: "user_1"
      })
    ).toBe(true);
    expect(
      canUseTimePickResourceReferences({
        folderId: null,
        folders,
        sectionId: "section_2",
        sections,
        userId: "user_1"
      })
    ).toBe(true);
    expect(
      canUseTimePickResourceReferences({
        folderId: "folder_2",
        folders,
        sectionId: "section_1",
        sections,
        userId: "user_1"
      })
    ).toBe(false);
    expect(
      canUseTimePickResourceReferences({
        folderId: null,
        folders,
        sectionId: "missing_section",
        sections,
        userId: "user_1"
      })
    ).toBe(false);
  });

  it("normalizes folder names before mutation", () => {
    expect(normalizeTimePickFolderName("  工作资料  ")).toBe("工作资料");
    expect(normalizeTimePickFolderName("   ")).toBe("");
  });

  it("detects sibling folder name conflicts while excluding the edited folder", () => {
    const folders = [
      { id: "folder_1", name: "Inbox", parentId: null, userId: "user_1" },
      { id: "folder_2", name: "Inbox", parentId: "parent_1", userId: "user_1" },
      { id: "folder_3", name: "Archive", parentId: null, userId: "user_2" }
    ];

    expect(
      hasSiblingTimePickFolderNameConflict({
        excludeFolderId: null,
        folders,
        name: "Inbox",
        parentId: null,
        userId: "user_1"
      })
    ).toBe(true);
    expect(
      hasSiblingTimePickFolderNameConflict({
        excludeFolderId: "folder_1",
        folders,
        name: "Inbox",
        parentId: null,
        userId: "user_1"
      })
    ).toBe(false);
    expect(
      hasSiblingTimePickFolderNameConflict({
        excludeFolderId: null,
        folders,
        name: "Inbox",
        parentId: "parent_1",
        userId: "user_1"
      })
    ).toBe(true);
    expect(
      hasSiblingTimePickFolderNameConflict({
        excludeFolderId: null,
        folders,
        name: "Archive",
        parentId: null,
        userId: "user_1"
      })
    ).toBe(false);
  });

  it("allows updating a folder parent only inside the requester tree and without cycles", () => {
    const folders = [
      { id: "root", parentId: null, userId: "user_1" },
      { id: "child", parentId: "root", userId: "user_1" },
      { id: "grandchild", parentId: "child", userId: "user_1" },
      { id: "other_root", parentId: null, userId: "user_2" }
    ];

    expect(
      canUpdateTimePickFolderParent({
        folderId: "root",
        folders,
        requesterUserId: "user_1",
        targetParentId: null
      })
    ).toBe(true);
    expect(
      canUpdateTimePickFolderParent({
        folderId: "root",
        folders,
        requesterUserId: "user_1",
        targetParentId: "child"
      })
    ).toBe(false);
    expect(
      canUpdateTimePickFolderParent({
        folderId: "root",
        folders,
        requesterUserId: "user_1",
        targetParentId: "root"
      })
    ).toBe(false);
    expect(
      canUpdateTimePickFolderParent({
        folderId: "root",
        folders,
        requesterUserId: "user_1",
        targetParentId: "other_root"
      })
    ).toBe(false);
  });
});
