export abstract class BaseModel {

  public static create() {
    return Object.create(null);
  }

  public static fromObject<T>(obj: any, self: {create: () => T}) {
    if (!obj) { return; }

    const instance = self.create();
    Object.assign(instance, obj);

    return instance;
  }

  public static fromArray<T>(arr: Array<any>, self: {create: () => T; fromObject: Function}) {
    if (!Array.isArray(arr)) { return []; }

    return arr.map((item) => {
      const obj = self.fromObject(item, self);
      return obj as T;
    });
  }

  constructor() {}

}
