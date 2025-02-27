export type PermissionConstants = {
  CREATE: string;
  UPDATE: string;
  READ: string;
  LIST: string;
  DELETE: string;
  ARCHIVE?: string;
  RESTORE?: string;
  OWNED?: string;
  [key: string]: string;
};

export type CustomPermissionConstants = {
  [key: string]: string;
};
