export interface EditorDef {
  fileSelect?: { [key: string]: FileSelectConfig };
  sections: SectionDef[];
}

interface FileSelectConfig {
  uploadComponent?: string;
}

interface BaseSectionDef {
  title: string;
  id: string;
  // optional: icon
  icon?: string;
}

interface BuiltinSectionDef extends BaseSectionDef {
  builtin: "files";
}

interface SinglePageSectionDef extends BaseSectionDef {
  layout: "single-page";
  view: ViewDef;
}

interface TabbedSectionDef extends BaseSectionDef {
  layout: "tabs";
  tabs: TabsDef[];
}

type SectionDef = BuiltinSectionDef | SinglePageSectionDef | TabbedSectionDef;

// Views and Tabs

interface TabsDef {
  name: string;
  id: string;
  view: ViewDef;
}

interface BaseViewDef {
  type: string;
}

interface ListViewDef extends BaseViewDef {
  type: "list";
  items: ItemDef[];
}

type TableCellData =
  | undefined
  | string
  | number
  | boolean
  | { type: "checkbox"; checked: boolean; onChange: (n: boolean) => void }
  | { type: "input"; value: string | number; onChange: (n: string) => void }
  | {
      type: "select";
      opts: { text: string; value: string }[];
      onChange: (n: string) => void;
    }
  | { type: "button"; content: string; onClick: () => void };

export interface TableViewDef extends BaseViewDef {
  type: "table";
  columns: string[];
  sortableColumns?: string[];
  ref?: string;
  refreshOnDataLoaded?: boolean;
  height?: number;
  numberOfRows: () => number;
  dataFor: (row: number, column: string) => TableCellData;
  onClick?: (row: number, column: number, component: any) => void;
  onSort?: (key: string, field: any, comp: any) => void;
}

interface CustomLegacyViewDef extends BaseViewDef {
  type: "custom-legacy";
  header_html: string;
  body_html: string;
}

interface VueViewDef extends BaseViewDef {
  type: "vue";
  component: string;
  ref?: string;
  data?: any;
}

export type ViewDef = ListViewDef | TableViewDef | CustomLegacyViewDef | VueViewDef;

// Controls

interface BaseControlDef {
  type: string;
  title: string;
  disabled?: boolean;
  ref?: string;
}

interface TextDef extends BaseControlDef {
  type: "text";
  content?: string;
}

interface ButtonControlDef extends BaseControlDef {
  type: "button";
  variant?: string;
  action: (e: MouseEvent) => void;
}

interface BindableControlDef {
  bind?:
    | string
    | {
        object: any;
        path: string;
        callback: (value: any, oldValue: any) => void;
      };
  value?: {
    current: any;
    callback: (value: any, oldValue: any) => void;
  };
}

interface CheckBoxControlDef extends BaseControlDef, BindableControlDef {
  type: "checkbox";
}

interface InputControlDef extends BaseControlDef, BindableControlDef {
  type: "input";
  format?: "int" | "float";
  layout?: "normal" | "compact";
}

interface SelectControlDef extends BaseControlDef, BindableControlDef {
  type: "select";
  layout?: "normal" | "compact";
  options: Array<{ value: string; text: string }>;
}

interface VueControlDef extends BaseControlDef {
  type: "vue";
  component: string;
  data?: any;
}

export type ItemDef =
  | TextDef
  | ButtonControlDef
  | CheckBoxControlDef
  | InputControlDef
  | SelectControlDef
  | VueControlDef;

// toolbar def

export type ToolbarDef = ToolbarSectionDef[];

interface ToolbarSectionDef {
  type: "input-group" | "btn-group" | "vue";
  id?: string;
  class?: string;
  items?: ToolbarControlDef[];
  component?: string;
}

interface ToolbarBaseControlDef {
  id?: string;
  class?: string;
  outlet?: string;
  type: string;
}

interface ToolbarBtnDef extends ToolbarBaseControlDef {
  type: "button";
  name: string;
  icon?: string;
  pressed?: boolean;
  callback: () => void;
}

interface ToolbarInputDef extends ToolbarBaseControlDef {
  type: "input";
  width?: number;
  callback?: () => void;
  mounted?: () => void;
}

interface ToolbarSelectDef extends ToolbarBaseControlDef {
  type: "select";
  width?: number;
  choices: Array<{ text: string; value: string }>;
}

interface ToolbarVueDef extends ToolbarBaseControlDef {
  type: "vue";
  component: string;
}

type ToolbarControlDef =
  | ToolbarBtnDef
  | ToolbarInputDef
  | ToolbarSelectDef
  | ToolbarVueDef;
