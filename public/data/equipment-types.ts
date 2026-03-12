export interface EquipmentItem {
  name: string;
  image: string;
  src: string;
  category: '硬件' | '外设' | '软件';
  desc: string;
  info: Record<string, string>;
  tags: string[];
  date: string;
  money: number;
}

export interface CategoryConfig {
  key: '硬件' | '外设' | '软件';
  label: string;
  icon: string;
  color: string;
}
