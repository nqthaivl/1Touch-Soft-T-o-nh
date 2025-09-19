export interface Option {
  id: string;
  title: string;
  description?: string;
  default?: boolean;
}

export interface OptionGroup {
  id: string;
  title: string;
  type: 'card' | 'pill' | 'pose';
  allowMultiple: boolean;
  options: Option[];
  showSelectAll?: boolean;
}

export interface Section {
  id:string;
  title: string;
  description?: string;
  groups: OptionGroup[];
}

export interface SelectedOptionsState {
  [groupId: string]: string | string[] | null;
}

export interface GeneratedImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
}