import KanbanModel, { UpdateProps } from '../model/kanban.model';

export default class KanbanService {
  static getColumns() {
    return KanbanModel.findAll();
  }
  static getItemsByColumnId(columnId: number) {
    const column = KanbanModel.findById(columnId);

    if (!column) {
      return [];
    }
    return column.items;
  }
  static insertItem(columnId: number, content: string) {
    KanbanModel.insertItem(columnId, content);
  }

  static updateItem(itemId: number, data: UpdateProps) {
    KanbanModel.updateItem(itemId, data);
  }

  static deleteItem(itemId: number) {
    KanbanModel.deleteItem(itemId);
  }
}
