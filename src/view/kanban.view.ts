import KanbanService from '../services/kanban.service';
import Column from './column.view';

export default class KanbanView {
  private root: HTMLElement;
  constructor(root: HTMLElement) {
    this.root = root;

    KanbanService.getColumns().forEach((column) => {
      const columnView = new Column(column.id, column.title, this.root);
      columnView.render();
    });
  }
}
