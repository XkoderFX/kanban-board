import KanbanService from '../services/kanban.service';
import DropZone from './elements/dropzone.element';
import ItemView from './item.view';

interface ColumnElements {
  root: HTMLDivElement;
  title: HTMLHeadingElement;
  items: HTMLUListElement;
  addItem: HTMLButtonElement;
}
export default class Column {
  private elements: ColumnElements;

  constructor(
    private id: number,
    private title: string,
    private parentElement: Element
  ) {
    const root = this._createRoot() as HTMLDivElement;
    const titleElement = root.querySelector('.column__title') as HTMLDivElement;
    const items = root.querySelector('.column__items') as HTMLUListElement;
    const addItem = root.querySelector('.btn') as HTMLButtonElement;

    this.elements = {
      root,
      title: titleElement,
      items,
      addItem,
    };
    this._initHandlers();
  }

  private _initHandlers() {
    this.elements.addItem.addEventListener('click', this.onAddItem.bind(this));
  }

  onAddItem() {
    KanbanService.insertItem(this.id, '');
    this.renderItems();
  }

  render() {
    this.elements.root.dataset.id = this.id.toString();
    this.elements.title.textContent = this.title;
    this.renderItems();
    this.parentElement.append(this.elements.root);
  }

  renderItems() {
    this.elements.items.innerHTML = '';
    const topDropZone = DropZone.createRoot();
    this.elements.items.appendChild(topDropZone);

    KanbanService.getItemsByColumnId(this.id).forEach((item) => {
      const listItem = new ItemView(item.id, item.content, this.elements.items);
      listItem.render();
    });
  }

  private _createRoot() {
    const range = document.createRange();
    range.selectNode(document.body);
    return range.createContextualFragment(`
      <div class="kanban__column column">
        <h2 class="column__title"></h2>
        <ul class="column__items"></ul>
        <button class="btn column__btn">+ Add</button>
      </div>
    `).children[0];
  }
}
