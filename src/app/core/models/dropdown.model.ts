export interface IDropdownItem<T> {
  id: number;
  value: T;
  label: string;
  isDisable?: boolean;
}

export class DropdownItem<T> implements IDropdownItem<T> {
  id = -1;
  value: T = null as any;
  label = '';
  isDisable = false;

  constructor(dto?: IDropdownItem<T>) {
    if (!dto) {
      return;
    }
    this.id = dto.id;
    this.value = dto.value;
    this.label = dto.label;
    this.isDisable = dto.isDisable || false;
  }
}
