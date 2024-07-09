export type PermissionConstants = {
  CREATE: string;
  UPDATE: string;
  READ: string;
  LIST: string;
  DELETE: string;
  ARCHIVE?: string;
  OWNED?: string;
  [key: string]: string;
};
