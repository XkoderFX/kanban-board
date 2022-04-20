export type AppState = KanbanColumn[];

export interface KanbanColumn {
  id: number;
  title: string;
  items: {
    id: number;
    content: string;
  }[];
}

export interface UpdateProps {
  targetColumn?: number;
  position?: number;
  content?: string;
}

export default class KanbanModel {
  static getDefaultData(): AppState {
    return [
      {
        id: 1,
        title: 'Backlog',
        items: [],
      },
      {
        id: 2,
        title: 'In Progress',
        items: [],
      },
      {
        id: 3,
        title: 'Completed',
        items: [],
      },
    ];
  }

  static findAll() {
    const json = localStorage.getItem('kanban-data');
    if (!json) {
      return this.getDefaultData();
    }
    return JSON.parse(json) as AppState;
  }

  private static FindByIdAndReturnState(columnId: number) {
    const all = this.findAll();
    return { entry: all.find((column) => column.id === columnId), state: all };
  }

  static findById(columnId: number) {
    return this.FindByIdAndReturnState(columnId).entry;
  }

  static insertItem(columnId: number, content: string) {
    const { entry: column, state } = this.FindByIdAndReturnState(columnId);
    const item = {
      id: Date.now(),
      content,
    };
    column?.items.push(item);
    this.save(state);
  }

  static updateItem(itemId: number, data: UpdateProps) {
    const columns = this.findAll();
    let item, currentColumn;
    for (const column of columns) {
      const found = column.items.find((item) => item.id === itemId);
      if (found) {
        currentColumn = column;
        item = found;
      }
    }

    if (!item) {
      throw new Error(`no item with this id was found`);
    }


    if (data.targetColumn && (data.position || data.position === 0)) {
      const targetColumn = columns.find(
        (column) => column.id === data.targetColumn
      );
      if (!targetColumn) {
        throw new Error('Target Column has not been found');
      }

      currentColumn?.items.splice(currentColumn.items.indexOf(item));

      targetColumn.items.splice(data.position, 0, item);
    }

    this.save(columns);
  }

  static deleteItem(itemId: number) {
    const columns = this.findAll();
    let currentColumn;
    let currentIndex = -1;
    for (const column of columns) {
      const found = column.items.findIndex((item) => item.id === itemId);

      if (found > -1) {
        currentColumn = column;
        currentIndex = found;
      }
    }

    if (currentIndex < 0) {
      throw new Error('No item with this id found');
    }

    //@ts-ignore
    currentColumn.items.splice(currentIndex, 1);

    this.save(columns);
  }

  static save(data: AppState) {
    localStorage.setItem('kanban-data', JSON.stringify(data));
  }
}
