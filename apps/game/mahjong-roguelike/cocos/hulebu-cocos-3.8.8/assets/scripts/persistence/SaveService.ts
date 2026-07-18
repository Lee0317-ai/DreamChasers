export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface SaveCodec<T> {
  encode(value: T): unknown;
  decode(value: unknown): unknown;
}

export type SaveMigration = (value: unknown) => unknown;

export interface SaveServiceOptions<T> {
  readonly key: string;
  readonly storage: StoragePort;
  readonly codec: SaveCodec<T>;
  readonly validate: (value: unknown) => T;
  readonly canPersist: (value: T) => boolean;
  readonly schemaVersion: number;
  readonly contentVersion: string;
  readonly migrations?: Readonly<Record<number, SaveMigration>>;
  readonly now: () => string;
}

interface SaveEnvelope<T> {
  readonly schemaVersion: number;
  readonly contentVersion: string;
  readonly savedAt: string;
  readonly value: T;
}

export type SaveResult =
  | { readonly status: "committed"; readonly warnings: readonly string[] }
  | { readonly status: "rejected"; readonly reason: string }
  | { readonly status: "error"; readonly stage: "temp-write" | "temp-readback" | "primary-write"; readonly error: unknown };

export type LoadResult<T> =
  | { readonly status: "loaded"; readonly value: T; readonly migrated: boolean }
  | { readonly status: "empty" }
  | { readonly status: "quarantined"; readonly key: string; readonly reason: string }
  | { readonly status: "error"; readonly stage: "read" | "quarantine-write" | "quarantine-verify" | "primary-remove"; readonly error: unknown };

export type ClearResult =
  | { readonly status: "cleared" }
  | { readonly status: "error"; readonly error: unknown };

interface DecodedSave<T> {
  readonly value: T;
  readonly migrated: boolean;
}

export class SaveService<T> {
  private readonly options: SaveServiceOptions<T>;
  private quarantineCounter = 0;

  constructor(options: SaveServiceOptions<T>) {
    this.options = options;
  }

  save(value: T): SaveResult {
    let bytes: string;
    try {
      const validatedValue = this.options.validate(value);
      if (!this.options.canPersist(validatedValue)) {
        return {
          status: "rejected",
          reason: "Payload is not in a persistable phase.",
        };
      }

      const envelope: SaveEnvelope<unknown> = {
        schemaVersion: this.options.schemaVersion,
        contentVersion: this.options.contentVersion,
        savedAt: this.options.now(),
        value: this.options.codec.encode(validatedValue),
      };
      bytes = JSON.stringify(envelope);
    } catch (error) {
      return {
        status: "rejected",
        reason: errorMessage(error),
      };
    }

    const tempKey = `${this.options.key}.tmp`;
    try {
      this.options.storage.setItem(tempKey, bytes);
    } catch (error) {
      return { status: "error", stage: "temp-write", error };
    }

    try {
      const readback = this.options.storage.getItem(tempKey);
      if (readback !== bytes) {
        throw new Error("Temporary save byte readback did not match the serialized envelope.");
      }
      this.decodeCurrentEnvelope(readback);
    } catch (error) {
      return { status: "error", stage: "temp-readback", error };
    }

    let previousPrimary: string | null;
    try {
      previousPrimary = this.options.storage.getItem(this.options.key);
    } catch (error) {
      return { status: "error", stage: "primary-write", error };
    }

    try {
      this.options.storage.setItem(this.options.key, bytes);
    } catch (error) {
      this.restorePrimary(previousPrimary);
      return { status: "error", stage: "primary-write", error };
    }

    const warnings: string[] = [];
    try {
      this.options.storage.removeItem(tempKey);
    } catch (error) {
      warnings.push(`Temporary save cleanup failed: ${errorMessage(error)}`);
    }
    return { status: "committed", warnings };
  }

  load(): LoadResult<T> {
    let raw: string | null;
    try {
      raw = this.options.storage.getItem(this.options.key);
    } catch (error) {
      return { status: "error", stage: "read", error };
    }
    if (raw === null) {
      return { status: "empty" };
    }

    try {
      const decoded = this.decodeStoredBytes(raw);
      return {
        status: "loaded",
        value: decoded.value,
        migrated: decoded.migrated,
      };
    } catch (error) {
      return this.quarantine(raw, errorMessage(error));
    }
  }

  clear(): ClearResult {
    try {
      this.options.storage.removeItem(this.options.key);
      return { status: "cleared" };
    } catch (error) {
      return { status: "error", error };
    }
  }

  private decodeStoredBytes(raw: string): DecodedSave<T> {
    const parsed = JSON.parse(raw) as unknown;
    if (!isSaveEnvelope(parsed)) {
      return this.decodePayload(parsed, 0);
    }

    if (!Number.isInteger(parsed.schemaVersion) || parsed.schemaVersion < 0) {
      throw new Error(`Unknown save schemaVersion: ${String(parsed.schemaVersion)}.`);
    }
    if (parsed.schemaVersion > this.options.schemaVersion) {
      throw new Error(
        `Save schemaVersion ${parsed.schemaVersion} is newer than supported version ${this.options.schemaVersion}.`,
      );
    }
    if (parsed.contentVersion !== this.options.contentVersion) {
      throw new Error(`Incompatible contentVersion: ${String(parsed.contentVersion)}.`);
    }
    requireSavedAt(parsed.savedAt);
    return this.decodePayload(parsed.value, parsed.schemaVersion);
  }

  private decodeCurrentEnvelope(raw: string): T {
    const parsed = JSON.parse(raw) as unknown;
    if (!isSaveEnvelope(parsed)) {
      throw new Error("Temporary save did not contain an envelope.");
    }
    if (parsed.schemaVersion !== this.options.schemaVersion) {
      throw new Error(`Unexpected temporary schemaVersion: ${String(parsed.schemaVersion)}.`);
    }
    if (parsed.contentVersion !== this.options.contentVersion) {
      throw new Error(`Unexpected temporary contentVersion: ${String(parsed.contentVersion)}.`);
    }
    requireSavedAt(parsed.savedAt);
    return this.decodePersistable(parsed.value);
  }

  private decodePayload(payload: unknown, sourceVersion: number): DecodedSave<T> {
    let version = sourceVersion;
    let migratedPayload = payload;
    while (version < this.options.schemaVersion) {
      const migration = this.options.migrations?.[version];
      if (!migration) {
        throw new Error(`Unsupported save schemaVersion: ${version}.`);
      }
      migratedPayload = migration(migratedPayload);
      version += 1;
    }

    const value = this.decodePersistable(migratedPayload);
    return {
      value,
      migrated: sourceVersion !== this.options.schemaVersion,
    };
  }

  private decodeAndValidate(payload: unknown): T {
    return this.options.validate(this.options.codec.decode(payload));
  }

  private decodePersistable(payload: unknown): T {
    const value = this.decodeAndValidate(payload);
    if (!this.options.canPersist(value)) {
      throw new Error("Decoded payload is not in a persistable phase.");
    }
    return value;
  }

  private quarantine(raw: string, reason: string): LoadResult<T> {
    let quarantineKey: string;
    try {
      const timestamp = this.options.now();
      do {
        const counter = this.quarantineCounter;
        this.quarantineCounter += 1;
        quarantineKey = `${this.options.key}.quarantine.${timestamp}.${counter}`;
      } while (this.options.storage.getItem(quarantineKey) !== null);
      this.options.storage.setItem(quarantineKey, raw);
    } catch (error) {
      return { status: "error", stage: "quarantine-write", error };
    }

    try {
      const readback = this.options.storage.getItem(quarantineKey);
      if (readback !== raw) {
        throw new Error("Quarantine byte verification failed.");
      }
    } catch (error) {
      return { status: "error", stage: "quarantine-verify", error };
    }

    try {
      this.options.storage.removeItem(this.options.key);
    } catch (error) {
      this.restorePrimaryAfterFailedRemoval(raw);
      return { status: "error", stage: "primary-remove", error };
    }

    return {
      status: "quarantined",
      key: quarantineKey,
      reason,
    };
  }

  private restorePrimaryAfterFailedRemoval(raw: string): void {
    try {
      if (this.options.storage.getItem(this.options.key) === null) {
        this.options.storage.setItem(this.options.key, raw);
      }
    } catch {
      // The original primary is already retained by ports with failure-before-mutation semantics.
    }
  }

  private restorePrimary(previousPrimary: string | null): void {
    try {
      if (previousPrimary === null) {
        this.options.storage.removeItem(this.options.key);
      } else {
        this.options.storage.setItem(this.options.key, previousPrimary);
      }
    } catch {
      // StoragePort cannot expose a stronger rollback primitive.
    }
  }
}

function isSaveEnvelope(value: unknown): value is SaveEnvelope<unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return Object.prototype.hasOwnProperty.call(record, "schemaVersion")
    && Object.prototype.hasOwnProperty.call(record, "contentVersion")
    && Object.prototype.hasOwnProperty.call(record, "savedAt")
    && Object.prototype.hasOwnProperty.call(record, "value");
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function requireSavedAt(value: unknown): asserts value is string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error("Save envelope savedAt must be a non-empty string.");
  }
}
